import React, { useEffect, useState } from "react";
import Icono from "./Icono";

const ToDoList = () => {
  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState([]);
  const API_URL = "https://playground.4geeks.com/todo";
  const USER_TODO = "nunezweb";

  useEffect(() => {
    (async () => {
      const response = await fetch(`${API_URL}/users/${USER_TODO}`);
      if (response.status === 404) {
        console.log("Usuario no existe, procedemos a crearlo");
        await createUser();
      }
      await getTasks();
    })().catch((error) => {
      console.error("Error:", error);
    });
  }, []);

  async function createUser() {
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
    if (response.status !== 201) {
      console.error("Error:", response.status, response.statusText);
    }
  }

  async function getTasks() {
    const response = await fetch(`${API_URL}/users/${USER_TODO}`);
    const data = await response.json();
    setTodos(data.todos);
  }

  async function addTodo(e) {
    if (e.key === "Enter" && inputValue.trim() !== "") {
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
      }).catch((error) => {
        console.error("Error:", error);
      });
      const data = await response.json();
      if (response.ok) {
        setInputValue("");
        getTasks();
      }
    }
  }

  async function handleClearAll() {
    const deletePromises = todos.map((todo) => {
      return fetch(`${API_URL}/todos/${todo.id}`, {
        method: "DELETE",
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
        },
      }).catch((error) => {
        console.error(`Error eliminando tarea con id ${todo.id}:`, error);
      });
    });
    await Promise.all(deletePromises);
    setTodos([]);
    getTasks();
  }

  async function deleteTaksTodo(id) {
    const response = await fetch(`${API_URL}/users/${USER_TODO}/todos/${id}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        "Content-type": "application/json",
      },
    }).catch((error) => {
      console.error("Error:", error);
    });
    if (response.ok) {
      setTodos(todos.filter((t) => t.id !== id));
      getTasks();
    }
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
