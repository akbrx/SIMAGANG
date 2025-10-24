<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin SIMAGANG</title>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <!-- Main CSS -->
    <link rel="stylesheet" href="{{ asset('panel-admin/assets/css/style.css') }}">
</head>
<body>
    <div id="app-wrapper">
        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <div class="sidebar-logo-container">
                    {{-- Ganti path gambar sesuai struktur folder public Anda --}}
                    <img src="{{ asset('panel-admin/assets/img/pemkot.png') }}" alt="Logo Pemkot">
                    <img src="{{ asset('panel-admin/assets/img/kominfo.png') }}" alt="Logo Kominfo">
                </div>
                <h3>SIMAGANG</h3>
            </div>

            <div class="sidebar-profile">
                {{-- Anda bisa menampilkan nama admin yang login di sini menggunakan Auth::user()->nama --}}
                <span class="profile-name"></span>
            </div>

            <ul class="sidebar-menu">
                <li><a href="#dashboard"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                <li><a href="#surat"><i class="fas fa-envelope"></i> Surat</a></li>
                {{-- [BARU] Menambahkan link Pengaturan --}}
                <li><a href="#pengaturan"><i class="fas fa-cog"></i> Pengaturan</a></li>
            </ul>

            <div class="sidebar-footer">
                <button class="btn-logout" id="logout-btn">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </aside>

        <!-- Konten Utama -->
        <main class="main-content" id="main-content">
             <button id="sidebar-toggle" class="sidebar-toggle" title="Buka/Tutup Sidebar">
                <i class="fas fa-bars"></i>
            </button>
            {{-- Konten dinamis akan dimuat oleh JavaScript ke dalam div #app --}}
            <div class="content-area" id="app">
                {{-- Placeholder - Konten awal bisa kosong atau berisi loading spinner --}}
            </div>
        </main>
    </div>

    <!-- Modal Konfirmasi Kustom -->
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
    
    <!-- Container untuk notifikasi Toast -->
    <div id="toast-container"></div>

    <!-- Library Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Main JavaScript App -->
    <script type="module" src="{{ asset('panel-admin/src/app.js') }}"></script>
</body>
</html>
