import { useState } from "react";
import { signupUser } from "../api";

function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signupUser(form);
    if (res.success) setMessage("✅ Signup successful! Please log in.");
    else setMessage(`❌ ${res.message || "Signup failed"}`);
  };

  return (
    <div className="auth-page">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button type="submit">Create Account</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default Signup;
