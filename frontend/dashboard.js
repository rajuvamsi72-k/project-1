const API_URL = "http://localhost:5000/api";

// Initialize
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    setupEventListeners();
    loadExpenses();
});

function setupEventListeners() {
    document.getElementById("addExpenseForm").addEventListener("submit", handleAddExpense);
    document.getElementById("editExpenseForm").addEventListener("submit", handleEditExpense);
}

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "index.html";
    }
    setUserWelcome();
}

// Set user welcome message
async function setUserWelcome() {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_URL}/expenses`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
            const expenses = await response.json();
            if (Array.isArray(expenses) && expenses.length > 0) {
                const userName = expenses[0].user?.name || "User";
                document.getElementById("userWelcome").textContent = `Welcome back!`;
            }
        }
    } catch (error) {
        console.error("Error fetching user info:", error);
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
            // Calculate total
            const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
            document.getElementById("totalAmount").textContent = `₹${total.toFixed(2)}`;
            document.getElementById("expenseCount").textContent = `${expenses.length} ${expenses.length === 1 ? 'expense' : 'expenses'}`;

            if (expenses.length === 0) {
                expensesList.innerHTML = '<p class="loading">No expenses yet. Add one to get started! 💰</p>';
                return;
            }

            expensesList.innerHTML = expenses
                .map((expense) => {
                    const date = new Date(expense.date).toLocaleDateString();
                    const amount = parseFloat(expense.amount).toFixed(2);
                    const categoryEmoji = getCategoryEmoji(expense.category);
                    return `
                        <div class="expense-item">
                            <div class="expense-info">
                                <div class="expense-title">${categoryEmoji} ${expense.title}</div>
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

// Get category emoji
function getCategoryEmoji(category) {
    const emojis = {
        "Food": "🍽️",
        "Transport": "🚗",
        "Entertainment": "🎬",
        "Utilities": "💡",
        "Shopping": "🛍️",
        "Other": "📌"
    };
    return emojis[category] || "📌";
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
    window.location.href = "index.html";
}

// Close modal on outside click
window.addEventListener("click", function(event) {
    const modal = document.getElementById("editModal");
    if (event.target == modal) {
        closeEditModal();
    }
});
