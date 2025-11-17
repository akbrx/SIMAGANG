// src/app.js

// Import views dan controllers
import * as loginView from './views/login-view.js';
import * as loginController from './controllers/login-controller.js';
import * as dashboardView from './views/dashboard-view.js';
import * as dashboardController from './controllers/dashboard-controller.js';
import * as suratView from './views/surat-view.js';
import * as suratController from './controllers/surat-controller.js';
import * as settingsView from './views/settings-view.js';
import * as settingsController from './controllers/settings-controller.js';
import * as resetPasswordView from './views/reset-password-view.js';
import * as resetPasswordController from './controllers/reset-password-controller.js';
import * as forgotPasswordView from './views/forgot-password-view.js';
import * as forgotPasswordController from './controllers/forgot-password-controller.js';
import * as replyView from './views/reply-view.js';
import * as replyController from './controllers/reply-controller.js';
import * as pembimbingView from './views/pembimbing-view.js';
import * as pembimbingController from './controllers/pembimbing-controller.js';
import * as kadisView from './views/kadis-view.js';
import * as kadisController from './controllers/kadis-controller.js';
import * as kabidView from './views/kabid-view.js';
import * as kabidController from './controllers/kabid-controller.js';


export function showConfirmation(title, message, confirmText = 'Ya') {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirmation-modal');
        const titleEl = document.getElementById('confirmation-title');
        const messageEl = document.getElementById('confirmation-message');
        const yesBtn = document.getElementById('confirm-yes-btn');
        const noBtn = document.getElementById('confirm-no-btn');

        if (!modal || !titleEl || !messageEl || !yesBtn || !noBtn) {
            console.error('Elemen modal konfirmasi tidak ditemukan.');
            resolve(false);
            return;
        }

        titleEl.textContent = title;
        messageEl.textContent = message;
        yesBtn.textContent = confirmText;

        modal.classList.add('show');

        const cleanupAndClose = (result) => {
            modal.classList.remove('show');
            yesBtn.removeEventListener('click', handleYes);
            noBtn.removeEventListener('click', handleNo);
            resolve(result);
        };

        const handleYes = () => cleanupAndClose(true);
        const handleNo = () => cleanupAndClose(false);

        yesBtn.addEventListener('click', handleYes);
        noBtn.addEventListener('click', handleNo);
    });
}

// --- ROUTER SEDERHANA ---
const routes = {
    '#login': { view: loginView, controller: loginController },
    '#dashboard': { view: dashboardView, controller: dashboardController },
    '#surat': { view: suratView, controller: suratController },
    '#pengaturan': { view: settingsView, controller: settingsController },
    '#reset-password': { view: resetPasswordView, controller: resetPasswordController },
    '#forgot-password': { view: forgotPasswordView, controller: forgotPasswordController },
    '#surat-balas': { view: replyView, controller: replyController },
    '#pembimbing': { view: pembimbingView, controller: pembimbingController },
    '#kadis': { view: kadisView, controller: kadisController },
    '#kabid': { view: kabidView, controller: kabidController }
};

// Fungsi untuk menangani status aktif pada menu sidebar
function handleActiveMenu(path) {
    const menuLinks = document.querySelectorAll('.sidebar-menu a');
    menuLinks.forEach(link => {
        link.classList.remove('active');
        if (link.hash === path) {
            link.classList.add('active');
        }
    });
}

// Fungsi untuk membaca nama dari localStorage dan menampilkannya
function updateAdminProfile() {
    const profileNameSpan = document.querySelector('.profile-name');
    const adminName = localStorage.getItem('adminName'); // Asumsikan nama disimpan saat login

    if (profileNameSpan && adminName) {
        profileNameSpan.textContent = adminName;
    } else if (profileNameSpan) {
        profileNameSpan.textContent = 'Admin'; // Teks default jika nama tidak ada
    }
}

// Fungsi untuk menyesuaikan sidebar berdasarkan role
function updateSidebarForRole(role) {
    const dashboardLink = document.querySelector('.sidebar-menu a[href="#dashboard"]');
    const suratLink = document.querySelector('.sidebar-menu a[href="#surat"]');
    const pengaturanLink = document.querySelector('.sidebar-menu a[href="#pengaturan"]');
    const pembimbingLink = document.querySelector('.sidebar-menu a[href="#pembimbing"]');
    const kadisLink = document.querySelector('.sidebar-menu a[href="#kadis"]');

    if (dashboardLink) dashboardLink.style.display = 'none';
    if (suratLink) suratLink.style.display = 'none';
    if (pengaturanLink) pengaturanLink.style.display = 'none';
    if (pembimbingLink) pembimbingLink.style.display = 'none';
    if (kadisLink) kadisLink.style.display = 'none';

    if (role === 'pembimbing') {
        if (pembimbingLink) pembimbingLink.style.display = 'flex';
    } else if (role === 'kadis') { // [BARU]
        if (kadisLink) kadisLink.style.display = 'flex';
    } else { // Asumsikan 'admin'
        if (dashboardLink) dashboardLink.style.display = 'flex';
        if (suratLink) suratLink.style.display = 'flex';
        if (pengaturanLink) pengaturanLink.style.display = 'flex';
    }
}

