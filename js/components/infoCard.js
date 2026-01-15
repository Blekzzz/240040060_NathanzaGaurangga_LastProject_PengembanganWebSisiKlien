export const InfoCard = (data) => {
    return `
        <div class="info-card fade-in">
            <div class="info-card-image">
                <img src="${data.image}" alt="${data.title}" onerror="this.src='assets/placeholder.jpg'">
            </div>
            <div class="info-card-content">
                <span class="category-tag">${data.category || 'General'}</span>
                <h3>${data.title}</h3>
                <p class="price">${data.price}</p>
                <p class="description">${data.description}</p>
                <button class="btn-action">${data.buttonText || 'Order Now'}</button>
            </div>
        </div>
    `;
};