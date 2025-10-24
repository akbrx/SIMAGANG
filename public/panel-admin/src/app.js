// src/app.js

// Import views dan controllers
import * as loginView from './views/login-view.js';
import * as loginController from './controllers/login-controller.js';
import * as dashboardView from './views/dashboard-view.js';
import * as dashboardController from './controllers/dashboard-controller.js';
import * as suratView from './views/surat-view.js';
import * as suratController from './controllers/surat-controller.js';

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
    '#surat': { view: suratView, controller: suratController }
};

// [FUNGSI BARU] Untuk menangani status aktif pada menu sidebar
function handleActiveMenu(path) {
    const menuLinks = document.querySelectorAll('.sidebar-menu a');
    menuLinks.forEach(link => {
        // Hapus dulu class 'active' dari semua link
        link.classList.remove('active');
        
        // Tambahkan class 'active' hanya jika hash-nya cocok dengan path saat ini
        if (link.hash === path) {
            link.classList.add('active');
        }
    });
}

// [FUNGSI BARU] Untuk membaca nama dari localStorage dan menampilkannya
function updateAdminProfile() {
    const profileNameSpan = document.querySelector('.profile-name');
    const adminName = localStorage.getItem('adminName');

    if (profileNameSpan && adminName) {
        profileNameSpan.textContent = adminName;
    } else if (profileNameSpan) {
        profileNameSpan.textContent = 'Admin'; // Teks default jika nama tidak ada
    }
}
function router() {
    const path = window.location.hash || '#dashboard'; // Ubah default ke #dashboard
    const appContainer = document.getElementById('app');
    const appWrapper = document.getElementById('app-wrapper');
    const sidebar = document.getElementById('sidebar');

    const route = routes[path];

    // [DIPERBARUI] Panggil fungsi untuk handle menu aktif setiap kali rute berubah
    handleActiveMenu(path);

        if (route) {
        if (path === '#login') {
                appWrapper.classList.add('login-layout');
        } else {
                appWrapper.classList.remove('login-layout');
                updateAdminProfile(); 
        }

        appContainer.innerHTML = route.view.render();
        if (route.controller && typeof route.controller.init === 'function') {
            route.controller.init();
        }
    } else {
        // Jika hash tidak dikenali, arahkan ke dashboard
            window.location.hash = '#dashboard';
    }
}       

// --- FUNGSI INISIALISASI ---
function initAppLayout() {
    // Logika untuk tombol logout (tetap sama)
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('adminName');
            window.location.hash = '#login';
        });
    }

    // [PERUBAHAN] Logika toggle sidebar disempurnakan
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const appWrapper = document.getElementById('app-wrapper');

    if (sidebarToggleBtn && appWrapper) {
        // [BARU] Atur kondisi awal sidebar berdasarkan ukuran layar saat halaman dimuat
        if (window.innerWidth > 992) {
            appWrapper.classList.add('sidebar-is-open');
        }

        // Event listener untuk tombol toggle (tetap sama)
        sidebarToggleBtn.addEventListener('click', () => {
            appWrapper.classList.toggle('sidebar-is-open');
        });
    }
}

// [PINDAHKAN KE SINI] Fungsi untuk menampilkan notifikasi toast
window.showToast = function(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toast-container');
    if (!container) {
        console.error('Toast container not found!');
        return;
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('exit');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, duration);
}




// --- EVENT LISTENERS ---
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
    initAppLayout();
    router();
});

