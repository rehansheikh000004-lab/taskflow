import React, { useEffect, useState } from "react";
import { API, authHeader } from "../api";

export default function Dashboard({ token, user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    try {
      const res = await fetch(`${API}/api/tasks`, { headers: authHeader(token) });
      if (!res.ok) throw new Error("Load failed");
      setTasks(await res.json());
    } catch { setMsg("Could not load tasks"); }
  }

  useEffect(() => { load(); }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return setMsg("Title required");
    try {
      const res = await fetch(`${API}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader(token) },
        body: JSON.stringify({ title, description: desc })
      });
      if (!res.ok) { const d = await res.json(); return setMsg(d.message || "Add failed"); }
      setTitle(""); setDesc("");
      await load();
      setMsg("Task added");
    } catch { setMsg("Network error"); }
  }

  async function toggleComplete(t) {
    try {
      await fetch(`${API}/api/tasks/${t._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader(token) },
        body: JSON.stringify({ completed: !t.completed })
      });
      await load();
    } catch { setMsg("Update failed"); }
  }

  async function removeTask(id) {
    try {
      await fetch(`${API}/api/tasks/${id}`, {
        method: "DELETE",
        headers: authHeader(token)
      });
      await load();
    } catch { setMsg("Delete failed"); }
  }

  return (
    <div className="card">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h2>Welcome, {user?.name || user?.email}</h2>
        <button onClick={onLogout}>Logout</button>
      </div>

      <form onSubmit={addTask}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title" required />
        <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description (optional)" />
        <button type="submit">Add task</button>
      </form>

      <p className={msg.includes("failed") ? "err" : "ok"}>{msg}</p>

      <ul className="taskList">
        {tasks.map(t => (
          <li key={t._id} className={t.completed ? "completed" : ""}>
            <div>
              <input type="checkbox" checked={t.completed} onChange={()=>toggleComplete(t)} />
              <strong>{t.title}</strong> — {t.description}
            </div>
            <div>
              <button onClick={()=>removeTask(t._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
