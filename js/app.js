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

    if (!match) {
        match = routes[0];
    }

    const contentDiv = document.getElementById("app-content");
    
    try {
        const response = await fetch(`/pages/${match.view}.html`);
        const html = await response.text();
        contentDiv.innerHTML = html;
    } catch (e) {
        contentDiv.innerHTML = "<h1>Error loading page</h1>";
    }
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});