/**
 * @file View untuk Halaman Pengaturan.
 */

export function render() {
    return `
        <div class="page-container settings-page">
            <div class="page-header">
                <h2 class="page-title">Pengaturan Aplikasi & Profil</h2>
            </div>

            <div class="settings-grid">

                <div class="settings-card">
                    <h3>Kontak Admin untuk Widget Pengguna</h3>
                    <p>Pilih admin yang nomor teleponnya akan ditampilkan pada widget kontak di halaman pengguna.</p>
                    
                    <form id="contact-widget-form">
                        <div class="form-group">
                            <select id="contact-admin-select" class="filter-select" required>
                                <option value="">Memuat admin...</option>

                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-save">
                                <span class="btn-text">Simpan Kontak Widget</span>
                                <div class="spinner"></div>
                            </button>
                        </div>
                        <p id="contact-widget-message" class="info-message small" style="display: none;"></p>
                    </form>
                </div>

                <div class="settings-card">
                    <h3>Edit Profil Saya</h3>
                    <p>Perbarui nama dan nomor telepon Anda. Nomor telepon ini mungkin ditampilkan di halaman pengguna.</p>
                    
                    <form id="profile-form">
                        <div class="form-group floating-label">
                            <input type="text" id="profile-name" required placeholder=" "> 
                            <label for="profile-name">Nama Admin</label>
                        </div>
                        <div class="form-group floating-label">
                            <input type="tel" id="profile-phone" placeholder="Contoh: 081234567890" required>
                            <label for="profile-phone">Nomor Telepon (WhatsApp)</label>
                            <small>Pastikan nomor ini aktif.</small>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-save">
                                <span class="btn-text">Simpan Profil</span>
                                <div class="spinner"></div>
                            </button>
                        </div>
                         <p id="profile-message" class="info-message small" style="display: none;"></p>
                    </form>
                </div>

                <div class="settings-card">
                    <h3>Ubah Password Saya</h3>
                    
                    <form id="password-form">

                        <div class="form-group floating-label">
                            <input type="password" id="current-password" required placeholder=" ">
                            <label for="current-password">Password Saat Ini</label>
                        </div>

                        <div class="form-group floating-label">
                            <input type="password" id="new-password" required placeholder=" ">
                             <label for="new-password">Password Baru</label>
                        </div>

                         <div class="form-group floating-label">
                            <input type="password" id="new-password-confirm" required placeholder=" ">
                            <label for="new-password-confirm">Konfirmasi Password Baru</label>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-save">
                                <span class="btn-text">Ubah Password</span>
                                <div class="spinner"></div>
                            </button>
                        </div>
                         <p id="password-message" class="info-message small" style="display: none;"></p>
                    </form>
                </div>
            </div>
        </div>
    `;
}

