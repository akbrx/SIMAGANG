/**
 * @file Controller untuk Halaman Pembimbing.
 * Mengelola logika filter, CRUD catatan, dan modal terpisah (Add/Edit).
 */

import * as pembimbingModel from '../models/pembimbing-model.js';
import { showConfirmation } from '../app.js'; 

// Asumsikan showToast ada secara global (window.showToast)
// function showToast(message, type = 'success') { ... }

export async function init() {
    // --- Seleksi Elemen ---
    const grid = document.getElementById('pembimbing-grid');
    const addBtn = document.getElementById('pembimbing-add-btn');
    const searchInput = document.getElementById('pembimbing-search');
    const welcomeName = document.getElementById('pembimbing-name');
    const logoutBtn = document.getElementById('pembimbing-logout-btn');

    // Modal Tambah
    const addModal = document.getElementById('pembimbing-add-modal');
    const addForm = document.getElementById('add-note-form');
    const closeAddModalBtn = document.getElementById('close-add-modal-btn');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const addNoteError = document.getElementById('add-note-error');

    // Modal Edit/Lihat
    const editModal = document.getElementById('pembimbing-edit-modal');
    const editForm = document.getElementById('edit-note-form');
    const closeEditModalBtn = document.getElementById('close-edit-modal-btn');
    const editNoteId = document.getElementById('edit-note-id');
    const editStudentName = document.getElementById('edit-student-name');
    const editDispositionPreview = document.getElementById('edit-disposition-preview');
    const editNotes = document.getElementById('edit-notes');
    const editSaveBtn = document.getElementById('edit-save-btn');
    const editDeleteBtn = document.getElementById('edit-delete-btn');
    const editNoteError = document.getElementById('edit-note-error');

    // Modal Lightbox
    const lightbox = document.getElementById('image-lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-image');
    const closeLightboxBtn = document.querySelector('.lightbox-close-btn');

    let allNotes = []; // State lokal
    let currentEditId = null;

    // --- Fungsi Helper ---
    function setLoading(button, isLoading) {
        if (!button) return;
        button.disabled = isLoading;
        button.classList.toggle('loading', isLoading);
    }
    
    // Render ulang kartu di grid
    function renderNoteCards(notesToRender) {
        if (!grid) return;
        if (notesToRender.length === 0 && allNotes.length > 0) {
            grid.innerHTML = `<p class="info-message">Tidak ada catatan yang cocok dengan pencarian Anda.</p>`; return;
        }
        if (allNotes.length === 0) {
             grid.innerHTML = `<p class="info-message">Anda belum memiliki catatan. Klik tombol (+) untuk menambah.</p>`; return;
        }
        grid.innerHTML = notesToRender.map(note => `
            <div class="note-card" data-id="${note.id}" role="button" tabindex="0">
                <div class="note-card-header"><i class="fas fa-user-graduate"></i><h4 class="note-student-name">${note.student_name}</h4></div>
                <div class="note-card-body">
                    <img src="${note.disposition_file_url}" alt="Foto Lembar Disposisi" class="note-disposition-preview" loading="lazy">
                    <p class="note-excerpt">${note.notes ? note.notes.substring(0, 100) + '...' : '<i>Tidak ada catatan.</i>'}</p>
                </div>
                <div class="note-card-footer"><span>Dibuat: ${new Date(note.created_at).toLocaleDateString('id-ID')}</span></div>
            </div>
        `).join('');
    }

    // Fungsi filter
    function applyFilters() {
        if (!searchInput) return; // Pengaman jika elemen filter tidak ada
        const searchTerm = searchInput.value.toLowerCase();
        if (!searchTerm) {
            renderNoteCards(allNotes);
            return;
        }
        const filteredNotes = allNotes.filter(note => 
            note.student_name.toLowerCase().includes(searchTerm)
        );
        renderNoteCards(filteredNotes);
    }
    
    // Membuka modal (HANYA UNTUK TAMBAH)
    function openAddModal() {
        addForm.reset();
        addNoteError.style.display = 'none';
        addModal.classList.add('show');
    }
    
    // Membuka modal (HANYA UNTUK EDIT/LIHAT)
    function openEditModal(note) {
        editForm.reset();
        editNoteError.style.display = 'none';
        
        currentEditId = note.id;
        editNoteId.value = note.id;
        editStudentName.value = note.student_name;
        editDispositionPreview.src = note.disposition_file_url;
        editNotes.value = note.notes || '';
        editDeleteBtn.dataset.id = note.id;
        
        editModal.classList.add('show');
    }

    // --- Inisialisasi Data ---
    async function loadPage() {
        try {
            if (grid) grid.innerHTML = `<p class="info-message">Memuat catatan...</p>`;
            // 1. Set nama pembimbing
            const adminName = localStorage.getItem('adminName');
            if (welcomeName) welcomeName.textContent = adminName || 'Pembimbing';
            
            // 2. Ambil data catatan
            allNotes = await pembimbingModel.getNotes();
            renderNoteCards(allNotes);
        } catch (error) {
            if (grid) grid.innerHTML = `<p class="info-message error">Gagal memuat catatan: ${error.message}</p>`;
        }
    }

    // --- Event Listeners ---
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminName');
        localStorage.removeItem('adminRole');
        window.location.hash = '#login';
    });
    
    // [PERBAIKAN] Pastikan memanggil openAddModal (bukan openNoteModal)
    addBtn?.addEventListener('click', openAddModal); // Tombol Tambah
    
    searchInput?.addEventListener('input', applyFilters); // Filter pencarian

    // Klik pada Kartu di Grid (Membuka Edit)
    grid?.addEventListener('click', (e) => {
        const card = e.target.closest('.note-card');
        if (card) {
            const noteId = card.dataset.id;
            const note = allNotes.find(n => n.id == noteId);
            if (note) openEditModal(note);
        }
    });

    // Tombol Tutup Modal Tambah
    closeAddModalBtn?.addEventListener('click', () => addModal.classList.remove('show'));
    addModal?.addEventListener('click', (e) => { if (e.target === addModal) addModal.classList.remove('show'); });

    // Tombol Tutup Modal Edit
    closeEditModalBtn?.addEventListener('click', () => editModal.classList.remove('show'));
    editModal?.addEventListener('click', (e) => { if (e.target === editModal) editModal.classList.remove('show'); });
    
    // Submit Form TAMBAH Catatan
    addForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        setLoading(saveNoteBtn, true);
        addNoteError.style.display = 'none';

        const formData = new FormData();
        formData.append('student_name', addForm.querySelector('#student-name').value);
        formData.append('notes', addForm.querySelector('#notes').value);
        const fileInputAdd = addForm.querySelector('#disposition-file');
        
        if (fileInputAdd.files.length === 0) {
            addNoteError.textContent = 'Foto lembar disposisi wajib di-upload.';
            addNoteError.style.display = 'block';
            setLoading(saveNoteBtn, false);
            return;
        }
        formData.append('disposition_file', fileInputAdd.files[0]);

        try {
            const newNote = await pembimbingModel.createNote(formData);
            allNotes.push(newNote);
            applyFilters();
            addModal.classList.remove('show');
            window.showToast('Catatan berhasil disimpan!', 'success');
        } catch (error) {
            addNoteError.textContent = error.message;
            addNoteError.style.display = 'block';
        } finally {
            setLoading(saveNoteBtn, false);
        }
    });
    
    // Submit Form EDIT Catatan
    editForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        setLoading(editSaveBtn, true);
        editNoteError.style.display = 'none';
        
        const notes = editNotes.value;
        
        try {
            const updatedNote = await pembimbingModel.updateNote(currentEditId, notes);
            const index = allNotes.findIndex(n => n.id == currentEditId);
            if (index !== -1) allNotes[index] = updatedNote.data;
            applyFilters();
            editModal.classList.remove('show');
            window.showToast('Catatan berhasil diperbarui!', 'success');
        } catch (error) {
            editNoteError.textContent = error.message;
            editNoteError.style.display = 'block';
        } finally {
            setLoading(editSaveBtn, false);
        }
    });
    
    // Tombol Hapus di Modal Edit
    editDeleteBtn?.addEventListener('click', async () => {
        const noteId = editDeleteBtn.dataset.id;
        const confirmed = await showConfirmation('Hapus Catatan?', 'Anda yakin ingin menghapus catatan ini?', 'Ya, Hapus');
        if (confirmed) {
            try {
                await pembimbingModel.deleteNote(noteId);
                allNotes = allNotes.filter(n => n.id != noteId);
                applyFilters();
                editModal.classList.remove('show');
                window.showToast('Catatan berhasil dihapus.', 'success');
            } catch (error) { window.showToast(`Gagal menghapus: ${error.message}`, 'error'); }
        }
    });
    
    // Lightbox Handler
    editDispositionPreview?.addEventListener('click', () => {
        lightboxImg.src = editDispositionPreview.src;
        lightbox.classList.add('show');
    });
    closeLightboxBtn?.addEventListener('click', () => lightbox.classList.remove('show'));
    lightbox?.addEventListener('click', () => lightbox.classList.remove('show'));

    // --- Muat Data Awal ---
    loadPage();
}