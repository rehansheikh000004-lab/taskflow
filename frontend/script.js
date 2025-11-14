// Edit this to YOUR backend URL (no trailing slash), e.g.
// const API_BASE = "https://taskflow-szvc.onrender.com";
const API_BASE = "https://taskflow-szvc.onrender.com";

const authTitle = document.getElementById("auth-title");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const pwdInput = document.getElementById("password");
const authBtn = document.getElementById("auth-btn");
const toggleAuth = document.getElementById("toggle-auth");
const authMsg = document.getElementById("auth-msg");

const appSection = document.querySelector(".app");
const authSection = document.querySelector(".auth");
const userNameEl = document.getElementById("user-name");
const balanceEl = document.getElementById("balance");
const logoutBtn = document.getElementById("logout");

const txForm = document.getElementById("tx-form");
const txTitle = document.getElementById("tx-title");
const txType = document.getElementById("tx-type");
const txAmount = document.getElementById("tx-amount");
const txList = document.getElementById("tx-list");

let isLogin = true;

toggleAuth.addEventListener("click", () => {
  isLogin = !isLogin;
  authTitle.textContent = isLogin ? "Login" : "Signup";
  authBtn.textContent = isLogin ? "Login" : "Signup";
  authMsg.textContent = "";
  nameInput.style.display = isLogin ? "none" : "block";
});

// start with name hidden (login)
nameInput.style.display = "none";
authBtn.addEventListener("click", async () => {
  authMsg.textContent = "Working...";
  const email = emailInput.value.trim();
  const password = pwdInput.value.trim();
  const name = nameInput.value.trim();

  if (!email || !password) return authMsg.textContent = "Email and password required";

  try {
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const body = isLogin ? { email, password } : { name, email, password };

    const res = await fetch(API_BASE + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (!res.ok) return authMsg.textContent = data.message || "Error";

    if (isLogin) {
      localStorage.setItem("bt_token", data.token);
      localStorage.setItem("bt_user", JSON.stringify(data.user));
      showApp();
    } else {
      authMsg.textContent = "Account created — switch to login";
      toggleAuth.click();
    }
  } catch (err) {
    console.error(err);
    authMsg.textContent = "Network error";
  }
});

function showApp() {
  const user = JSON.parse(localStorage.getItem("bt_user") || "{}");
  userNameEl.textContent = user.name || user.email || "You";
  authSection.style.display = "none";
  appSection.style.display = "block";
  loadTx();
}

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("bt_token");
  localStorage.removeItem("bt_user");
  appSection.style.display = "none";
  authSection.style.display = "block";
});

txForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = txTitle.value.trim();
  const type = txType.value;
  const amount = Number(txAmount.value);
  if (!title || !amount) return;

  const token = localStorage.getItem("bt_token");
  if (!token) return alert("Login required");

  try {
    const res = await fetch(API_BASE + "/api/tx", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
      body: JSON.stringify({ title, type, amount })
    });
    if (!res.ok) {
      const d = await res.json();
      return alert(d.message || "Failed");
    }
    txTitle.value = ""; txAmount.value = "";
    await loadTx();
  } catch (err) { console.error(err); alert("Network error"); }
});

async function loadTx() {
  txList.innerHTML = "Loading...";
  const token = localStorage.getItem("bt_token");
  if (!token) return;

  try {
    const res = await fetch(API_BASE + "/api/tx", {
      headers: { "Authorization": "Bearer " + token }
    });
    if (!res.ok) {
      const d = await res.json();
      txList.innerHTML = `<div class="small">${d.message||"Error"}</div>`;
      return;
    }
    const list = await res.json();
    renderTx(list);
  } catch (err) { console.error(err); txList.innerHTML = "<div class='small'>Network error</div>"; }
}

function renderTx(list) {
  if (!Array.isArray(list) || list.length === 0) {
    txList.innerHTML = "<div class='small'>No transactions</div>";
    balanceEl.textContent = "Balance: 0";
    return;
  }
  let html = "";
  let balance = 0;
  for (const t of list) {
    html += `<div class="tx ${t.type === "income" ? "income" : "expense"}">
      <div>
        <div><strong>${escapeHtml(t.title)}</strong></div>
        <div class="small">${new Date(t.createdAt).toLocaleString()}</div>
      </div>
      <div>
        <div>${t.type === "income" ? "+" : "-"} ${t.amount}</div>
        <div style="margin-top:6px">
          <button onclick="deleteTx('${t._id}')" class="ghost">Delete</button>
        </div>
      </div>
    </div>`;
    balance += (t.type === "income" ? 1 : -1) * Number(t.amount);
  }
  txList.innerHTML = html;
  balanceEl.textContent = `Balance: ${balance}`;
}

window.deleteTx = async function(id) {
  const token = localStorage.getItem("bt_token");
  if (!token) return alert("Login required");
  if (!confirm("Delete this transaction?")) return;
  try {
    const res = await fetch(API_BASE + "/api/tx/" + id, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token }
    });
    const d = await res.json();
    if (!res.ok) return alert(d.message || "Failed");
    await loadTx();
  } catch (err) { console.error(err); alert("Network error"); }
};

function escapeHtml(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

// Auto-login if token exists
(function(){
  const token = localStorage.getItem("bt_token");
  if (token) showApp();
})();
