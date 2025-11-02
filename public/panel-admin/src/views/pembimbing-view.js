/**
 * @file View untuk Halaman Pembimbing.
 * Merender seluruh UI, termasuk modal.
 */

// Fungsi untuk merender "kartu" catatan
function renderNoteCards(notes) {
    if (notes.length === 0) {
        return `<p class="info-message">Anda belum memiliki catatan. Klik tombol (+) untuk menambah.</p>`;
    }
    return notes.map(note => `
        <div class="note-card" data-id="${note.id}">
            <div class="note-card-header">
                <i class="fas fa-user-graduate"></i>
                <h4 class="note-student-name">${note.student_name}</h4>
            </div>
            <div class="note-card-body">
                <img src="${note.disposition_file_url}" alt="Foto Lembar Disposisi" class="note-disposition-preview" loading="lazy">
                <p class="note-excerpt">${note.notes ? note.notes.substring(0, 100) + '...' : '<i>Tidak ada catatan.</i>'}</p>
            </div>
            <div class="note-card-footer">
                <span>Dibuat: ${new Date(note.created_at).toLocaleDateString('id-ID')}</span>
            </div>
        </div>
    `).join('');
}

// Fungsi untuk mengisi modal detail
export function renderDetailModal(note) {
    const modal = document.getElementById('pembimbing-detail-modal');
    if (!modal) return;
    
    modal.querySelector('#detail-student-name').textContent = note.student_name;
    modal.querySelector('#detail-disposition-image').src = note.disposition_file_url;
    modal.querySelector('#detail-notes-content').innerHTML = note.notes ? note.notes.replace(/\n/g, '<br>') : '<i>Tidak ada catatan.</i>';
    modal.querySelector('#detail-created-at').textContent = new Date(note.created_at).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });
    modal.querySelector('#pembimbing-delete-btn').dataset.id = note.id; // Set ID untuk tombol hapus
    
    modal.classList.add('show');
}

// Fungsi utama untuk merender seluruh halaman
export function render() {
    return `
        <div class="page-container pembimbing-page">
            <!-- Header Halaman Pembimbing -->
            <header class="pembimbing-header">
                <div class="header-content">
                    <h3>Halaman Pembimbing</h3>
                    <p>Selamat datang, <span class="profile-name">Pembimbing</span>. Kelola catatan anak magang Anda di sini.</p>
                </div>
                <button class="btn-logout" id="pembimbing-logout-btn" title="Logout">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </header>

            <!-- Grid untuk Kartu Catatan -->
            <div class="card-grid-surat" id="pembimbing-grid">
                <!-- Kartu catatan akan dirender di sini oleh controller -->
                <p class="info-message">Memuat catatan...</p>
            </div>

            <!-- Tombol Tambah (FAB) -->
            <button class="fab" id="pembimbing-add-btn" title="Tambah Catatan Anak Magang">
                <i class="fas fa-plus"></i>
            </button>
        </div>

        <!-- Modal 1: Tambah Catatan Baru -->
        <div id="pembimbing-add-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Tambah Catatan Magang</h2>
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
                            <small>Upload foto/scan lembar disposisi. (Format: JPG, PNG)</small>
                        </div>
                        <div class="form-group">
                            <label for="notes">Catatan Perkembangan (Opsional)</label>
                            <textarea id="notes" rows="5" placeholder="Catat progres, kehadiran, atau tugas..."></textarea>
                        </div>
                        <p id="add-note-error" class="info-message error small" style="display: none;"></p>
                        <div class="modal-footer">
                            <button type="submit" class="btn btn-primary" id="save-note-btn">
                                <span class="btn-text">Simpan Catatan</span>
                                <div class="spinner"></div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Modal 2: Lihat Detail Catatan -->
        <div id="pembimbing-detail-modal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="detail-student-name">Detail Catatan</h2>
                    <button id="close-detail-modal-btn" class="modal-close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="detail-note-content">
                        <h4>Foto Lembar Disposisi</h4>
                        <img id="detail-disposition-image" src="" alt="Foto Lembar Disposisi" class="detail-disposition-image">
                        
                        <h4>Catatan Perkembangan</h4>
                        <div id="detail-notes-content" class="notes-content-box"></div>
                        <small class="detail-timestamp">Dibuat pada: <span id="detail-created-at"></span></small>
                    </div>
                </div>
                 <div class="modal-footer">
                    <button class="btn-danger" id="pembimbing-delete-btn" data-id="">
                        <i class="fas fa-trash-alt"></i> Hapus Catatan
                    </button>
                </div>
            </div>
        </div>
    `;
}
