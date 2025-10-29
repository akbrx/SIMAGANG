export function render() {
    // Menggunakan gaya mirip halaman login
    return `
        <div class="login-wrapper forgot-password-wrapper">
            <div class="login-form-container">
                <div class="login-form-wrapper">
                    <div class="logo-header">
                         <img src="../assets/img/kominfo.png" alt="Logo Kominfo">
                         <img src="../assets/img/pemkot.png" alt="Logo Pemkot Pekanbaru">
                    </div>
                    <h2>Lupa Password Admin</h2>
                    <p class="login-info">Masukkan alamat email Anda. Kami akan mengirimkan link untuk mengatur ulang password.</p>

                    <form id="forgot-password-form">
                        <div class="form-group floating-label">
                            <input type="email" id="email" name="email" required placeholder=" ">
                            <label for="email">Alamat Email</label>
                        </div>

                        <p id="forgot-error-message" class="error-message" style="text-align: center;"></p>
                        <p id="forgot-success-message" class="success-message" style="display: none; text-align: center;">Link reset password telah dikirim! Silakan periksa email Anda.</p>

                        <button type="submit" class="btn-login">
                            <span class="btn-text">Kirim Link Reset</span>
                            <div class="spinner"></div>
                        </button>

                        <div class="back-to-login">
                            <a href="#login">Kembali ke Login</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
}
