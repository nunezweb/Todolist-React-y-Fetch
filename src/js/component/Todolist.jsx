import React, { useEffect, useState } from "react";
import Icono from "./Icono";

const ToDoList = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const API_URL = "https://playground.4geeks.com/todo";
  const USER_TODO = "nunezweb";

  useEffect(() => {
    getTasks();
  }, []);

  async function createUser() {
    try {
      const response = await fetch(`${API_URL}/users/${USER_TODO}`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: USER_TODO,
        }),
      });
      if (response.status !== 201) {}
    } catch (error) {}
  }

  async function getTasks() {
    try {
      const response = await fetch(`${API_URL}/users/${USER_TODO}`);
      if (response.status === 404) {
        await createUser();
        const retryResponse = await fetch(`${API_URL}/users/${USER_TODO}`);
        if (!retryResponse.ok) {
          throw new Error('Error al obtener las tareas después de crear el usuario');
        }
        const retryData = await retryResponse.json();
        setTodos(retryData.todos);
      } else {
        const data = await response.json();
        setTodos(data.todos);
      }
    } catch (error) {}
  }

  async function addTodo(e) {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      try {
        const response = await fetch(`${API_URL}/todos/${USER_TODO}`, {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            label: inputValue,
            is_done: false,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          setInputValue("");
          getTasks();
        }
      } catch (error) {}
    }
  }

  async function handleClearAll() {
    try {
      const deletePromises = todos.map((todo) => {
        return fetch(`${API_URL}/todos/${todo.id}`, {
          method: "DELETE",
          headers: {
            accept: "application/json",
            "Content-type": "application/json",
          },
        }).catch((error) => {});
      });
      await Promise.all(deletePromises);
      setTodos([]);
      getTasks();
    } catch (error) {}
  }

  async function deleteTaksTodo(id) {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
        },
      });
      if (response && response.ok) {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id));
        getTasks();
      }
    } catch (error) {}
  }
  

  return (
    <div className="container todo-container">
      <div className="row">
        <div className="col">
          {todos.length > 0 && (
            <button className="btn btn-danger mt-3" onClick={handleClearAll}>
              Delete All
            </button>
          )}
        </div>
        <div className="col centerIcon">
          <Icono />
        </div>
        <div className="col task-count"> {todos.length} Task(s)</div>
      </div>
      <h1 className="todo-header">My To Do List</h1>
      <ul className="list-group">
        <li className="list-group-item">
          <input
            type="text"
            className="form-control todo-input"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            onKeyUp={addTodo}
            placeholder="✍️ What do you need to do?"
          />
        </li>
        {todos.map((item) => (
          <li className="list-group-item todo-item" key={item.id}>
            {item.label}
            <i
              className="fas fa-trash-alt icon-hide"
              onClick={() => deleteTaksTodo(item.id)}
            ></i>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDoList;
