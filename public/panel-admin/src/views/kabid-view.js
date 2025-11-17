/**
 * @file View untuk Halaman Kabid.
 * Merender UI (header, filter, grid) untuk penugasan pembimbing.
 */

/**
 * Merender kartu-kartu pengajuan (Versi Kabid).
 */
export function renderCards(container, submissions) {
    if (!container) return;
    if (!submissions || submissions.length === 0) {
        container.innerHTML = `<p class="info-message">Tidak ada surat untuk ditugaskan.</p>`;
        return;
    }

    // TODO: Status apa yang harus ditampilkan di sini? Kita simulasikan 'DISPOSISI'
    const statusBadge = `<span class="status-badge status-disposition">DISPOSISI</span>`;

    container.innerHTML = submissions.map(sub => {
        const studentName = sub.student?.nama ?? 'Data Mahasiswa Hilang';
        const tglPengajuan = new Date(sub.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
        
        return `
            <div class="card-surat" data-id="${sub.id}" role="button" tabindex="0">
                <div class="card-header-surat">
                    <h3 class="student-name">${studentName}</h3>
                </div>
                <div class="card-body-surat">
                    <div class="info-item">
                        <span class="label">Status</span>
                        <span class="value">${statusBadge}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Diajukan pada</span>
                        <span class="value">${tglPengajuan}</span>
                    </div>
                     <div class="info-item file-info">
                         <span class="label">Surat Permohonan</span>
                        <a href="#" class="file-link" data-id="${sub.id}">
                            <i class="fas fa-file-pdf icon-pdf"></i> ${sub.original_filename || 'Lihat File'}
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Mengisi konten modal penugasan.
 */
export function renderAssignModalContent(submission) {
    const infoContainer = document.getElementById('kabid-applicant-info');
    const form = document.getElementById('kabid-assign-form');
    const submissionIdInput = document.getElementById('kabid-submission-id');
    
    if (!infoContainer || !form || !submissionIdInput) return;

    // 1. Isi info pengaju
    infoContainer.innerHTML = `
        <p><strong>Kepada:</strong> ${submission.student?.nama || 'N/A'}</p>
        <p><strong>Instansi:</strong> ${submission.student?.asal_sekolah || 'N/A'}</p>
        <p><strong>Jurusan:</strong> ${submission.student?.jurusan || 'N/A'}</p>
    `;
    
    // 2. Reset form
    form.reset();
    submissionIdInput.value = submission.id;
}


/**
 * Merender layout utama halaman Kabid.
 */
export function render() {
    return `
        <div class="page-container kabid-page">
            <!-- Header Halaman -->
            <header class="pembimbing-header">
                <div class="header-content">
                    <h3>Penugasan Pembimbing</h3>
                    <p>Selamat datang, <span id="kabid-name" class="profile-name">Kabid</span>. (Surat dari Kadis)</p>
                </div>
                <button class="btn-logout" id="kabid-logout-btn" title="Logout">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </header>

            <!-- Filter (Mirip Halaman Surat) -->
            <div class="page-header">
                <h2 class="page-title">Daftar Surat Masuk</h2>
                <div class="filter-container">
                    <div class="filter-group">
                        <label for="month-filter">Filter Bulan:</label>
                        <select id="month-filter" class="filter-select">
                            <option value="semua">Semua Bulan</option>
                            {/* ... Opsi Bulan ... */}
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="year-filter">Tahun:</label>
                        <select id="year-filter" class="filter-select">
                            <option value="semua">Semua Tahun</option>
                        </select>
                    </div>
                    <button id="reset-filter-btn" class="btn-secondary" title="Hapus filter">
                        <i class="fas fa-redo"></i> Reset
                    </button>
                </div>
            </div>

            <!-- Grid Kartu Surat -->
            <div id="kabid-grid" class="card-grid-surat">
                <p class="info-message">Memuat data surat...</p>
            </div>
        </div>
    `;
}