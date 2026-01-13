const navigateTo = (url) => {
    history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/", view: "home" },
        { path: "/menu", view: "menu" },
        { path: "/reservation", view: "reservation" },
        { path: "/promo", view: "promo" },
        { path: "/contact", view: "contact" }
    ];

    let match = routes.find(route => location.pathname === route.path);
    if (!match) match = routes[0];

    const contentDiv = document.getElementById("app-content");
    
    try {
        const response = await fetch(`Pages/${match.view}.html`); 
        
        if (!response.ok) throw new Error();
        const html = await response.text();
        contentDiv.innerHTML = html;

        if (match.view === "reservation") {
            initReservationLogic();
        }
    } catch (e) {
        console.error("Fetch error:", e); 
        contentDiv.innerHTML = "<div class='fade-in'><h1>Page Not Found</h1><a href='/' data-link>Back to Home</a></div>";
    }

    window.scrollTo(0, 0);
};

const initReservationLogic = () => {
    const typeSelect = document.getElementById("booking-type");
    if (typeSelect) {
        typeSelect.addEventListener("change", (e) => {
            const meetingFields = document.getElementById("meeting-fields");
            const label = document.getElementById("guest-label");
            if (e.target.value === "meeting") {
                meetingFields.style.display = "block";
                label.innerText = "Number of Participants";
            } else {
                meetingFields.style.display = "none";
                label.innerText = "Number of Guests";
            }
        });
    }
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        const link = e.target.closest("[data-link]");
        if (link) {
            e.preventDefault();
            navigateTo(link.href);
        }
    });
    router();
});