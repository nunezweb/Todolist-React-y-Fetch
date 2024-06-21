import React, { useEffect, useState } from "react";
import Icono from "./Icono";

const ToDoList = () => {
  const [inputValue, setInputValue] = useState("");
  const [toDos, setToDos] = useState([]);

  async function handleClearAll() {
    const deletePromises = toDos.map((todo) => {
      return fetch(`https://playground.4geeks.com/todo/todos/${todo.id}`, {
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
    setToDos([]);
    getTasks();
  }

  useEffect(() => {
    getTasks();
  }, []);

  async function getTasks() {
    const response = await fetch(
      "https://playground.4geeks.com/todo/users/nunezweb"
    );
    const data = await response.json();
    setToDos(data.todos);
  }

  async function addTodo(e) {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const response = await fetch(
        "https://playground.4geeks.com/todo/todos/nunezweb",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            label: inputValue,
            is_done: false,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setInputValue("");
        getTasks();
      }
    }
  }

  async function deleteTaksTodo(id) {
    const response = await fetch(
      `https://playground.4geeks.com/todo/todos/${id}`,
      {
        method: "DELETE",
        headers: {
          accept: "application/json",
          "Content-type": "application/json",
        },
      }
    );
    if (response.ok) {
      setToDos(toDos.filter((t) => t.id !== id));
      getTasks();
    }
  }

  return (
    <div className="container todo-container">
      <div className="row">
        <div className="col">
          {toDos.length > 0 && (
            <button className="btn btn-danger mt-3" onClick={handleClearAll}>
              Delete All
            </button>
          )}
        </div>
        <div className="col centerIcon">
          <Icono />
        </div>
        <div className="col task-count"> {toDos.length} Task(s)</div>
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
        {toDos.map((item) => (
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
