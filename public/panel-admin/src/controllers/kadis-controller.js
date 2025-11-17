/**
 * @file Controller untuk Halaman Kadis.
 * Mengelola filter, pengambilan data, dan modal disposisi.
 */

import * as kadisModel from '../models/kadis-model.js';
import { renderCards, renderDisposisiModalContent } from '../views/kadis-view.js';
// Impor fungsi update status dari surat-model (untuk tombol Tolak)
import { updateSubmissionStatus } from '../models/surat-model.js';
// Impor fungsi konfirmasi dari app.js
import { showConfirmation } from '../app.js';

/**
 * Fungsi untuk menampilkan notifikasi toast.
 * Didefinisikan di sini agar controller mandiri.
 * @param {string} message - Pesan yang akan ditampilkan.
 * @param {string} type - Tipe toast ('success', 'error', 'info').
 */
function showToast(message, type = 'success') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 4000);
}


export async function init() {
    // --- Seleksi Elemen ---
    const grid = document.getElementById('kadis-grid');
    const welcomeName = document.getElementById('kadis-name');
    const logoutBtn = document.getElementById('kadis-logout-btn');
    const monthFilter = document.getElementById('month-filter');
    const yearFilter = document.getElementById('year-filter');
    const resetFilterBtn = document.getElementById('reset-filter-btn');

    // Modal Disposisi
    const disposisiModal = document.getElementById('kadis-disposisi-modal');
    const closeDisposisiModalBtn = document.getElementById('close-disposisi-modal-btn');
    const disposisiForm = document.getElementById('disposisi-form');
    const disposisiSubmitBtn = document.getElementById('disposisi-submit-btn');
    const disposisiErrorMsg = document.getElementById('disposisi-error-message');
    const disposisiRejectBtn = document.getElementById('disposisi-reject-btn');

    let allDisposisiSurat = []; // State lokal (hanya surat disposisi)

    // --- Fungsi Helper ---
    function setLoading(button, isLoading) {
        if (!button) return;
        button.disabled = isLoading;
        button.classList.toggle('loading', isLoading);
    }

    function applyFiltersAndRender() {
        if (!grid) return;
        const selectedMonth = monthFilter.value;
        const selectedYear = yearFilter.value;

        let filteredSubmissions = allDisposisiSurat;

        if (selectedYear !== 'semua') {
            filteredSubmissions = filteredSubmissions.filter(sub => new Date(sub.created_at).getFullYear() == selectedYear);
        }
        if (selectedMonth !== 'semua') {
            filteredSubmissions = filteredSubmissions.filter(sub => (new Date(sub.created_at).getMonth() + 1) == selectedMonth);
        }
        
        renderCards(grid, filteredSubmissions);
    }

    function populateYearFilter(submissions) {
        if (!yearFilter || !submissions || submissions.length === 0) return;
        const years = submissions.map(sub => new Date(sub.created_at).getFullYear());
        const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
        yearFilter.innerHTML = '<option value="semua">Semua Tahun</option>';
        uniqueYears.forEach(year => {
            yearFilter.innerHTML += `<option value="${year}">${year}</option>`;
        });
    }

    // --- Inisialisasi Data ---
    async function loadPage() {
        try {
            if (grid) grid.innerHTML = `<p class="info-message">Memuat data surat...</p>`;
            
            const adminName = localStorage.getItem('adminName');
            if (welcomeName) welcomeName.textContent = adminName || 'Kadis';
            
            const allSubmissions = await kadisModel.getAllSubmissions();
            // Filter HANYA surat "DISPOSISI"
            allDisposisiSurat = allSubmissions.filter(s => s.status.toUpperCase() === 'DISPOSISI');
            
            populateYearFilter(allDisposisiSurat);
            applyFiltersAndRender();

        } catch (error) {
            if (grid) grid.innerHTML = `<p class="info-message error">Gagal memuat data: ${error.message}</p>`;
        }
    }

    // --- Event Listeners ---
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminName');
        localStorage.removeItem('adminRole');
        window.location.hash = '#login';
    });

    monthFilter?.addEventListener('change', applyFiltersAndRender);
    yearFilter?.addEventListener('change', applyFiltersAndRender);
    resetFilterBtn?.addEventListener('click', () => {
        monthFilter.value = 'semua';
        yearFilter.value = 'semua';
        applyFiltersAndRender();
    });

    // Klik pada Kartu di Grid (Membuka Modal Disposisi)
    grid?.addEventListener('click', async (e) => {
        const card = e.target.closest('.card-surat');
        const fileLink = e.target.closest('.file-link');

        if (fileLink) {
            e.preventDefault();
            const submissionId = fileLink.dataset.id;
            try {
                window.showToast('Mendapatkan link file...', 'info');
                const fileUrl = await kadisModel.getProtectedFileUrl(submissionId);
                window.open(fileUrl, '_blank');
            } catch (error) { window.showToast(error.message, 'error'); }
            return;
        }
        
        if (card) {
            const submissionId = card.dataset.id;
            const submission = allDisposisiSurat.find(s => s.id == submissionId);
            if (submission) {
                renderDisposisiModalContent(submission);
                // Set ID di tombol Tolak saat modal dibuka
                if(disposisiRejectBtn) disposisiRejectBtn.dataset.id = submission.id;
                disposisiModal.classList.add('show');
            }
        }
    });

    // Tombol Tutup Modal Disposisi
    closeDisposisiModalBtn?.addEventListener('click', () => disposisiModal.classList.remove('show'));
    disposisiModal?.addEventListener('click', (e) => {
        if (e.target === disposisiModal) disposisiModal.classList.remove('show');
    });
    
    // Submit Form Disposisi (Kirim ke Bidang)
    disposisiForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        setLoading(disposisiSubmitBtn, true);
        disposisiErrorMsg.style.display = 'none';

        const submissionId = disposisiForm.querySelector('#disposisi-submission-id').value;
        const selectedBidang = disposisiForm.querySelector('input[name="bidang"]:checked');

        if (!selectedBidang) {
            disposisiErrorMsg.textContent = 'Silakan pilih satu bidang untuk disposisi.';
            disposisiErrorMsg.style.display = 'block';
            setLoading(disposisiSubmitBtn, false);
            return;
        }

        try {
            const result = await kadisModel.updateDisposisiBidang(submissionId, selectedBidang.value);
            
            allDisposisiSurat = allDisposisiSurat.filter(s => s.id != submissionId);
            applyFiltersAndRender();
            
            disposisiModal.classList.remove('show');
            window.showToast(result.message, 'success');

        } catch (error) {
            disposisiErrorMsg.textContent = error.message;
            disposisiErrorMsg.style.display = 'block';
        } finally {
            setLoading(disposisiSubmitBtn, false);
        }
    });

    // Klik Tombol Tolak
    disposisiRejectBtn?.addEventListener('click', async () => {
        const submissionId = disposisiRejectBtn.dataset.id;
        if (!submissionId) return;

        // [PERBAIKAN] Tutup modal disposisi DULU
        disposisiModal.classList.remove('show');

        // Tampilkan modal konfirmasi
        const confirmed = await showConfirmation(
            'Konfirmasi Penolakan',
            'Apakah Anda yakin ingin MENOLAK surat pengajuan ini? Status akan diubah menjadi "DITOLAK".',
            'Ya, Tolak'
        );

        if (confirmed) {
            try {
                window.showToast('Menolak surat...', 'info');
                await updateSubmissionStatus(submissionId, 'DITOLAK');
                
                allDisposisiSurat = allDisposisiSurat.filter(s => s.id != submissionId);
                applyFiltersAndRender();
                
                window.showToast('Surat berhasil ditolak.');

            } catch (error) {
                window.showToast(`Gagal menolak surat: ${error.message}`, 'error');
            }
        }
    });

    // --- Muat Data Awal ---
    loadPage();
}