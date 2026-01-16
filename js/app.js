import { router } from './router/router.js';
import { showModal } from './components/modal.js';

// --- FUNGSI NAVIGASI ---
const navigateTo = (url) => {
    history.pushState(null, null, url);
    showSkeleton(); 
    setTimeout(() => {
        router();
    }, 500);
};

// Tambahkan juga pada event popstate (tombol back browser)
window.onpopstate = () => {
    showSkeleton();
    router();
};

// --- LOGIKA AUTHENTICATION (Persistent & Profile UI) ---
const checkLoginStatus = () => {
    const token = localStorage.getItem("access-token");
    const userName = localStorage.getItem("user-username"); // Ambil username yang tersimpan
    const loginStatus = document.getElementById("login-status");
    const navLoginLink = document.querySelector('a[href="/login"]');

    if (token && userName) {
        // 1. Update Navbar: Ganti tulisan "Login" jadi Nama User
        if (navLoginLink) {
            navLoginLink.innerHTML = `<i class="fas fa-user-circle"></i> ${userName}`;
            navLoginLink.style.color = "var(--secondary)";
        }

        // 2. Update UI di Halaman Login (Tampilan Profil)
        if (loginStatus) {
            loginStatus.innerHTML = `
                <div class="login-box card" style="text-align: center;">
                    <i class="fas fa-user-circle fa-5x" style="color: var(--secondary); margin-bottom: 15px;"></i>
                    <h2>Halo, ${userName}!</h2>
                    <p style="margin: 15px 0; color: var(--text); opacity: 0.8;">Anda saat ini masuk dengan akun yang aman.</p>
                    <button id="logout-btn" class="btn-primary-login" style="background: #e74c3c; border: none;">Logout</button>
                </div>
            `;
            document.getElementById("logout-btn").addEventListener("click", logout);
        }
    } else {
        // Jika tidak login, kembalikan tampilan navbar
        if (navLoginLink) {
            navLoginLink.innerHTML = "Login";
            navLoginLink.style.color = "";
        }

        // Tampilan Form Login jika di halaman login
        if (loginStatus) {
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
            // Simpan Token dan Nama User ke LocalStorage
            localStorage.setItem("access-token", data.accessToken);
            localStorage.setItem("user-username", data.username);
            
            showModal({
                title: "Login Berhasil",
                message: `Selamat datang kembali, ${data.firstName}!`,
                type: "success",
                onConfirm: () => {
                    checkLoginStatus(); 
                    navigateTo("/");    
                }
            });
        } else {
            showModal({
                title: "Login Gagal",
                message: "Username atau password salah. Silakan coba lagi.",
                type: "error"
            });
            msg.textContent = "";
        }
    })
    .catch(err => {
        showModal({
            title: "Server Error",
            message: "Gagal terhubung ke server.",
            type: "error"
        });
    });
};

const logout = () => {
    showModal({
        title: "Konfirmasi Logout",
        message: "Apakah Anda yakin ingin keluar dari sistem?",
        confirmText: "Ya, Keluar",
        cancelText: "Batal",
        onConfirm: () => {
            localStorage.removeItem("access-token");
            localStorage.removeItem("user-username");
            checkLoginStatus();
            navigateTo("/");
        }
    });
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

// Logika khusus untuk Halaman Reservation
const handleReservationSubmit = () => {
    const resForm = document.getElementById("reservation-form");
    if (resForm) {
        // Tambahkan validasi tanggal minimal hari ini
        const dateInput = document.getElementById("date");
        if (dateInput) {
            dateInput.min = new Date().toISOString().split("T")[0];
        }

        resForm.onsubmit = (e) => {
            e.preventDefault();
            showModal({
                title: "Cek Reservasi",
                message: "Apakah data reservasi Anda sudah sesuai?",
                confirmText: "Konfirmasi",
                cancelText: "Cek Kembali",
                onConfirm: () => {
                    showModal({
                        title: "Berhasil!",
                        message: "Reservasi Anda telah diterima. Kami tunggu kedatangannya!",
                        type: "success"
                    });
                    resForm.reset();
                }
            });
        };
    }
};

// --- LOGIKA DARK MODE ---
const initDarkMode = () => {
    const darkToggle = document.getElementById("dark-toggle");
    const body = document.body;
    const isDark = localStorage.getItem("dark-mode") === "true";
    
    if (isDark) {
        body.classList.add("dark-mode");
        if (darkToggle) darkToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    if (darkToggle) {
        darkToggle.addEventListener("click", () => {
            const currentMode = body.classList.toggle("dark-mode");
            localStorage.setItem("dark-mode", currentMode);
            darkToggle.innerHTML = currentMode 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        });
    }
};

const showSkeleton = () => {
    const appContent = document.getElementById("app-content");
    appContent.innerHTML = `
        <div class="fade-in">
            <div class="skeleton skeleton-rect" style="height: 300px; border-radius: 30px; margin-bottom: 50px;"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="grid-layout">
                ${`<div class="skeleton-card">
                    <div class="skeleton skeleton-rect" style="height: 150px;"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text" style="width: 60%;"></div>
                </div>`.repeat(3)}
            </div>
        </div>
    `;
};

// Listener saat Router memuat halaman
window.addEventListener("loginPageLoaded", checkLoginStatus);
window.addEventListener("reservationPageLoaded", handleReservationSubmit);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        const target = e.target.closest("[data-link]");
        if (target) {
            e.preventDefault();
            navigateTo(target.getAttribute("href"));
        }
    });
    
    initDarkMode();
    initNavToggle();
    checkLoginStatus(); // Penting: Jalankan saat pertama kali muat untuk persistensi
    router();
    
    // Observer untuk mendeteksi perubahan konten di SPA
    const observer = new MutationObserver(() => {
        handleReservationSubmit();
        checkLoginStatus();
    });
    observer.observe(document.getElementById("app-content"), { childList: true });
});