/**
 * @file View untuk Halaman Kadis.
 * Merender UI (header, filter, grid) untuk disposisi surat.
 */

/**
 * Merender kartu-kartu pengajuan (Versi Kadis).
 * @param {HTMLElement} container - Elemen grid untuk kartu.
 * @param {Array} submissions - Array data pengajuan (sudah difilter).
 */
export function renderCards(container, submissions) {
    if (!container) return;
    if (!submissions || submissions.length === 0) {
        container.innerHTML = `<p class="info-message">Tidak ada surat berstatus "DISPOSISI" yang cocok dengan filter.</p>`;
        return;
    }

    // Badge status DISPOSISI (statis, tidak bisa diklik)
    const statusBadge = `<span class="status-badge status-disposition">DISPOSISI</span>`;

    container.innerHTML = submissions.map(sub => {
        const studentName = sub.student?.nama ?? 'Data Mahasiswa Hilang';
        const tglPengajuan = new Date(sub.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
        const noHp = sub.student?.nomor_telepon ?? 'N/A';

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
                    <div class="info-item">
                        <span class="label">Nomor Handphone</span>
                        <span class="value">${noHp}</span>
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
 * Mengisi konten modal disposisi.
 * @param {Object} submission - Data pengajuan.
 */
export function renderDisposisiModalContent(submission) {
    const infoContainer = document.getElementById('disposisi-applicant-info');
    const form = document.getElementById('disposisi-form');
    const submissionIdInput = document.getElementById('disposisi-submission-id');
    
    if (!infoContainer || !form || !submissionIdInput) return;

    infoContainer.innerHTML = `
        <p><strong>Nama:</strong> ${submission.student?.nama || 'N/A'}</p>
        <p><strong>Instansi:</strong> ${submission.student?.asal_sekolah || 'N/A'}</p>
        <p><strong>Jurusan:</strong> ${submission.student?.jurusan || 'N/A'}</p>
        <p><strong>Email:</strong> ${submission.student?.email || 'N/A'}</p>
    `;
    
    form.reset();
    submissionIdInput.value = submission.id;
}


/**
 * Merender layout utama halaman Kadis.
 */
export function render() {
    return `
        <div class="page-container kadis-page">
            <!-- Header Halaman (Mirip Pembimbing) -->
            <header class="pembimbing-header">
                <div class="header-content">
                    <h3>Disposisi Surat Magang</h3>
                    <p>Selamat datang, <span id="kadis-name" class="profile-name">Kadis</span></p>
                </div>
                <button class="btn-logout" id="kadis-logout-btn" title="Logout">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </header>

            <!-- Filter (Mirip Halaman Surat) -->
            <div class="page-header">
                <h2 class="page-title">Daftar Surat Menunggu Disposisi</h2>
                <div class="filter-container">
                    <div class="filter-group">
                        <label for="month-filter">Filter Bulan:</label>
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
                    <button id="reset-filter-btn" class="btn-secondary" title="Hapus filter">
                        <i class="fas fa-redo"></i> Reset
                    </button>
                </div>
            </div>

            <!-- Grid Kartu Surat -->
            <div id="kadis-grid" class="card-grid-surat">
                <p class="info-message">Memuat data surat...</p>
            </div>
        </div>
    `;
}