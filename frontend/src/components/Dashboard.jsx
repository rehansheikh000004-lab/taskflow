import React, {useEffect, useState} from "react";
import { API } from "../api";
import TaskItem from "./TaskItem";

export default function Dashboard(){
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState("All");

  const load = async ()=>{
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(()=>{ load(); }, []);

  const add = async (e)=>{
    e.preventDefault();
    await API.post("/tasks", { title, priority, dueDate: dueDate || null, notes });
    setTitle(""); setPriority("Medium"); setDueDate(""); setNotes("");
    load();
  };

  const filtered = tasks.filter(t => filter === "All" ? true : filter === "Completed" ? t.completed : !t.completed);

  const logout = ()=> { localStorage.removeItem("token"); window.location.href="/"; };

  return (
    <div className="container">
      <div className="header">
        <h1>TaskFlow</h1>
        <div><button onClick={logout}>Logout</button></div>
      </div>

      <div className="card">
        <form onSubmit={add}>
          <input placeholder="Task title" value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea placeholder="Notes (optional)" value={notes} onChange={e=>setNotes(e.target.value)} />
          <div style={{display:"flex",gap:8}}>
            <select value={priority} onChange={e=>setPriority(e.target.value)}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
            <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
            <button type="submit">Add Task</button>
          </div>
        </form>
      </div>

      <div style={{display:"flex",gap:8,marginTop:12}}>
        <button onClick={()=>setFilter("All")}>All</button>
        <button onClick={()=>setFilter("Pending")}>Pending</button>
        <button onClick={()=>setFilter("Completed")}>Completed</button>
      </div>

      <div className="tasks-grid" style={{marginTop:12}}>
        {filtered.map(t => <TaskItem key={t._id} task={t} reload={load} />)}
      </div>
    </div>
  );
}
