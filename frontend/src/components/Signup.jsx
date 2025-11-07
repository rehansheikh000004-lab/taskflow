import React, { useState } from "react";
import { API } from "../api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMsg("Signing up...");
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      setMsg(data.message || (res.ok ? "Signup successful" : "Signup failed"));
    } catch {
      setMsg("Network error");
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Sign up</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name (optional)" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
      <button type="submit">Sign up</button>
      <p className={msg.includes("successful") ? "ok" : "err"}>{msg}</p>
    </form>
  );
}
