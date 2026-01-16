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
        // Mengambil file HTML dari folder Pages
        const response = await fetch(`./Pages/${match.view}.html`);
        if (!response.ok) throw new Error("Page not found");
        
        const html = await response.text();
        contentArea.innerHTML = html;
        document.querySelector("#app-content").innerHTML = html;

        updateActiveLinks(match.path);

        if (match.view === "login") {
            window.dispatchEvent(new CustomEvent("loginPageLoaded"));
        }

        if (match.view === "menu") {
            renderCulinary();
        } else if (match.view === "promo") {
            renderOffers();
        } else if (match.view === "login") {
            console.log("Login page loaded");
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