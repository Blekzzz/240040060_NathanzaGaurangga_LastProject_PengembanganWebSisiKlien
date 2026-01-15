import { InfoCard } from './components/infoCard.js';

const routes = [
    { path: "/", view: "home" },
    { path: "/menu", view: "menu" },
    { path: "/promo", view: "promo" },
    { path: "/reservation", view: "reservation" },
    { path: "/contact", view: "contact" },
    { path: "/login", view: "login" }
];

const router = async () => {
    let path = window.location.pathname;
    let match = routes.find(r => r.path === path) || routes[0];

    const contentArea = document.querySelector("#app-content");
    
    try {
        const response = await fetch(`./Pages/${match.view}.html`);
        const html = await response.text();
        contentArea.innerHTML = html;

        // LOGIKA PEMANGGILAN KOMPONEN BERDASARKAN HALAMAN
        if (match.view === "menu") {
            renderCulinary();
        } else if (match.view === "promo") {
            renderOffers();
        }

        if (match.view === "login") {
            initLoginLogic();
        }

    } catch (err) {
        contentArea.innerHTML = "<h1>Page Not Found</h1>";
    }
};

const initLoginLogic = () => {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Login functionality will be connected to the backend soon!");
            navigateTo("/");
        });
    }
};

// --- DATA & RENDERING ---

const renderCulinary = () => {
    const container = document.getElementById("menu-grid");
    if (!container) return;

    const culinaryData = [
        { image: "assets/nasiGoreng.png", title: "Nasi Goreng Luwih", price: "Rp 35k", description: "Authentic Balinese spice.", category: "Food" },
        { image: "assets/caramelLatte.png", title: "Ice Caramel Latte", price: "Rp 28k", description: "Freshly brewed arabica.", category: "Drink" },
        { image: "assets/chikenCordonBleu.png", title: "Chiken Cordon Bleu", price: "Rp 45k", description: "Golden-brown breaded chicken breast stuffed with premium smoked beef and melted mozzarella cheese. Served with crispy fries, fresh garden salad, and our signature creamy sauce.", category: "Food" },
        { image: "assets/esMiloDino.png", title: "Milo Dinosaur", price: "Rp 40k", description: "A rich, chilled chocolate malt drink served over ice, topped with a generous mountain of extra Milo powder for the ultimate chocolate crunch.", category: "Drink" }
    ];

    container.innerHTML = culinaryData.map(item => InfoCard(item)).join('');
};

const renderOffers = () => {
    const container = document.getElementById("promo-grid");
    if (!container) return;

    const promoData = [
        { image: "assets/coworkingPromo.png", title: "Coworking Bundle", price: "Disc 20%", description: "Coffee + Meal for your work session.", category: "Limited", buttonText: "Claim Promo" },
        { image: "assets/weekendPromo.png", title: "Weekend Brunch", price: "Free Dessert", description: "Every Saturday and Sunday.", category: "Event", buttonText: "See Detail" }
    ];

    container.innerHTML = promoData.map(item => InfoCard(item)).join('');
};

// Inisialisasi navigasi & router
window.onpopstate = router;
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            history.pushState(null, null, e.target.href);
            router();
        }
    });
    router();
});