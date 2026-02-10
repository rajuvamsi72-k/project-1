const API_URL = (() => {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
        return "http://localhost:5000/api";
    }
    return "https://expense-tracker-so5l.onrender.com/api";
})();

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
    document.getElementById("registerForm").addEventListener("submit", handleRegister);
}

// Switch between Login and Register tabs
function switchTab(tab) {
    document.querySelectorAll(".auth-form").forEach((form) => {
        form.classList.remove("active");
    });

    if (tab === "login") {
        document.getElementById("loginForm").classList.add("active");
    } else {
        document.getElementById("registerForm").classList.add("active");
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const errorEl = document.getElementById("loginError");

    try {
        errorEl.textContent = "";
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "dashboard.html";
        } else {
            errorEl.textContent = data.message || "Login failed";
        }
    } catch (error) {
        errorEl.textContent = "Network error. Please try again.";
        console.error("Login error:", error);
    }
}

// Handle Register
async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const errorEl = document.getElementById("registerError");

    try {
        errorEl.textContent = "";
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "dashboard.html";
        } else {
            errorEl.textContent = data.message || "Registration failed";
        }
    } catch (error) {
        errorEl.textContent = "Network error. Please try again.";
        console.error("Register error:", error);
    }
}
