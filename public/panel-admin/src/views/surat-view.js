/**
 * @file View untuk Halaman Surat.
 * Menyediakan template HTML dan fungsi untuk merender komponen UI.
 */

/**
 * Merender layout utama halaman surat, termasuk filter.
 * @returns {string} String HTML untuk seluruh halaman.
 */
export function render() {
    return `
        <div class="page-container-surat">
            <div class="page-header">
                <h2 class="page-title">Daftar Surat Pengajuan</h2>
                <div class="filter-container">
                    <div class="filter-group">
                        <label for="month-filter">Tampilkan Berdasarkan Bulan:</label>
                        <select id="month-filter" class="filter-select">
                            <option value="semua">Semua Bulan</option>
                            <option value="1">Januari</option>
                            <option value="2">Februari</option>
                            <option value="3">Maret</option>
                            <option value="4">April</option>
                            <option value="5">Mei</option>
                            <option value="6">Juni</option>
                            <option value="7">Juli</option>
                            <option value="8">Agustus</option>
                            <option value="9">September</option>
                            <option value="10">Oktober</option>
                            <option value="11">November</option>
                            <option value="12">Desember</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="year-filter">Tahun:</label>
                        <select id="year-filter" class="filter-select">
                            <option value="semua">Semua Tahun</option>
                        </select>
                    </div>
                    <button id="reset-filter-btn" class="btn-secondary" title="Hapus semua filter">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                        </svg>
                        Reset
                    </button>
                </div>
            </div>
            <div id="cardGrid" class="card-grid-surat"></div>
        </div>

        <div id="detailModal" class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modal-title">Detail Pengajuan</h2>
                    <button id="closeModalBtn" class="modal-close-btn">&times;</button>
                </div>
                <div id="modalBody" class="modal-body"></div>
                <div class="modal-footer" id="modalFooter"></div>
            </div>
        </div>
    `;
}

/**
 * Merender kartu-kartu pengajuan.
 * @param {HTMLElement} container - Elemen grid.
 * @param {Array} submissions - Array data pengajuan.
 */
export function renderCards(container, submissions) {
    if (!container) return;
    if (submissions.length === 0) {
        container.innerHTML = `<p class="info-message">Tidak ada surat yang cocok dengan filter yang dipilih.</p>`;
        return;
    }

    const getStatusClass = (status) => {
        const s = status.toUpperCase();
        if (s === 'DITERIMA') return 'status-approved';
        if (s === 'DITOLAK') return 'status-rejected';
        if (s === 'DISPOSISI') return 'status-disposition';
        if (s === 'DIAJUKAN') return 'status-submitted';
        return '';
    };

    container.innerHTML = submissions.map(sub => {
        const studentName = sub.student?.nama ?? 'Data Mahasiswa Hilang';
        const tglPengajuan = new Date(sub.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
        const noHp = sub.student?.nomor_telepon ?? 'N/A';

        return `
            <div class="card-surat" data-id="${sub.id}">
                <div class="card-header-surat">
                    <h3 class="student-name">${studentName}</h3>
                </div>
                <div class="card-body-surat">
                    <div class="info-item">
                        <span class="label">Status</span>
                        <span class="value">
                            <span class="status-badge ${getStatusClass(sub.status)}">${sub.status}</span>
                        </span>
                    </div>
                    <div class="info-item">
                        <span class="label">Diajukan pada</span>
                        <span class="value">${tglPengajuan}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Nomor Handphone</span>
                        <span class="value">${noHp}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Merender konten detail di dalam modal.
 * @param {HTMLElement} modalBody - Elemen body modal.
 * @param {HTMLElement} modalFooter - Elemen footer modal.
 * @param {Object} submission - Objek data pengajuan.
 */
export function renderModalContent(modalBody, modalFooter, submission) {
    if (!submission) return;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
    };

    const student = submission.student ?? {};
    const processor = submission.processor ?? {};

    let processedByHtml = '';
    if (processor.nama && submission.processed_at) {
        processedByHtml = `<strong>Diproses oleh:</strong> <span>${processor.nama} pada ${formatDate(submission.processed_at)}</span>`;
    }

    // Render Body Modal
    modalBody.innerHTML = `
        <div class="detail-grid">
            <div class="detail-item"><strong>Nama Lengkap</strong><span>${student.nama ?? 'N/A'}</span></div>
            <div class="detail-item"><strong>Instansi Asal</strong><span>${student.asal_sekolah ?? 'N/A'}</span></div>
            <div class="detail-item"><strong>Jurusan</strong><span>${student.jurusan ?? 'N/A'}</span></div>
            <div class="detail-item"><strong>Alamat Email</strong><span>${student.email ?? 'N/A'}</span></div>
            <div class="detail-item"><strong>No. Handphone</strong><span>${student.nomor_telepon ?? 'N/A'}</span></div>
            <div class="detail-item"><strong>Lama Magang</strong><span>${submission.durasi_magang ?? 'N/A'}</span></div>
            <div class="detail-item"><strong>ID Lacak</strong><span>${submission.unique_token ?? 'N/A'}</span></div>
            <div class="detail-item"><strong>Surat Permohonan</strong><a href="#" class="file-link-modal" data-id="${submission.id}">📄 ${submission.original_filename || 'Lihat File'}</a></div>
            ${processedByHtml ? `<div class="detail-item full-width">${processedByHtml}</div>` : ''}
        </div>
    `;

    // Render Footer Modal
    modalFooter.innerHTML = `
        <button class="btn-danger" id="delete-btn" data-id="${submission.id}">Hapus</button>
        <div class="modal-actions">
            <label for="select-status-modal">Ubah Status:</label>
            <select class="select-status-modal" id="select-status-modal" data-id="${submission.id}">
                <option value="DIAJUKAN" ${submission.status === 'DIAJUKAN' ? 'selected' : ''}>DIAJUKAN</option>
                <option value="DISPOSISI" ${submission.status === 'DISPOSISI' ? 'selected' : ''}>DISPOSISI</option>
                <option value="DITERIMA" ${submission.status === 'DITERIMA' ? 'selected' : ''}>DITERIMA</option>
                <option value="DITOLAK" ${submission.status === 'DITOLAK' ? 'selected' : ''}>DITOLAK</option>
            </select>
        </div>
    `;
}

