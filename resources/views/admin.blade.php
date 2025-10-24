<!-- index.html -->

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin SIMAGANG</title>
    <!-- [BARU] Menambahkan Font Awesome untuk ikon -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="{{ asset('panel-admin/assets/css/style.css') }}">
</head>
<body>
    <div id="app-wrapper">
        <!-- [PERUBAHAN] Struktur Sidebar diperbarui -->
        <div class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="sidebar-logo-container">
                    <img src="../assets/img/kominfo.png" alt="Logo Kominfo">
                    <img src="../assets/img/pemkot.png" alt="Logo Pemkot">
                </div>
                <h3>SIMAGANG</h3>
            </div>

            <div class="sidebar-profile">
                <span class="profile-name"></span>
            </div>

            <ul class="sidebar-menu">
                <li><a href="#dashboard"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                <li><a href="#surat"><i class="fas fa-envelope"></i> Surat</a></li>
            </ul>

            <div class="sidebar-footer">
                <button class="btn-logout" id="logout-btn">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>

        <div class="main-content" id="main-content">
             <button id="sidebar-toggle" class="sidebar-toggle" title="Buka/Tutup Sidebar">
                <i class="fas fa-bars"></i>
            </button>
            <div class="content-area" id="app">

            </div>
        </div>
    </div>

    <div id="confirmation-modal" class="modal-overlay confirmation-modal">
        <div class="modal-content">
            <div class="confirmation-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <h3 id="confirmation-title"></h3>
            <p id="confirmation-message"></p>
            <div class="confirmation-buttons">
                <button id="confirm-no-btn" class="btn btn-secondary-confirm">Tidak</button>
                <button id="confirm-yes-btn" class="btn-danger"></button>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script type="module" src="{{ asset('panel-admin/src/app.js') }}"></script>
            <div id="toast-container"></div>
</body>
</html>

