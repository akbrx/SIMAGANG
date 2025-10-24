/**
 * @file View untuk Halaman Reset Password Admin.
 */

export function render() {
    // Kita akan menggunakan gaya yang mirip dengan halaman login
    return `
        <div class="login-wrapper reset-password-wrapper">
            <div class="login-form-container">
                <div class="login-form-wrapper">
                    <div class="logo-header">
                         <img src="../assets/img/kominfo.png" alt="Logo Kominfo">
                         <img src="../assets/img/pemkot.png" alt="Logo Pemkot Pekanbaru">
                    </div>
                    <h2>Atur Ulang Password</h2>
                    <p class="login-info">Masukkan password baru Anda.</p>

                    <form id="reset-password-form">
                        {/* Input tersembunyi untuk token, akan diisi oleh controller */}
                        <input type="hidden" id="reset-token" name="token">

                        <div class="form-group floating-label">
                            <input type="password" id="new-password" name="new_password" required placeholder=" ">
                            <label for="new-password">Password Baru</label>
                        </div>
                        <div class="form-group floating-label">
                            <input type="password" id="new-password-confirm" name="new_password_confirmation" required placeholder=" ">
                            <label for="new-password-confirm">Konfirmasi Password Baru</label>
                        </div>

                        <p id="reset-error-message" class="error-message" style="text-align: center;"></p>
                        <p id="reset-success-message" class="success-message" style="display: none; text-align: center;">Password berhasil diubah! Mengarahkan ke halaman login...</p>

                        <button type="submit" class="btn-login">
                            <span class="btn-text">Simpan Password Baru</span>
                            <div class="spinner"></div>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
}
