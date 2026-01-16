// js/router/router.js
import { InfoCard } from '../components/infoCard.js';

export const routes = [
    { path: "/", view: "home" },
    { path: "/menu", view: "menu" },
    { path: "/reservation", view: "reservation" },
    { path: "/promo", view: "promo" },
    { path: "/contact", view: "contact" },
    { path: "/login", view: "login" }
];

export const router = async () => {
    let path = window.location.pathname;
    let match = routes.find(r => r.path === path) || routes[0];
    const contentArea = document.querySelector("#app-content");
    
    try {
        const response = await fetch(`./Pages/${match.view}.html`);
        if (!response.ok) throw new Error("Page not found");
        
        const html = await response.text();
        contentArea.innerHTML = html;

        updateActiveLinks(match.path);

        // Jika halaman menu atau promo, ambil data dari JSON
        if (match.view === "menu") {
            renderData("culinary", "menu-grid");
        } else if (match.view === "promo") {
            renderData("offers", "promo-grid");
        } else if (match.view === "login") {
            window.dispatchEvent(new CustomEvent("loginPageLoaded"));
        }

    } catch (err) {
        contentArea.innerHTML = "<h1>404 - Page Not Found</h1>";
    }
};

const updateActiveLinks = (path) => {
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === path) {
            link.classList.add("active");
        }
    });
};

// --- FUNGSI REUSABLE UNTUK RENDERING DATA DARI JSON ---
const renderData = async (key, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const response = await fetch('./data/data.json');
        const data = await response.json();
        
        // Ambil array berdasarkan key (culinary atau offers)
        const items = data[key];
        
        container.innerHTML = items.map(item => InfoCard(item)).join('');
    } catch (error) {
        console.error("Gagal mengambil data JSON:", error);
        container.innerHTML = "<p>Gagal memuat data.</p>";
    }
};