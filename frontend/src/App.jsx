import React, { useState } from "react";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";

export default function App() {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <div className="app">
      <h1>TaskFlow</h1>
      {showLogin ? <Login /> : <Signup />}
      <p className="toggle" onClick={() => setShowLogin(!showLogin)}>
        {showLogin ? "Create account" : "Back to login"}
      </p>
    </div>
  );
}
