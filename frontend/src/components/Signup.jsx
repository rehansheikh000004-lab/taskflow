import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API } from "../api";

export default function Signup(){
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [err,setErr]=useState("");
  const nav = useNavigate();

  const submit = async (e)=>{
    e.preventDefault();
    try{
      await API.post("/auth/signup", { name, email, password });
      // after signup, auto-login (optional) — fetch login to get token
      const { data } = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      nav("/dashboard");
    }catch(err){
      setErr(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:420, margin:"0 auto"}}>
        <h2>Sign Up</h2>
        <form onSubmit={submit}>
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button type="submit">Create account</button>
        </form>
        <p className="small">{err}</p>
        <p className="small">Already have account? <Link to="/">Login</Link></p>
      </div>
    </div>
  );
}
