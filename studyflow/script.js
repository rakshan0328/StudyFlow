function showNotification(message, color = '#4a90e2') {
  const note = document.getElementById('notification');
  if (!note) return;
  note.textContent = message;
  note.style.backgroundColor = color;
  note.style.display = 'block';
  setTimeout(() => {
    note.style.display = 'none';
  }, 3000);
}

function getAllUsers() {
  return JSON.parse(localStorage.getItem('users')) || {};
}

function saveAllUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function setupDarkMode() {
  const toggleBtn = document.getElementById("darkModeToggle");
  const body = document.body;
  const logo = document.getElementById("logo");

  // Load saved mode on page load
  if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark");
    if (logo) logo.src = "logo.png"; // dark logo
  }

  toggleBtn?.addEventListener("click", () => {
    body.classList.toggle("dark");
    const enabled = body.classList.contains("dark");
    localStorage.setItem("darkMode", enabled ? "enabled" : "disabled");

    // 🔁 Swap logos
    if (logo) {
      logo.src = enabled ? "logo.png" : "logowhite.png";
    }
  });
}



function toggleAuth(view) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (view === 'register') {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  } else {
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  }
}

// Login/Register Init
document.addEventListener('DOMContentLoaded', () => {
  setupDarkMode();

  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');

  loginBtn?.addEventListener('click', () => {
    const username = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value.trim();
    const users = getAllUsers();

    if (username === 'Rakshan' && password === '098') {
      localStorage.setItem('loggedInUser', 'admin');
      showNotification('👑 Admin Logged In!', '#9b59b6');
      setTimeout(() => window.location.href = 'admin.html', 800);
      return;
    }

    if (users[username] && users[username].password === password) {
      localStorage.setItem('loggedInUser', username);
      showNotification('✅ Login Successful!', '#2ecc71');
      setTimeout(() => window.location.href = 'welcome.html', 800);
    } else {
      showNotification('🚫 Incorrect username or password!', '#e74c3c');
    }
  });

  registerBtn?.addEventListener('click', () => {
    const username = document.getElementById('registerUser').value.trim();
    const password = document.getElementById('registerPass').value.trim();
    const users = getAllUsers();

    if (!username || !password) {
      showNotification('⚠️ Please fill in all fields.', '#f39c12');
      return;
    }

    if (users[username]) {
      showNotification('🚫 Username already exists!', '#e74c3c');
      return;
    }

    users[username] = { password, assignments: [], minutes: 0 };
    saveAllUsers(users);
    showNotification('✅ Registered! Now login.', '#2ecc71');
    toggleAuth('login');
  });

  // Tab nav logic
  document.querySelectorAll('.nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-section');
      showSection(target);
    });
  });

  const currentPage = window.location.pathname;
  if (currentPage.includes('welcome.html')) {
    showSection('home');
    renderAssignments();
    renderProductivity();
  }
  if (currentPage.includes('admin.html')) {
    renderAdminPanel();
  }
});

