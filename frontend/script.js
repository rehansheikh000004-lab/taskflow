const API_URL = "https://taskflow-szvc.onrender.com"; // Render backend URL

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const messageEl = document.getElementById("message");
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const notesSection = document.getElementById("notes-section");
const authSection = document.getElementById("auth-section");
const userNameSpan = document.getElementById("user-name");

signupBtn.onclick = async () => {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: usernameInput.value,
      password: passwordInput.value
    })
  });
  const data = await res.json();
  messageEl.textContent = data.message || "Signup failed";
};

loginBtn.onclick = async () => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: usernameInput.value,
      password: passwordInput.value
    })
  });
  const data = await res.json();
  messageEl.textContent = data.message || "Login failed";

  if (data.userId) {
    authSection.classList.add("hidden");
    notesSection.classList.remove("hidden");
    userNameSpan.textContent = usernameInput.value;
  }
};
