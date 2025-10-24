<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIMAGANG Diskominfo - Selamat Datang</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>

    <nav class="navbar">
        <a href="/#/" id="brand-link" class="navbar-brand">
            <img src="../assets/img/pemkot.png" alt="Logo Pemkot Pekanbaru" class="navbar-logo">
            <img src="../assets/img/kominfo.png" alt="Logo Kominfo" class="navbar-logo">
            <span>SIMAGANG</span>
        </a>
        <ul class="navbar-links">
            <li><a href="#" id="nav-home">Home</a></li>
            <li><a href="#" id="nav-about">About</a></li>
            <li><a href="#" id="nav-faq">FAQ</a></li>
        </ul>
        <button id="hamburger-btn" class="hamburger-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        </button>
    </nav>

    <ul class="sidebar" id="sidebar-menu">
        <li class="sidebar-close-item">
            <button id="sidebar-close-btn" class="sidebar-close-button">&times;</button>
        </li>
        <li><a href="#" id="sidebar-home" class="sidebar-link">Home</a></li>
        <li><a href="#" id="sidebar-about" class="sidebar-link">About</a></li>
        <li><a href="#" id="sidebar-faq" class="sidebar-link">FAQ</a></li>
    </ul>

    <div class="sidebar-overlay" id="sidebar-overlay"></div>

    <main id="app"></main>

    <script type="module" src="{{ asset('src/app.js') }}"></script>

    <div id="notification-modal" class="notification-modal-overlay">
        <div id="notification-content" class="notification-modal-content"> 
            <div id="notification-icon" class="notification-icon">
                {/* Ikon akan diisi oleh JavaScript */}
            </div>
            <h3 id="notification-title">Judul Notifikasi</h3>
            <p id="notification-message">Isi pesan notifikasi.</p>
            <button id="notification-close" class="notification-close-btn">Mengerti</button>
        </div>
    </div>

    <div class="contact-widget">
        <div id="contact-popup" class="contact-popup">
            
            <!-- <div class="popup-logo">
                <img src="assets/img/admin.png" alt="Logo Admin">
            </div> -->

            <div class="popup-header">
                <h4>Hubungi Admin</h4>
                <button id="close-popup-btn" class="popup-close-btn">&times;</button>
            </div>
            <div class="popup-body">
                <p>Mengalami kendala? Hubungi admin via WhatsApp di nomor berikut:</p>
                <a href="https://wa.me/6282256256013" target="_blank" class="admin-contact-link">
                    0822-5625-6013
                </a>
            </div>
        </div>

        <button id="contact-fab" class="contact-fab" aria-label="Hubungi Admin">
            <img src="assets/img/admin.png" alt="Logo Admin">
        </button>
    </div>
    </body> 
    </body>
</html>