const API_URL = "https://taskflow-szvc.onrender.com"; // your Render backend URL

const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

signupBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) return (message.textContent = "Enter all fields!");

  message.textContent = "Signing up...";

  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    message.textContent = data.message;
  } catch {
    message.textContent = "Server error ⚠️";
  }
});

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) return (message.textContent = "Enter all fields!");

  message.textContent = "Logging in...";

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    message.textContent = data.message;
  } catch {
    message.textContent = "Server error ⚠️";
  }
});
