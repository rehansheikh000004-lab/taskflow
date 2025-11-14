/* script.js — TodoMaster premium UI
   Update API_BASE to your backend URL (no trailing slash)
   Example: const API_BASE = "https://taskflow-backend.onrender.com";
*/
const API_BASE = "https://taskflow-szvc.onrender.com"; // <<-- EDIT THIS

// DOM
const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const authForm = document.getElementById("auth-form");
const authBtn = document.getElementById("auth-btn");
const authMsg = document.getElementById("auth-msg");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const logoutBtn = document.getElementById("logout-btn");
const userInfo = document.getElementById("user-info");
const addForm = document.getElementById("add-form");
const addBtn = document.getElementById("add-btn");
const taskInput = document.getElementById("task-input");
const tasksDiv = document.getElementById("tasks");
const todoMsg = document.getElementById("todo-msg");

let isLogin = true;

// Tab behavior
tabLogin.addEventListener("click", () => setTab(true));
tabSignup.addEventListener("click", () => setTab(false));

function setTab(login) {
  isLogin = login;
  tabLogin.classList.toggle("active", login);
  tabSignup.classList.toggle("active", !login);
  authMsg.textContent = "";
  authBtn.textContent = login ? "Login" : "Sign up";
  // username label stays same — same input used
}

// Auth submit
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  authMsg.textContent = "Working…";
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) {
    authMsg.textContent = "Enter username & password";
    return;
  }

  try {
    const endpoint = isLogin ? "/login" : "/signup";
    const res = await fetch(`${API_BASE}${"/api/auth"}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    // handle HTML error responses
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { throw new Error("Server returned non-JSON response"); }

    if (!res.ok) throw new Error(data.message || "Request failed");

    authMsg.textContent = data.message || (isLogin ? "Login success" : "Signup success");

    if (isLogin && data.token) {
      localStorage.setItem("tm_token", data.token);
      localStorage.setItem("tm_user", username);
      afterLogin();
    } else if (!isLogin) {
      // after signup, auto switch to login
      setTab(true);
      authMsg.textContent = "Account created. Please login.";
    }

  } catch (err) {
    console.error(err);
    authMsg.textContent = err.message;
  }
});

// After login UI
function afterLogin() {
  const user = localStorage.getItem("tm_user") || "You";
  userInfo.textContent = `Signed in as ${user}`;
  loadTasks();
}

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("tm_token");
  localStorage.removeItem("tm_user");
  userInfo.textContent = "";
  tasksDiv.innerHTML = "";
});

// add task
addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return (todoMsg.textContent = "Type a task");
  todoMsg.textContent = "Saving…";

  const token = localStorage.getItem("tm_token");
  if (!token) return (todoMsg.textContent = "Please login");

  try {
    const res = await fetch(`${API_BASE}/add-task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, text })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed");
    taskInput.value = "";
    todoMsg.textContent = data.message || "Saved";
    await loadTasks();
  } catch (err) {
    console.error(err);
    todoMsg.textContent = err.message;
  }
});

// load tasks
async function loadTasks() {
  tasksDiv.innerHTML = "";
  todoMsg.textContent = "Loading…";
  const token = localStorage.getItem("tm_token");
  if (!token) { todoMsg.textContent = "Please login"; return; }

  try {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Load failed");

    const tasks = data.tasks || [];
    if (tasks.length === 0) {
      tasksDiv.innerHTML = `<p class="muted small">No tasks yet — add one!</p>`;
      todoMsg.textContent = "";
      return;
    }

    tasksDiv.innerHTML = tasks.map(t => renderTask(t)).join("");
    todoMsg.textContent = "";
  } catch (err) {
    console.error(err);
    todoMsg.textContent = err.message;
  }
}

// render task HTML
function renderTask(t) {
  const cls = t.completed ? "task completed" : "task";
  // sanitize text basic
  const safeText = String(t.text).replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `
    <div class="${cls}" data-id="${t._id}">
      <div class="left">
        <input type="checkbox" ${t.completed ? "checked" : ""} onchange="toggleComplete(event, '${t._id}')">
        <div>
          <div class="title">${safeText}</div>
          <div class="muted small">${new Date(t.createdAt||t._id.slice(0,8)*1000).toLocaleString()}</div>
        </div>
      </div>
      <div>
        <button class="btn ghost" onclick="deleteTask('${t._id}')">Delete</button>
      </div>
    </div>
  `;
}

// toggle complete
window.toggleComplete = async function(ev, id) {
  const token = localStorage.getItem("tm_token");
  if (!token) return (todoMsg.textContent = "Please login");
  todoMsg.textContent = "Updating…";
  try {
    const res = await fetch(`${API_BASE}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, taskId: id })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed");
    await loadTasks();
    todoMsg.textContent = data.message || "";
  } catch (err) {
    console.error(err);
    todoMsg.textContent = err.message;
  }
};

// delete task
window.deleteTask = async function(id) {
  const token = localStorage.getItem("tm_token");
  if (!token) return (todoMsg.textContent = "Please login");
  todoMsg.textContent = "Deleting…";
  try {
    const res = await fetch(`${API_BASE}/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, taskId: id })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed");
    await loadTasks();
    todoMsg.textContent = data.message || "";
  } catch (err) {
    console.error(err);
    todoMsg.textContent = err.message;
  }
};

// Auto-check token on load
(function init() {
  const token = localStorage.getItem("tm_token");
  if (token) afterLogin();
  setTab(true);
})();
