import React, { useState } from "react";
import { API } from "../api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e) {
    e.preventDefault();
    setMsg("Logging in...");
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) return setMsg(data.message || "Login failed");
      setMsg("Login OK");
      onLogin(data.token, data.user);
    } catch (err) {
      setMsg("Network error");
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Login</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
      <button type="submit">Login</button>
      <p className={msg.includes("OK") ? "ok" : "err"}>{msg}</p>
    </form>
  );
}
