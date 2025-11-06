import React, { useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("Loading...");
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      setMsg(data.message || "Unknown response");
    } catch (err) {
      setMsg("Network or server error");
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
      <button type="submit">Sign up</button>
      <p className={msg && msg.includes("success") ? "ok" : "err"}>{msg}</p>
    </form>
  );
}
