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

// Dark Mode Setup
function setupDarkMode() {
  const toggleBtn = document.getElementById("darkModeToggle");
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark");
  }
  toggleBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const enabled = document.body.classList.contains("dark");
    localStorage.setItem("darkMode", enabled ? "enabled" : "disabled");
  });
}

// Toggle Login/Register View
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

// Main Init
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

    users[username] = { password, assignments: [] };
    saveAllUsers(users);
    showNotification('✅ Registered! Now login.', '#2ecc71');
    document.getElementById('registerUser').value = '';
    document.getElementById('registerPass').value = '';
    toggleAuth('login');
  });
});
// 📂 Section Navigation
function showSection(id) {
  document.querySelectorAll('.content').forEach(section => {
    section.classList.add('hidden');
  });
  const target = document.getElementById(id);
  if (target) target.classList.remove('hidden');
}

// 🚀 INIT
document.addEventListener('DOMContentLoaded', () => {
  setupDarkMode();

  // Show only welcome section on load
  showSection('welcome');

  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');

  // Login logic...
  // (keep your login/register logic the same)
});
// Tab Navigation
function showSection(id) {
  const contents = document.querySelectorAll('.content');
  const buttons = document.querySelectorAll('.nav button');

  contents.forEach(c => c.classList.remove('active'));
  buttons.forEach(b => b.classList.remove('active'));

  document.getElementById(id).classList.add('active');
  document.querySelector(`.nav button[data-section="${id}"]`).classList.add('active');
}

// Setup all tab buttons
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-section');
      showSection(target);
    });
  });

  // Show default tab
  showSection('welcome');

  // Setup login/register toggle if present
  document.querySelectorAll('.toggle-text a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      toggleAuth(link.textContent.includes('Register') ? 'register' : 'login');
    });
  });
});
