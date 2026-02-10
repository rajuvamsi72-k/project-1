const API_URL = "http://localhost:5000/api";

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    setupEventListeners();
});

function setupEventListeners() {
    // Auth Forms
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
    document.getElementById("registerForm").addEventListener("submit", handleRegister);
    
    // Expense Forms
    document.getElementById("addExpenseForm").addEventListener("submit", handleAddExpense);
    document.getElementById("editExpenseForm").addEventListener("submit", handleEditExpense);
}

// Check if user is already logged in
function checkAuth() {
    const token = localStorage.getItem("token");
    if (token) {
        showDashboard();
        loadExpenses();
    } else {
        showAuth();
    }
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
            showDashboard();
            loadExpenses();
            document.getElementById("loginForm").reset();
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
            showDashboard();
            loadExpenses();
            document.getElementById("registerForm").reset();
        } else {
            errorEl.textContent = data.message || "Registration failed";
        }
    } catch (error) {
        errorEl.textContent = "Network error. Please try again.";
        console.error("Register error:", error);
    }
}

// Handle Add Expense
async function handleAddExpense(e) {
    e.preventDefault();
    const title = document.getElementById("expenseTitle").value;
    const amount = document.getElementById("expenseAmount").value;
    const category = document.getElementById("expenseCategory").value;
    const date = document.getElementById("expenseDate").value;
    const errorEl = document.getElementById("addExpenseError");
    const token = localStorage.getItem("token");

    try {
        errorEl.textContent = "";
        const response = await fetch(`${API_URL}/expenses/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, amount, category, date: date || new Date() }),
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("addExpenseForm").reset();
            loadExpenses();
        } else {
            errorEl.textContent = data.message || "Failed to add expense";
        }
    } catch (error) {
        errorEl.textContent = "Network error. Please try again.";
        console.error("Add expense error:", error);
    }
}

// Load Expenses
async function loadExpenses() {
    const token = localStorage.getItem("token");
    const expensesList = document.getElementById("expensesList");

    try {
        const response = await fetch(`${API_URL}/expenses`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const expenses = await response.json();

        if (Array.isArray(expenses)) {
            if (expenses.length === 0) {
                expensesList.innerHTML = '<p class="loading">No expenses yet. Add one to get started!</p>';
                return;
            }

            expensesList.innerHTML = expenses
                .map((expense) => {
                    const date = new Date(expense.date).toLocaleDateString();
                    const amount = parseFloat(expense.amount).toFixed(2);
                    return `
                        <div class="expense-item">
                            <div class="expense-info">
                                <div class="expense-title">${expense.title}</div>
                                <div class="expense-details">${expense.category} • ${date}</div>
                            </div>
                            <div class="expense-amount">₹${amount}</div>
                            <div class="expense-actions">
                                <button class="btn-small btn-edit" onclick="openEditModal('${expense._id}', '${expense.title}', ${expense.amount}, '${expense.category}', '${new Date(expense.date).toISOString().split("T")[0]}')">Edit</button>
                                <button class="btn-small btn-delete" onclick="deleteExpense('${expense._id}')">Delete</button>
                            </div>
                        </div>
                    `;
                })
                .join("");
        } else {
            expensesList.innerHTML = '<p class="loading">Error loading expenses</p>';
        }
    } catch (error) {
        expensesList.innerHTML = '<p class="loading">Error loading expenses</p>';
        console.error("Load expenses error:", error);
    }
}

// Open Edit Modal
function openEditModal(id, title, amount, category, date) {
    document.getElementById("editExpenseId").value = id;
    document.getElementById("editExpenseTitle").value = title;
    document.getElementById("editExpenseAmount").value = amount;
    document.getElementById("editExpenseCategory").value = category;
    document.getElementById("editExpenseDate").value = date;
    document.getElementById("editModal").style.display = "flex";
}

// Close Edit Modal
function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
}

// Handle Edit Expense
async function handleEditExpense(e) {
    e.preventDefault();
    const id = document.getElementById("editExpenseId").value;
    const title = document.getElementById("editExpenseTitle").value;
    const amount = document.getElementById("editExpenseAmount").value;
    const category = document.getElementById("editExpenseCategory").value;
    const date = document.getElementById("editExpenseDate").value;
    const errorEl = document.getElementById("editExpenseError");
    const token = localStorage.getItem("token");

    try {
        errorEl.textContent = "";
        const response = await fetch(`${API_URL}/expenses/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title, amount, category, date }),
        });

        const data = await response.json();

        if (response.ok) {
            closeEditModal();
            loadExpenses();
        } else {
            errorEl.textContent = data.message || "Failed to update expense";
        }
    } catch (error) {
        errorEl.textContent = "Network error. Please try again.";
        console.error("Edit expense error:", error);
    }
}

// Delete Expense
async function deleteExpense(id) {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_URL}/expenses/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
            loadExpenses();
        } else {
            alert("Failed to delete expense");
        }
    } catch (error) {
        alert("Network error. Please try again.");
        console.error("Delete expense error:", error);
    }
}

// Logout
function logout() {
    localStorage.removeItem("token");
    showAuth();
    document.getElementById("loginForm").reset();
    document.getElementById("registerForm").reset();
}

// Show Auth Container
function showAuth() {
    document.getElementById("authContainer").style.display = "flex";
    document.getElementById("dashboardContainer").style.display = "none";
}

// Show Dashboard
function showDashboard() {
    document.getElementById("authContainer").style.display = "none";
    document.getElementById("dashboardContainer").style.display = "block";
}

// Close modal on outside click
window.addEventListener("click", function(event) {
    const modal = document.getElementById("editModal");
    if (event.target == modal) {
        closeEditModal();
    }
});
