export const showModal = ({ title, message, confirmText, cancelText, onConfirm, onCancel, type = 'info' }) => {
    const existingModal = document.getElementById('custom-modal');
    if (existingModal) existingModal.remove();

    const modalHTML = `
        <div id="custom-modal" class="modal-overlay fade-in">
            <div class="modal-container">
                <div class="modal-header ${type}">
                    <h3>${title}</h3>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    ${cancelText ? `<button id="modal-cancel" class="btn-secondary">${cancelText}</button>` : ''}
                    <button id="modal-confirm" class="btn-primary">${confirmText || 'OK'}</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('custom-modal');
    const confirmBtn = document.getElementById('modal-confirm');
    const cancelBtn = document.getElementById('modal-cancel');

    confirmBtn.onclick = () => {
        modal.remove();
        if (onConfirm) onConfirm();
    };

    if (cancelBtn) {
        cancelBtn.onclick = () => {
            modal.remove();
            if (onCancel) onCancel();
        };
    }
};