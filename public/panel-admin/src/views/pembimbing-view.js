/**
 * @file View untuk Halaman Pembimbing.
 * Merender UI dengan modal terpisah untuk Add dan Edit.
 */

/**
 * Merender layout utama halaman pembimbing.
 */
export function render() {
    return `
        <div class="page-container pembimbing-page">
            <!-- Header Halaman Pembimbing (Filter, Tombol Tambah, Logout) -->
            <header class="page-header">
                <div>
                    <h2 class="page-title">Catatan Anak Magang</h2>
                    <p class="page-subtitle">Selamat datang, <span id="pembimbing-name" class="profile-name">...</span></p>
                </div>
                <div class="filter-container">
                    <div class="filter-group">
                        <label for="pembimbing-search">Cari Nama:</label>
                        <input type="search" id="pembimbing-search" class="filter-select" placeholder="Ketik nama anak magang...">
                    </div>
                    <button id="pembimbing-add-btn" class="btn btn-primary-solid">
                        <i class="fas fa-plus"></i> Tambah Catatan
                    </button>
                    <button class="btn-logout" id="pembimbing-logout-btn" title="Logout">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </header>

            <!-- Grid untuk Kartu Catatan -->
            <div class="card-grid-surat" id="pembimbing-grid">
                <!-- Konten diisi oleh controller -->
            </div>
        </div>

        <!-- [MODAL 1] Modal untuk TAMBAH Catatan Baru -->
        <div id="pembimbing-add-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="add-modal-title">Tambah Catatan Magang Baru</h2>
                    <button id="close-add-modal-btn" class="modal-close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="add-note-form">
                        <div class="form-group">
                            <label for="student-name">Nama Anak Magang</label>
                            <input type="text" id="student-name" required>
                        </div>
                        <div class="form-group">
                            <label for="disposition-file">Foto Lembar Disposisi (Bukti)</label>
                            <input type="file" id="disposition-file" accept="image/png, image/jpeg, image/jpg" required>
                            <small>Upload foto/scan lembar disposisi. (Format: JPG, PNG, Maks 2MB)</small>
                        </div>
                        <div class="form-group">
                            <label for="notes">Catatan Perkembangan (Opsional)</label>
                            <textarea id="notes" rows="5" placeholder="Catat progres, kehadiran, atau tugas..."></textarea>
                        </div>
                        <p id="add-note-error" class="info-message error small" style="display: none;"></p>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary" id="save-note-btn" form="add-note-form">
                        <span class="btn-text">Simpan Catatan</span>
                        <div class="spinner"></div>
                    </button>
                </div>
            </div>
        </div>

        <!-- [MODAL 2] Modal untuk LIHAT/EDIT Catatan -->
        <div id="pembimbing-edit-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="edit-modal-title">Edit Catatan</h2>
                    <button id="close-edit-modal-btn" class="modal-close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="edit-note-form">
                        <input type="hidden" id="edit-note-id">
                        
                        <div class="form-group">
                            <label>Nama Anak Magang</label>
                            <input type="text" id="edit-student-name" class="read-only-field" readonly>
                        </div>
                        
                        <div class="form-group">
                            <label>Foto Lembar Disposisi</label>
                            <img src="https://via.placeholder.com/300x180.png?text=Loading..." alt="Foto Lembar Disposisi" id="edit-disposition-preview" class="disposition-preview-clickable">
                        </div>

                        <div class="form-group">
                            <label for="edit-notes">Catatan Perkembangan</label>
                            <textarea id="edit-notes" rows="5" placeholder="Catat progres, kehadiran, atau tugas..."></textarea>
                        </div>
                        <p id="edit-note-error" class="info-message error small" style="display: none;"></p>
                    </form>
                </div>
                <div class="modal-footer" id="edit-modal-footer">
                    <button class="btn-danger" id="edit-delete-btn">
                        <i class="fas fa-trash-alt"></i> Hapus
                    </button>
                    <button type="submit" class="btn btn-primary" id="edit-save-btn" form="edit-note-form">
                        <span class="btn-text">Update Catatan</span>
                        <div class="spinner"></div>
                    </button>
                </div>
            </div>
        </div>

        <!-- [MODAL 3] Lightbox untuk Preview Gambar -->
        <div id="image-lightbox-modal" class="lightbox-overlay">
            <span class="lightbox-close-btn">&times;</span>
            <img class="lightbox-content" id="lightbox-image">
        </div>
    `;
}