import React, { useState } from "react";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("tf_token") || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("tf_user")) || null);

  const onLogin = (t, u) => {
    localStorage.setItem("tf_token", t);
    localStorage.setItem("tf_user", JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const onLogout = () => {
    localStorage.removeItem("tf_token");
    localStorage.removeItem("tf_user");
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return (
      <div className="app">
        <h1>TaskFlow</h1>
        <div className="authBox">
          <Login onLogin={onLogin} />
          <Signup />
        </div>
      </div>
    );
  }

  return <Dashboard token={token} user={user} onLogout={onLogout} />;
}
