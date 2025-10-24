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
    '#reset-password': { view: resetPasswordView, controller: resetPasswordController }
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

async function router() { // Jadikan router async
    // Cek token, jika tidak ada dan bukan di halaman login, paksa ke login
    const token = localStorage.getItem('authToken');
    const isLoginPage = window.location.hash === '#login' || window.location.hash === '';
    
    if (!token && !isLoginPage) {
        window.location.hash = '#login';
        return; // Hentikan eksekusi router lebih lanjut
    }
    
    // Jika ada token dan user mencoba akses login, arahkan ke dashboard
    if (token && isLoginPage) {
         window.location.hash = '#dashboard';
         return;
    }

    const path = window.location.hash || (token ? '#dashboard' : '#login'); // Default ke dashboard jika login, jika tidak ke login
    const appContainer = document.getElementById('app');
    const appWrapper = document.getElementById('app-wrapper');

    handleActiveMenu(path);

    const route = routes[path];

    if (route) {
        if (path === '#login') {
            appWrapper.classList.add('login-layout');
        } else {
            appWrapper.classList.remove('login-layout');
            updateAdminProfile(); 
        }

        appContainer.innerHTML = route.view.render();
        // Menggunakan await karena init controller bisa jadi async
        if (route.controller && typeof route.controller.init === 'function') {
           await route.controller.init(); // Tunggu init selesai
        }
    } else {
        // Jika hash tidak dikenali, arahkan ke dashboard (jika sudah login)
        window.location.hash = token ? '#dashboard' : '#login';
    }
}       

// --- FUNGSI INISIALISASI ---
function initAppLayout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('adminName');
            window.location.hash = '#login';
        });
    }

    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const appWrapper = document.getElementById('app-wrapper');

    if (sidebarToggleBtn && appWrapper) {
        if (window.innerWidth > 992) {
            appWrapper.classList.add('sidebar-is-open');
        }
        sidebarToggleBtn.addEventListener('click', () => {
            appWrapper.classList.toggle('sidebar-is-open');
        });
    }
}

// Fungsi untuk menampilkan notifikasi toast (tetap sama)
window.showToast = function(message, type = 'success', duration = 3000) { /* ... kode toast ... */ };

// --- EVENT LISTENERS ---
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
    initAppLayout();
    router(); // Panggil router setelah layout diinisialisasi
});
