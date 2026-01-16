import { router } from './router/router.js';

// --- FUNGSI NAVIGASI ---
const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

// --- LOGIKA AUTHENTICATION ---
const checkLoginStatus = () => {
    const token = localStorage.getItem("access-token");
    const loginStatus = document.getElementById("login-status");

    if (!loginStatus) return; // Guard clause jika elemen tidak ada di halaman

    loginStatus.innerHTML = "";

    if (token) {
        // Tampilan jika SUDAH LOGIN
        loginStatus.innerHTML = `
            <div class="login-box card">
                <h2>Welcome Back!</h2>
                <p style="margin: 15px 0;">You are currently logged in with a secure token.</p>
                <button id="logout-btn" class="btn-primary-login" style="background: #e74c3c;">Logout</button>
            </div>
        `;
        document.getElementById("logout-btn").addEventListener("click", logout);
    } else {
        // Tampilan jika BELUM LOGIN
        loginStatus.innerHTML = `
            <div class="login-box">
                <h2>Login to Luwih</h2>
                <p style="margin: 15px 0;">Please login to use full feature.</p>
                <form id="login-form">
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" id="username" placeholder="Username" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="password" placeholder="Password" required>
                    </div>
                    <button type="submit" class="btn-primary-login">Sign In</button>
                    <div id="login-message" style="margin-top: 15px;"></div>
                </form>
            </div>
        `;
        document.getElementById("login-form").addEventListener("submit", login);
    }
};

const login = (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const msg = document.getElementById("login-message");

    msg.style.color = "orange";
    msg.textContent = "Authenticating...";

    fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            password: password,
            expiresInMins: 30
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.accessToken) {
            localStorage.setItem("access-token", data.accessToken);
            msg.style.color = "green";
            msg.textContent = "Login Successful! Redirecting...";
            
            setTimeout(() => {
                checkLoginStatus(); // Update UI
                navigateTo("/");    // Arahkan ke Home
            }, 1000);
        } else {
            msg.style.color = "red";
            msg.textContent = "Wrong username or password";
        }
    })
    .catch(err => {
        msg.style.color = "red";
        msg.textContent = "Server error. Try again later.";
    });
};

const logout = () => {
    localStorage.removeItem("access-token");
    checkLoginStatus();
};

// --- INITIALIZATION ---
const initNavToggle = () => {
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");
    if (toggle && menu) {
        toggle.onclick = (e) => {
            e.stopPropagation();
            menu.classList.toggle("active");
        };
        document.onclick = () => menu.classList.remove("active");
    }
};

// Listener khusus agar saat Router memuat halaman login, fungsi checkLoginStatus dipanggil
window.addEventListener("loginPageLoaded", checkLoginStatus);
window.onpopstate = router;

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        const target = e.target.closest("[data-link]");
        if (target) {
            e.preventDefault();
            navigateTo(target.getAttribute("href"));
        }
    });

    initNavToggle();
    router();
});