// File ini bertanggung jawab untuk 'menggambar' UI halaman login.
// Ia hanya mengembalikan template HTML karena CSS sudah dipindahkan.

export const render = () => {
    // HTML untuk form login
    const html = `
    <div class="login-wrapper">
        <!-- Konten branding/judul sekarang dihapus sesuai permintaan -->

        <!-- Kontainer Form Login -->
        <div class="login-form-container">
            <div class="login-form-wrapper">
                <div class="logo-header">
                    <img src="../assets/img/kominfo.png" alt="Logo Kominfo">
                    <img src="../assets/img/pemkot.png" alt="Logo Pemkot Pekanbaru">
                </div>
                <h2>SIMAGANG</h2>
                <p class="login-info">Selamat Datang Kembali Admin</p>
                <form id="login-form">
                    <div class="form-group">
                        <input type="text" id="email" name="email" required autocomplete="off">
                        <label for="email">Email</label>
                    </div>
                    <div class="form-group">
                        <input type="password" id="password" name="password" required>
                        <label for="password">Password</label>
                    </div>
                     <div class="forgot-password-container">
                        <a href="#" id="forgot-password" class="forgot-password-link">Lupa Password?</a>
                    </div>
                    <p id="error-message" class="error-message"></p>
                    <button type="submit" class="btn-login">Login</button>
                </form>
            </div>
        </div>
    </div>
    `;

    return html;
};