async function router() { 

    const currentHash = window.location.hash;
    const token = localStorage.getItem('authToken');
    const adminRole = localStorage.getItem('adminRole');

    const isLoginPage = window.location.hash === '#login' || window.location.hash === '';
    const isResetPage = window.location.hash.startsWith('#reset-password');
    const isForgotPage = currentHash === '#forgot-password';
    const isPublicPage = isLoginPage || isResetPage || isForgotPage;
    const isKadisPage = currentHash === '#kadis';
    const isPembimbingPage = currentHash === '#pembimbing';
    const isKabidPage = currentHash === '#kabid';

    const isStandalonePage = isPublicPage || isKadisPage || isPembimbingPage || isKabidPage;

    if (!token && !isPublicPage && !isKadisPage) {
        window.location.hash = '#login';
        return; 
    }

    if (token && isPublicPage) {
        if(!isResetPage && !isForgotPage) {
            window.location.hash = adminRole === 'pembimbing' ? '#pembimbing' : '#dashboard';
        }
    }

    let path = currentHash.split('?')[0] || (token ? (adminRole === 'pembimbing' ? '#pembimbing' : (adminRole === 'kadis' ? '#kadis' : '#dashboard')) : '#login');
    if (path === '') path = token ? (adminRole === 'pembimbing' ? '#pembimbing' : (adminRole === 'kadis' ? '#kadis' : '#dashboard')) : '#login';

    const adminOnlyRoutes = ['#dashboard', '#surat', '#pengaturan', '#surat-balas'];
    const pembimbingOnlyRoutes = ['#pembimbing'];

    if (adminRole === 'pembimbing' && adminOnlyRoutes.includes(path)) {
        window.location.hash = '#pembimbing';
        return; // Hentikan dan jalankan ulang router
    }
    if (adminRole === 'admin' && pembimbingOnlyRoutes.includes(path)) {
        window.location.hash = '#dashboard';
        return; // Hentikan dan jalankan ulang router
    }

    const appContainer = document.getElementById('app');
    const appWrapper = document.getElementById('app-wrapper');

    // Update menu aktif
    if (!isPublicPage) {
        handleActiveMenu(path);
    } else {
         document.querySelectorAll('.sidebar-menu a').forEach(link => link.classList.remove('active'));
    }

    const route = routes[path];

    if (route) {
        if (isStandalonePage) {
            appWrapper.classList.add('login-layout');
            appWrapper.classList.remove('sidebar-is-open');
        } else {
            appWrapper.classList.remove('login-layout');
            updateAdminProfile();
            updateSidebarForRole(adminRole);
        }

        appContainer.innerHTML = route.view.render();
        if (route.controller && typeof route.controller.init === 'function') {
           await route.controller.init();
        }
        
        // Auto-close sidebar di mobile (tetap sama)
        const isMobile = window.innerWidth <= 992; 
        if (isMobile && appWrapper.classList.contains('sidebar-is-open')) {
            appWrapper.classList.remove('sidebar-is-open');
        }
    } else {
        const homeRoute = token ? (adminRole === 'pembimbing' ? '#pembimbing' : (adminRole === 'kadis' ? '#kadis' : '#dashboard')) : '#login';
        window.location.hash = homeRoute;
    }
}       

// --- FUNGSI INISIALISASI ---
function initAppLayout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('adminName');
            localStorage.removeItem('adminRole');
            window.location.hash = '#login';
        });
    }

    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const appWrapper = document.getElementById('app-wrapper');
    const mainContent = document.getElementById('main-content');

    if (sidebarToggleBtn && appWrapper) {
        if (window.innerWidth > 992) {
            appWrapper.classList.add('sidebar-is-open');
        }
        sidebarToggleBtn.addEventListener('click', () => {
            appWrapper.classList.toggle('sidebar-is-open');
        });
        if (mainContent) {
            mainContent.addEventListener('click', (event) => {
                const isMobile = window.innerWidth <= 992;
                // Cek jika sidebar terbuka, layar mobile, dan klik BUKAN pada tombol toggle
                if (isMobile && appWrapper.classList.contains('sidebar-is-open') && !sidebarToggleBtn.contains(event.target)) {
                    appWrapper.classList.remove('sidebar-is-open');
                }
            });
        }
    }
}

// Fungsi untuk menampilkan notifikasi toast (tetap sama)
window.showToast = function(message, type = 'success', duration = 3000) { 

};

// --- EVENT LISTENERS ---
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
    initAppLayout();
    router(); 
});
