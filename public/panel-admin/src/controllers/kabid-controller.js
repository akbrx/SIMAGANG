/**
 * @file Controller untuk Halaman Kabid.
 * Mengelola filter, pengambilan data, dan modal penugasan pembimbing.
 */

import * as kabidModel from '../models/kabid-model.js';
import { renderCards, renderAssignModalContent } from '../views/kabid-view.js';
// Asumsikan showToast ada secara global
// window.showToast(...)

export async function init() {
    // --- Seleksi Elemen ---
    const grid = document.getElementById('kabid-grid');
    const welcomeName = document.getElementById('kabid-name');
    const logoutBtn = document.getElementById('kabid-logout-btn');
    const monthFilter = document.getElementById('month-filter');
    const yearFilter = document.getElementById('year-filter');
    const resetFilterBtn = document.getElementById('reset-filter-btn');

    // Modal Penugasan
    const assignModal = document.getElementById('kabid-assign-modal');
    const closeAssignModalBtn = document.getElementById('close-kabid-modal-btn');
    const assignForm = document.getElementById('kabid-assign-form');
    const assignSubmitBtn = document.getElementById('kabid-submit-btn');
    const assignErrorMsg = document.getElementById('kabid-error-message');

    let allKabidSurat = []; // State lokal

    // --- Fungsi Helper ---
    function setLoading(button, isLoading) { /* ... (fungsi tidak berubah) ... */ }

    function applyFiltersAndRender() {
        if (!grid) return;
        const selectedMonth = monthFilter.value;
        const selectedYear = yearFilter.value;

        // [SIMULASI] Untuk testing, kita tampilkan surat 'DISPOSISI'
        // Nanti, ini harus diganti statusnya (misal: 'DITERUSKAN_KE_KABID')
        let filteredSubmissions = allKabidSurat;

        if (selectedYear !== 'semua') {
            filteredSubmissions = filteredSubmissions.filter(sub => new Date(sub.created_at).getFullYear() == selectedYear);
        }
        if (selectedMonth !== 'semua') {
            filteredSubmissions = filteredSubmissions.filter(sub => (new Date(sub.created_at).getMonth() + 1) == selectedMonth);
        }
        renderCards(grid, filteredSubmissions);
    }

    function populateYearFilter(submissions) { /* ... (fungsi tidak berubah) ... */ }

    // --- Inisialisasi Data ---
    async function loadPage() {
        try {
            if (grid) grid.innerHTML = `<p class="info-message">Memuat data surat...</p>`;
            
            const adminName = localStorage.getItem('adminName');
            if (welcomeName) welcomeName.textContent = adminName || 'Kabid';
            
            const allSubmissions = await kabidModel.getAllSubmissions();
            // [SIMULASI] Tampilkan surat 'DISPOSISI' untuk testing
            // TODO: Ganti ke status yang benar (misal: 'DITERUSKAN_KE_KABID')
            allKabidSurat = allSubmissions.filter(s => s.status.toUpperCase() === 'DISPOSISI');
            
            populateYearFilter(allKabidSurat);
            applyFiltersAndRender();
        } catch (error) {
            if (grid) grid.innerHTML = `<p class="info-message error">Gagal memuat data: ${error.message}</p>`;
        }
    }

    // --- Event Listeners ---
    logoutBtn?.addEventListener('click', () => { /* ... (logika logout) ... */ });
    monthFilter?.addEventListener('change', applyFiltersAndRender);
    yearFilter?.addEventListener('change', applyFiltersAndRender);
    resetFilterBtn?.addEventListener('click', () => { /* ... */ });

    // Klik pada Kartu di Grid (Membuka Modal Penugasan)
    grid?.addEventListener('click', async (e) => {
        const card = e.target.closest('.card-surat');
        const fileLink = e.target.closest('.file-link');

        if (fileLink) { /* ... (logika buka file tidak berubah) ... */ return; }
        
        if (card) {
            const submissionId = card.dataset.id;
            const submission = allKabidSurat.find(s => s.id == submissionId);
            if (submission) {
                renderAssignModalContent(submission);
                assignModal.classList.add('show');
            }
        }
    });

    // Tombol Tutup Modal Penugasan
    closeAssignModalBtn?.addEventListener('click', () => assignModal.classList.remove('show'));
    assignModal?.addEventListener('click', (e) => {
        if (e.target === assignModal) assignModal.classList.remove('show');
    });
    
    // Submit Form Penugasan
    assignForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        setLoading(assignSubmitBtn, true);
        assignErrorMsg.style.display = 'none';

        const submissionId = assignForm.querySelector('#kabid-submission-id').value;
        const pembimbingName = assignForm.querySelector('#kabid-pembimbing-name').value;
        const pembimbingPhone = assignForm.querySelector('#kabid-pembimbing-phone').value;

        try {
            const result = await kabidModel.assignPembimbing(submissionId, pembimbingName, pembimbingPhone);
            
            allKabidSurat = allKabidSurat.filter(s => s.id != submissionId);
            applyFiltersAndRender();
            
            assignModal.classList.remove('show');
            window.showToast(result.message, 'success');
        } catch (error) {
            assignErrorMsg.textContent = error.message;
            assignErrorMsg.style.display = 'block';
        } finally {
            setLoading(assignSubmitBtn, false);
        }
    });

    // --- Muat Data Awal ---
    loadPage();
}