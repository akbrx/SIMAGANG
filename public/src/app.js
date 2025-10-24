import { PengajuanView } from './views/pengajuan-view.js';
import { HomeController } from './controllers/home-controller.js';
import { PengajuanController } from './controllers/pengajuan-controller.js';
import { LacakController } from './controllers/lacak-controller.js';
import { LupaIdController } from './controllers/lupa-id-controller.js';
import { NotFoundController } from './controllers/404-controller.js';

export class App {
    constructor() {
        this.homeController = new HomeController();
        this.pengajuanController = new PengajuanController();
        this.lacakController = new LacakController();
        this.lupaIdController = new LupaIdController();
        this.notFoundController = new NotFoundController();
        
        this.initialLoad = true;
        this.scrollTarget = null;
        
        this.setupMobileMenu();
        this.setupContactWidget();
        this.setupDesktopNavLinks();
        this.setupListeners();
    }

    setupListeners() {
        window.addEventListener('hashchange', () => this.handleRouteChange());

        window.addEventListener('load', () => {
            this.handleRouteChange();
            this.initialLoad = false; 
        });
    }

    handleRouteChange() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, queryString] = hash.split('?');
    const params = new URLSearchParams(queryString || '');

    switch (path) {
        case '/pengajuan':
            this.pengajuanController.showPengajuanPage();
            break;
        case '/lacak':
            this.lacakController.showLacakPage(params.get('id'));
            break;
        case '/lupa-id':
            this.lupaIdController.showLupaIdPage(Object.fromEntries(params));
            break;
        case '/':
            this.homeController.showHomePage();
        
            if (this.scrollTarget) {
                setTimeout(() => {
                    const element = document.querySelector(this.scrollTarget);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                    this.scrollTarget = null; 
                }, 100);
            }
            break;
        default:
            this.notFoundController.showNotFoundPage();
            break;
    }
}

    setupDesktopNavLinks() {
        const navLinks = {
            'nav-home': '#home-section',
            'nav-about': '#about-section',
            'brand-link': '#home-section',
            'nav-faq': '#faq-section'
        };

        for (const [id, targetId] of Object.entries(navLinks)) {
            const link = document.getElementById(id);
            if (link) {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.navigateToHomeAndScroll(targetId);
                });
            }
        }
    }

    setupMobileMenu() {
        const hamburgerBtn = document.getElementById('hamburger-btn');
        const sidebarMenu = document.getElementById('sidebar-menu');
        const sidebarOverlay = document.getElementById('sidebar-overlay');
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        const closeBtn = document.getElementById('sidebar-close-btn');

        const closeMenu = () => {
            sidebarMenu.classList.remove('is-active');
            sidebarOverlay.classList.remove('is-active');
        };

        const sidebarNavLinks = {
            'sidebar-home': '#home-section',
            'sidebar-about': '#about-section',
            'sidebar-faq': '#faq-section'
        };

        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', () => {
                sidebarMenu.classList.add('is-active');
                sidebarOverlay.classList.add('is-active');
            });

            if (sidebarOverlay) {
                sidebarOverlay.addEventListener('click', closeMenu);
            }

            for (const [id, targetId] of Object.entries(sidebarNavLinks)) {
                const link = document.getElementById(id);
                if (link) {
                    link.addEventListener('click', (event) => {
                        event.preventDefault();
                        this.navigateToHomeAndScroll(targetId);
                        closeMenu();
                    });
                }
            }
            if (closeBtn) {
            closeBtn.addEventListener('click', closeMenu);
        }
        }
    }

    // --- FUNGSI NAVIGASI ---
    navigateToHome() {
        this.homeController.showHomePage();
    }

    // Fungsi untuk klik navbar: tampilkan home, lalu scroll
    navigateToHomeAndScroll(targetId) {
        const currentPath = window.location.hash.slice(1).split('?')[0] || '/';

        // Jika kita sudah di halaman utama
        if (currentPath === '/') {
            const element = document.querySelector(targetId);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Jika kita di halaman lain
            this.scrollTarget = targetId;
            window.location.hash = '/';
        }
    }   

    navigateToPengajuan() {
        this.pengajuanController.showPengajuanPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navigateToLacak(trackingId = null) {
        this.lacakController.showLacakPage(trackingId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navigateToLupaId() {
        this.lupaIdController.showLupaIdPage();
        window.scrollTo({ top: 0, behavior: 'auto' });
    }

    setupContactWidget() {
        const fab = document.getElementById('contact-fab');
        const popup = document.getElementById('contact-popup');
        const closeBtn = document.getElementById('close-popup-btn');

        if (fab && popup && closeBtn) {
            fab.addEventListener('click', () => {
                popup.classList.toggle('is-active');
            });

            closeBtn.addEventListener('click', () => {
                popup.classList.remove('is-active');
            });
        }
    }
}

export function showNotification(title, message, type = 'warning') { 
    const modal = document.getElementById('notification-modal');
    const modalContent = document.getElementById('notification-content');
    const iconElement = document.getElementById('notification-icon');
    const titleElement = document.getElementById('notification-title');
    const messageElement = document.getElementById('notification-message');
    const closeBtn = document.getElementById('notification-close');

    if (!modal || !modalContent) return;

    const notificationTypes = {
        success: {
            className: 'notif-success',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
        },
        warning: {
            className: 'notif-warning',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
        }
    };

    const selectedType = notificationTypes[type] || notificationTypes.warning;

    modalContent.classList.remove('notif-success', 'notif-warning');
    modalContent.classList.add(selectedType.className);
    
    iconElement.innerHTML = selectedType.icon;
    titleElement.textContent = title;
    messageElement.textContent = message;

    modal.style.display = 'flex';

        const closeModal = () => {
            modal.style.display = 'none';
            closeBtn.removeEventListener('click', closeModal);
            modal.removeEventListener('click', closeOnOverlay);
        };

        const closeOnOverlay = (event) => {
            if (event.target === modal) {
                closeModal();
            }
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', closeOnOverlay);
    }


export function makeDraggable(element) {
    let currentX, currentY, initialX, initialY;
    let xOffset = 0, yOffset = 0;
    let isDragging = false;
    const header = element.querySelector('.note-header');

    const dragStart = (e) => {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        isDragging = true;
    };

    const drag = (e) => {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    };

    const dragEnd = () => {
        if (isDragging) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
    };

    if (header) {
        header.addEventListener("mousedown", dragStart);
    }
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);
}


document.addEventListener('DOMContentLoaded', () => {
    new App(); 
});

window.showNotification = showNotification;

