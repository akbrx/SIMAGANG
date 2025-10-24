/**
 * @file Controller untuk Halaman Surat.
 * Mengelola interaksi UI, termasuk logika filter, dan mengorkestrasi data dari Model ke View.
 */

import * as suratModel from '../models/surat-model.js';
import { renderCards, renderModalContent } from '../views/surat-view.js';

// [IMPLEMENTASI LENGKAP] Fungsi untuk menampilkan notifikasi toast
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

    // Menambahkan class 'show' untuk memicu animasi masuk
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Setelah beberapa detik, hapus class 'show' untuk memicu animasi keluar
    setTimeout(() => {
        toast.classList.remove('show');
        // Hapus elemen dari DOM setelah animasi selesai
        toast.addEventListener('transitionend', () => toast.remove());
    }, 4000);
}

export async function init() {
    const cardGrid = document.getElementById('cardGrid');
    const detailModal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    const modalFooter = document.getElementById('modalFooter');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const monthFilter = document.getElementById('month-filter');
    const yearFilter = document.getElementById('year-filter');
    const resetFilterBtn = document.getElementById('reset-filter-btn');
    
    let allSubmissions = [];

    // [IMPLEMENTASI LENGKAP] Fungsi untuk menerapkan filter dan me-render ulang kartu
    function applyFiltersAndRender() {
        const selectedMonth = monthFilter.value;
        const selectedYear = yearFilter.value;

        let filteredSubmissions = allSubmissions;

        if (selectedYear !== 'semua') {
            filteredSubmissions = filteredSubmissions.filter(sub => new Date(sub.created_at).getFullYear() == selectedYear);
        }
        if (selectedMonth !== 'semua') {
            filteredSubmissions = filteredSubmissions.filter(sub => (new Date(sub.created_at).getMonth() + 1) == selectedMonth);
        }

        renderCards(cardGrid, filteredSubmissions);
    }

    // [IMPLEMENTASI LENGKAP] Fungsi untuk mengisi opsi tahun di dropdown filter
    function populateYearFilter(submissions) {
        if (!submissions || submissions.length === 0) return;
        
        const years = submissions.map(sub => new Date(sub.created_at).getFullYear());
        const uniqueYears = [...new Set(years)].sort((a, b) => b - a); // Urutkan dari tahun terbaru
        
        yearFilter.innerHTML = '<option value="semua">Semua Tahun</option>'; // Reset
        uniqueYears.forEach(year => {
            yearFilter.innerHTML += `<option value="${year}">${year}</option>`;
        });
    }

    try {
        cardGrid.innerHTML = `<p class="info-message">Memuat data surat...</p>`;
        allSubmissions = await suratModel.getAllSubmissions();
        populateYearFilter(allSubmissions);
        applyFiltersAndRender(); 
    } catch (error) {
        console.error("Gagal memuat data awal:", error);
        cardGrid.innerHTML = `<p class="info-message error">${error.message}</p>`;
        showToast(error.message, 'error');
    }

    // --- Event Listeners ---
    
    monthFilter.addEventListener('change', applyFiltersAndRender);
    yearFilter.addEventListener('change', applyFiltersAndRender);
    resetFilterBtn.addEventListener('click', () => {
        monthFilter.value = 'semua';
        yearFilter.value = 'semua';
        applyFiltersAndRender();
        showToast('Filter telah direset', 'info');
    });

    cardGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.card-surat');
        if (card) {
            const submissionId = card.dataset.id;
            const submission = allSubmissions.find(s => s.id == submissionId);
            renderModalContent(modalBody, modalFooter, submission);
            detailModal.classList.add('show');
        }
    });

    detailModal.addEventListener('click', async (event) => {
        if (event.target.classList.contains('file-link-modal')) {
            event.preventDefault();
            const submissionId = event.target.dataset.id;
            try {
                showToast('Mendapatkan link file...', 'info');
                const fileUrl = await suratModel.getProtectedFileUrl(submissionId);
                window.open(fileUrl, '_blank');
            } catch (error) { showToast(error.message, 'error'); }
        }
        
        if (event.target.id === 'delete-btn') {
            const submissionId = event.target.dataset.id;
            
            const confirmed = await showConfirmation(
                'Konfirmasi Penghapusan',
                'Apakah Anda yakin ingin menghapus surat pengajuan ini? Aksi ini tidak dapat dibatalkan.',
                'Ya, Hapus'
            );

            if (confirmed) {
                try {
                    showToast('Menghapus surat...', 'info');
                    await suratModel.deleteSubmission(submissionId);
                    
                    // Hapus dari state lokal
                    allSubmissions = allSubmissions.filter(s => s.id != submissionId);
                    
                    applyFiltersAndRender(); // Render ulang kartu
                    detailModal.classList.remove('show'); // Tutup modal
                    showToast('Surat berhasil dihapus!');
                } catch (error) {
                    console.error('Gagal menghapus:', error);
                    showToast(error.message, 'error');
                }
            }
        }
    });
    
    detailModal.addEventListener('change', async (event) => {
        if (event.target.id === 'select-status-modal') {
            const submissionId = event.target.dataset.id;
            const newStatus = event.target.value;
            try {
                const updatedSubmission = await suratModel.updateSubmissionStatus(submissionId, newStatus);
                const index = allSubmissions.findIndex(s => s.id == submissionId);
                if (index !== -1) {
                    allSubmissions[index] = updatedSubmission;
                }
                applyFiltersAndRender();
                showToast('Status berhasil diperbarui!');
                // [PERUBAHAN] Otomatis tutup modal setelah berhasil
                detailModal.classList.remove('show');
            } catch (error) { 
                showToast(`Gagal: ${error.message}`, 'error'); 
            }
        }
    });

    closeModalBtn.addEventListener('click', () => detailModal.classList.remove('show'));
    detailModal.addEventListener('click', (event) => {
        if (event.target === detailModal) detailModal.classList.remove('show');
    });
}

function showConfirmation(title, message, confirmText = 'Ya') {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirmation-modal');
        const titleEl = document.getElementById('confirmation-title');
        const messageEl = document.getElementById('confirmation-message');
        const yesBtn = document.getElementById('confirm-yes-btn');
        const noBtn = document.getElementById('confirm-no-btn');

        if (!modal || !titleEl || !messageEl || !yesBtn || !noBtn) {
            console.error('Elemen modal konfirmasi tidak ditemukan.');
            resolve(false);
            return;
        }

        titleEl.textContent = title;
        messageEl.textContent = message;
        yesBtn.textContent = confirmText;

        modal.classList.add('show');

        const cleanupAndClose = (result) => {
            modal.classList.remove('show');
            yesBtn.removeEventListener('click', handleYes);
            noBtn.removeEventListener('click', handleNo);
            resolve(result);
        };

        const handleYes = () => cleanupAndClose(true);
        const handleNo = () => cleanupAndClose(false);

        yesBtn.addEventListener('click', handleYes);
        noBtn.addEventListener('click', handleNo);
    });
}