// Tab Switcher
function showSection(id) {
  document.querySelectorAll('.content').forEach(section => {
    section.classList.remove('active');
  });
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

// GPA
function calculateGPA() {
  const input = document.getElementById("grades").value;
  const grades = input.split(',').map(n => parseFloat(n.trim()));
  if (grades.some(isNaN)) {
    showNotification("❌ Invalid input. Use numbers like: 90,85,78", "#e74c3c");
    return;
  }
  const average = grades.reduce((a, b) => a + b, 0) / grades.length;
  const gpa = (average / 25).toFixed(2);
  document.getElementById("gpa-result").textContent = `Your GPA: ${gpa}`;
}

// Calculator
function basicCalculate() {
  const input = document.getElementById("calc-input").value;
  try {
    const result = eval(input);
    document.getElementById("calc-display").value = result;
  } catch {
    showNotification("❌ Invalid expression!", "#e74c3c");
  }
}

// Add Assignment
function addAssignment() {
  const name = document.getElementById("assignmentName").value;
  const due = document.getElementById("dueDate").value;
  const priority = document.getElementById("priority").value;
  const time = document.getElementById("studyTime").value;
  const user = localStorage.getItem("loggedInUser");

  if (!name || !due || !time || !user) {
    showNotification("⚠️ Fill all fields!", "#f39c12");
    return;
  }

  const users = getAllUsers();
  users[user].assignments.push({ name, due, priority, time });
  saveAllUsers(users);
  renderAssignments();
  showNotification("✅ Assignment added!", "#2ecc71");

  document.getElementById("assignmentName").value = '';
  document.getElementById("dueDate").value = '';
  document.getElementById("studyTime").value = '';
}

// Show Assignments
function renderAssignments() {
  const user = localStorage.getItem("loggedInUser");
  const list = document.getElementById("assignmentList");
  const home = document.getElementById("home");

  if (!user || !list || !home) return;

  const users = getAllUsers();
  const assignments = users[user]?.assignments || [];

  const priorityOrder = { High: 1, Medium: 2, Low: 3 };
  const sorted = assignments.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  list.innerHTML = '';
  home.innerHTML = `<h2>🎉 Welcome to StudyFlow!</h2><h4>📌 My Assignments</h4><ul>${sorted.map(a =>
    `<li>${a.name} | ⏰ ${a.due} | ⏱ ${a.time} mins | 🔥 ${a.priority}</li>`).join("")}</ul>`;

  sorted.forEach(a => {
    const item = document.createElement("li");
    item.textContent = `${a.name} | Due: ${a.due} | ⏱ ${a.time} mins | 🔥 ${a.priority}`;
    list.appendChild(item);
  });
}

// Productivity
function renderProductivity() {
  const user = localStorage.getItem("loggedInUser");
  const users = getAllUsers();
  const span = document.getElementById("studyMinutes");
  if (span && users[user]) {
    span.textContent = users[user].minutes || 0;
  }
}
function addStudyTime() {
  const minutes = parseInt(prompt("Enter study time in minutes:"));
  const user = localStorage.getItem("loggedInUser");
  if (!user || isNaN(minutes)) return;
  const users = getAllUsers();
  users[user].minutes = (users[user].minutes || 0) + minutes;
  saveAllUsers(users);
  renderProductivity();
  showNotification("⏱ Study time added!");
}

// AI Assistant
function handleAIRequest() {
  const input = document.getElementById("aiInput").value;
  const output = document.getElementById("aiResponse");
  if (!input) {
    showNotification("❗ Enter something first.", "#e74c3c");
    return;
  }
  output.innerHTML = `
    <p><strong>Here's a custom plan for:</strong> <em>${input}</em></p>
    <ul>
      <li>📌 Break the task into 3 chunks</li>
      <li>📚 Study 25 mins each using Pomodoro</li>
      <li>🧠 Review + summarize before submission</li>
    </ul>`;
}

// Admin Panel Logic
function renderAdminPanel() {
  const userList = document.getElementById("userList");
  const userCount = document.getElementById("userCount");
  const users = getAllUsers();
  userList.innerHTML = '';
  const entries = Object.entries(users);
  entries.forEach(([username, data]) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${username}</strong>
      | Assignments: ${data.assignments.length}
      | Minutes: ${data.minutes || 0}
      <button class="delete-btn" onclick="banUser('${username}')">❌ Ban</button>
      <button class="action" onclick="editUser('${username}')">✏️ Edit</button>
    `;
    userList.appendChild(li);
  });
  userCount.textContent = entries.length;
}

function banUser(username) {
  if (confirm(`Ban user "${username}"?`)) {
    const users = getAllUsers();
    delete users[username];
    saveAllUsers(users);
    showNotification(`🚫 User "${username}" banned.`, "#e74c3c");
    setTimeout(() => location.reload(), 800);
  }
}

function editUser(username) {
  const users = getAllUsers();
  const newName = prompt("Enter new username:", username);
  if (!newName || newName === username) return;

  users[newName] = users[username];
  delete users[username];
  saveAllUsers(users);
  showNotification("✅ User updated");
  setTimeout(() => location.reload(), 800);
}