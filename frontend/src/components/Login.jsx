import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../api";

export default function Login(){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [err,setErr]=useState("");
  const nav = useNavigate();

  const submit = async (e)=>{
    e.preventDefault();
    try{
      const { data } = await API.post("/auth/login", { email, password });
      // data: { token, user }
      localStorage.setItem("token", data.token);
      nav("/dashboard");
    }catch(err){
      setErr(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:420, margin:"0 auto"}}>
        <h2>Login</h2>
        <form onSubmit={submit}>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </form>
        <p className="small">{err}</p>
        <p className="small">No account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
}
