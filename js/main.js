document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
});

async function loadHeader() {
    try {
        const response = await fetch('../partials/header.html');
        if (!response.ok) throw new Error('Header not found');
        const headerHTML = await response.text();
        const placeholder = document.getElementById('header-placeholder');
        if (placeholder) {
            placeholder.innerHTML = headerHTML;
            initializeHeader();
        }
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

function initializeHeader() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    }

    const darkModeToggle = document.getElementById('darkModeToggle');
    const html = document.documentElement;
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const isDarkMode = html.classList.toggle('dark');
            localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
        });
    }

    if (localStorage.getItem('darkMode') === 'enabled') {
        html.classList.add('dark');
    }

    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

window.showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    const styles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white',
    };
    notification.className = `fixed top-5 right-5 p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${styles[type]}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
};

window.currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
});
