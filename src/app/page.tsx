"use client";

import { useEffect, useState } from "react";

interface Todo {
  _id: string;
  text: string;
  deadline?: string;
  createdAt: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editedText, setEditedText] = useState("");

  const fetchTodos = async (sortBy: string = "createdAt") => {
    const res = await fetch(`/api/todos?sortBy=${sortBy}`);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  async function addTodo() {
    if (text.trim() === "") return;

    const newTodo = {
      text,
      deadline: deadline || undefined,
    };

    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });
    const createdTodo = await res.json();

    setTodos([createdTodo, ...todos]);
    setText("");
    setDeadline("");
  }

  async function editTodo(id: string) {
    await fetch("/api/todos", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, text: editedText }),
    });

    setTodos(
      todos.map((todo) =>
        todo._id === id ? { ...todo, text: editedText } : todo
      )
    );
    setIsEditing(null);
    setEditedText("");
  }

  async function deleteTodo(id: string) {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setTodos(todos.filter((todo) => todo._id !== id));
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US");
  };

  return (
    <div className="p-5 font-sans">
      <h1 className="text-2xl font-bold mb-6">📝 Todo List</h1>

      {/* Task & Deadline Input */}
      <div className="flex mb-6 gap-4 items-end">
        {/* Task input */}
        <div className="flex flex-col flex-grow">
          <label
            htmlFor="task-input"
            className="text-sm font-medium text-gray-200 mb-3"
          >
            Task
          </label>
          <input
            id="task-input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new task..."
            className="px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Deadline input */}
        <div className="flex flex-col w-48">
          <label
            htmlFor="deadline-input"
            className="text-sm font-medium text-gray-200 mb-3"
          >
            Deadline
          </label>
          <input
            id="deadline-input"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Button */}
        <button
          onClick={addTodo}
          className="h-[42px] px-5 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Todo
        </button>
      </div>

      {/* My Tasks */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">My Tasks</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <select
            onChange={(e) => fetchTodos(e.target.value)}
            className="p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="createdAt">Creation Date</option>
            <option value="deadline">Deadline</option>
          </select>
        </div>
      </div>

      {/* Todo List */}
      <ul>
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="p-2 border-b last:border-b-0 flex justify-between items-center"
          >
            {isEditing === todo._id ? (
              <div className="flex-grow flex items-center gap-2">
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="p-2 border rounded-md flex-grow focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={() => editTodo(todo._id)}
                  className="px-3 py-1 bg-green-500 text-white rounded-md text-sm hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(null)}
                  className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <div>
                  <span>{todo.text}</span>
                  {todo.deadline && (
                    <span className="ml-2 text-xs text-red-500">
                      (Deadline: {formatDate(todo.deadline)})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(todo._id);
                      setEditedText(todo.text);
                    }}
                    className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
