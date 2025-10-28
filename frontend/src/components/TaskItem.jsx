import React from "react";
import { API } from "../api";

export default function TaskItem({task, reload}){
  const toggle = async ()=> {
    await API.put(`/tasks/${task._id}`, { completed: !task.completed });
    reload();
  };
  const remove = async ()=> {
    await API.delete(`/tasks/${task._id}`);
    reload();
  };

  return (
    <div className="card">
      <h3 className={task.completed ? "completed" : ""}>{task.title}</h3>
      <p className="small">{task.priority} • {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</p>
      <p>{task.notes}</p>
      <div style={{display:"flex",gap:8,marginTop:8}}>
        <button onClick={toggle}>{task.completed ? "Mark Pending" : "Mark Done"}</button>
        <button onClick={remove} style={{background:"#ff6b6b"}}>Delete</button>
      </div>
    </div>
  );
}
