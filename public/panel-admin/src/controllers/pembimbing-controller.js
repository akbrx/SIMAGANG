/**
 * @file Controller untuk Halaman Pembimbing.
 */

import * as pembimbingModel from '../models/pembimbing-model.js';
import { renderDetailModal } from '../views/pembimbing-view.js'; // Hanya impor fungsi spesifik
import { showConfirmation } from '../app.js'; // Impor konfirmasi dari app.js
// Asumsikan showToast ada secara global
// window.showToast(...)

export async function init() {
    // --- Seleksi Elemen ---
    const grid = document.getElementById('pembimbing-grid');
    const addBtn = document.getElementById('pembimbing-add-btn');
    const addModal = document.getElementById('pembimbing-add-modal');
    const addModalForm = document.getElementById('add-note-form');
    const closeAddModalBtn = document.getElementById('close-add-modal-btn');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const addNoteError = document.getElementById('add-note-error');

    const detailModal = document.getElementById('pembimbing-detail-modal');
    const closeDetailModalBtn = document.getElementById('close-detail-modal-btn');
    const deleteNoteBtn = document.getElementById('pembimbing-delete-btn');
    
    const logoutBtn = document.getElementById('pembimbing-logout-btn');

    let allNotes = []; // State lokal untuk menyimpan data catatan

    // --- Fungsi Helper ---
    function setLoading(button, isLoading) {
        if (!button) return;
        button.disabled = isLoading;
        button.classList.toggle('loading', isLoading);
    }
    
    // [BARU] Render ulang kartu di grid
    function renderNoteCards(notes) {
        if (notes.length === 0) {
            grid.innerHTML = `<p class="info-message">Anda belum memiliki catatan. Klik tombol (+) untuk menambah.</p>`;
            return;
        }
        grid.innerHTML = notes.map(note => `
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

    // --- Inisialisasi Data ---
    async function loadNotes() {
        try {
            grid.innerHTML = `<p class="info-message">Memuat catatan...</p>`;
            allNotes = await pembimbingModel.getNotes();
            // Asumsikan backend mengembalikan 'disposition_file_url'
            renderNoteCards(allNotes);
        } catch (error) {
            grid.innerHTML = `<p class="info-message error">Gagal memuat catatan: ${error.message}</p>`;
        }
    }

    // --- Event Listeners ---

    // Tombol Logout di header pembimbing
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminName');
        window.location.hash = '#login';
    });

    // Tombol Tambah (FAB)
    addBtn?.addEventListener('click', () => {
        addModal.classList.add('show');
    });

    // Tombol Tutup Modal Tambah
    closeAddModalBtn?.addEventListener('click', () => {
        addModal.classList.remove('show');
    });
    addModal?.addEventListener('click', (e) => {
        if (e.target === addModal) addModal.classList.remove('show');
    });

    // Submit Form Tambah Catatan
    addModalForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        setLoading(saveNoteBtn, true);
        addNoteError.style.display = 'none';

        const formData = new FormData();
        formData.append('student_name', document.getElementById('student-name').value);
        formData.append('notes', document.getElementById('notes').value);
        formData.append('disposition_file', document.getElementById('disposition-file').files[0]);

        try {
            const newNote = await pembimbingModel.createNote(formData);
            allNotes.push(newNote); // Tambahkan ke state lokal
            renderNoteCards(allNotes); // Render ulang
            addModal.classList.remove('show');
            addModalForm.reset();
            window.showToast('Catatan berhasil disimpan!', 'success');
        } catch (error) {
            addNoteError.textContent = error.message;
            addNoteError.style.display = 'block';
        } finally {
            setLoading(saveNoteBtn, false);
        }
    });

    // Klik pada Kartu di Grid (Membuka Detail)
    grid?.addEventListener('click', (e) => {
        const card = e.target.closest('.note-card');
        if (card) {
            const noteId = card.dataset.id;
            const note = allNotes.find(n => n.id == noteId);
            if (note) {
                renderDetailModal(note);
            }
        }
    });

    // Tombol Tutup Modal Detail
    closeDetailModalBtn?.addEventListener('click', () => {
        detailModal.classList.remove('show');
    });
    detailModal?.addEventListener('click', (e) => {
        if (e.target === detailModal) detailModal.classList.remove('show');
    });
    
    // Tombol Hapus di Modal Detail
    deleteNoteBtn?.addEventListener('click', async () => {
        const noteId = deleteNoteBtn.dataset.id;
        const confirmed = await showConfirmation(
            'Konfirmasi Hapus', 
            'Anda yakin ingin menghapus catatan ini? Aksi ini tidak dapat dibatalkan.', 
            'Ya, Hapus'
        );
        
        if (confirmed) {
            try {
                await pembimbingModel.deleteNote(noteId);
                allNotes = allNotes.filter(n => n.id != noteId); // Hapus dari state
                renderNoteCards(allNotes); // Render ulang
                detailModal.classList.remove('show');
                window.showToast('Catatan berhasil dihapus.', 'success');
            } catch (error) {
                window.showToast(`Gagal menghapus: ${error.message}`, 'error');
            }
        }
    });

    // --- Muat Data Awal ---
    loadNotes();
}
