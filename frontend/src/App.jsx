import React from "react";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";

function App() {
  const [showLogin, setShowLogin] = React.useState(true);

  return (
    <div className="app">
      <h1>TaskFlow App</h1>
      {showLogin ? <Login /> : <Signup />}
      <button onClick={() => setShowLogin(!showLogin)}>
        {showLogin ? "Create Account" : "Go to Login"}
      </button>
    </div>
  );
}

export default App;
