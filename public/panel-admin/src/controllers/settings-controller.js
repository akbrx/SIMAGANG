/**
 * @file Controller untuk Halaman Pengaturan.
 * Mengelola pengambilan data, pengisian form, dan submit form.
 */

import * as settingsModel from '../models/settings-model.js';
// Impor showToast dari surat-controller (atau pindahkan ke file utilitas jika perlu)
// import { showToast } from './surat-controller.js'; // Pastikan showToast ada atau definisikan di sini

// Definisikan showToast di sini jika belum ada secara global
function showToast(message, type = 'success') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        Object.assign(toastContainer.style, {
            position: 'fixed', top: '20px', right: '20px', zIndex: '9999',
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px'
        });
        document.body.appendChild(toastContainer);
    }
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`; 
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
    }, 4000);
}


export async function init() {
    console.log("Settings Controller init started.");
    // --- Seleksi Elemen ---
    const contactWidgetForm = document.getElementById('contact-widget-form');
    const contactAdminSelect = document.getElementById('contact-admin-select');
    const contactWidgetSaveBtn = contactWidgetForm?.querySelector('.btn-save');
    const contactWidgetMessage = document.getElementById('contact-widget-message');
    const profileForm = document.getElementById('profile-form');
    const profileNameInput = document.getElementById('profile-name');
    const profilePhoneInput = document.getElementById('profile-phone');
    const profileSaveBtn = profileForm?.querySelector('.btn-save');
    const profileMessage = document.getElementById('profile-message');
    const passwordForm = document.getElementById('password-form');
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const newPasswordConfirmInput = document.getElementById('new-password-confirm');
    const passwordSaveBtn = passwordForm?.querySelector('.btn-save');
    const passwordMessage = document.getElementById('password-message');

    // [DEBUG LOG 2] Periksa apakah elemen form password ditemukan
    if (!passwordForm) {
        console.error("ERROR: Password form (#password-form) not found!");
    } else {
         console.log("Password form (#password-form) found.");
    }
    if (!passwordSaveBtn) {
        console.error("ERROR: Save password button (.btn-save inside password form) not found!");
         // Coba seleksi yang lebih spesifik jika perlu
         // const specificPasswordSaveBtn = passwordForm.querySelector('.btn-save');
         // if (!specificPasswordSaveBtn) console.error("Specific password save button not found either!");
    } else {
        console.log("Save password button found.");
    }

    // --- Fungsi Helper ---
    function setLoading(button, isLoading) { /* ... */ }
    function showMessage(element, message, isError = false) { /* ... */ }

    // --- Inisialisasi Data & Populate Form ---
    async function initializePage() {
        try {
            // [PERUBAHAN] Ambil semua admin dan profil saat ini
            const [admins, currentProfile] = await Promise.all([
                settingsModel.getAllAdministrators(),
                settingsModel.getCurrentAdminProfile()
            ]);

            // [PERUBAHAN] Cari ID admin utama dari daftar
            const primaryAdmin = admins.find(admin => admin.is_primary_contact === true);
            const selectedAdminId = primaryAdmin ? primaryAdmin.id : null;

            // Populate dropdown admin kontak
            if (contactAdminSelect) {
                contactAdminSelect.innerHTML = '<option value="">-- Pilih Admin --</option>'; 
                admins.forEach(admin => {
                    // Hanya tampilkan admin yang punya nomor telepon
                    if (admin.phone_number) { 
                        contactAdminSelect.innerHTML += `
                            <option value="${admin.id}" ${admin.id === selectedAdminId ? 'selected' : ''}>
                                ${admin.nama} (${admin.phone_number})
                            </option>`;
                    } else {
                         // Opsi admin tanpa nomor telepon (disabled)
                         contactAdminSelect.innerHTML += `
                            <option value="${admin.id}" disabled>
                                ${admin.nama} (Tidak ada No. HP)
                            </option>`;
                    }
                });
            }

            // Populate form edit profil
            if (profileNameInput) profileNameInput.value = currentProfile.nama || '';
            if (profilePhoneInput) profilePhoneInput.value = currentProfile.phone_number || '';

        } catch (error) {
            showToast(`Gagal memuat data pengaturan: ${error.message}`, 'error');
        }
    }

    // --- Event Listeners ---

    // [PERUBAHAN] Simpan Kontak Widget (panggil endpoint baru)
    contactWidgetForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedId = contactAdminSelect.value;
        if (!selectedId) {
            showMessage(contactWidgetMessage, 'Silakan pilih admin terlebih dahulu.', true);
            return;
        }
        
        // Cek apakah admin yang dipilih punya nomor telepon (opsional, tapi bagus)
        const selectedAdminOption = contactAdminSelect.options[contactAdminSelect.selectedIndex];
        if (selectedAdminOption.disabled) {
             showMessage(contactWidgetMessage, 'Admin yang dipilih tidak memiliki nomor telepon.', true);
             return;
        }

        setLoading(contactWidgetSaveBtn, true);
        try {
            await settingsModel.setPrimaryContactAdmin(parseInt(selectedId)); // Panggil fungsi model baru
            showToast('Admin kontak widget berhasil disimpan!', 'success');
            // Reload data agar status is_primary_contact terupdate di UI (opsional)
            await initializePage(); 
        } catch (error) { showToast(`Gagal menyimpan: ${error.message}`, 'error'); } 
        finally { setLoading(contactWidgetSaveBtn, false); }
    });

    // Simpan Profil (sedikit modifikasi untuk reload setelah update)
    profileForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = profileNameInput.value;
        const phone = profilePhoneInput.value;
        setLoading(profileSaveBtn, true);
        try {
            await settingsModel.updateCurrentAdminProfile(name, phone);
            showToast('Profil berhasil diperbarui!', 'success');
            const profileNameSpan = document.querySelector('.profile-name');
            if (profileNameSpan) profileNameSpan.textContent = name;
            await initializePage(); // Reload data untuk update dropdown kontak
        } catch (error) { showToast(`Gagal menyimpan profil: ${error.message}`, 'error'); } 
        finally { setLoading(profileSaveBtn, false); }
    });

    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Password form submitted!"); // Cek apakah event ini terpanggil

            const currentPassword = currentPasswordInput.value;
            const newPassword = newPasswordInput.value;
            const newPasswordConfirm = newPasswordConfirmInput.value;

            if (newPassword !== newPasswordConfirm) {
                showMessage(passwordMessage, 'Konfirmasi password baru tidak cocok.', true);
                return;
            }

            console.log("Setting loading state for button:", passwordSaveBtn);
            setLoading(passwordSaveBtn, true);
            showMessage(passwordMessage, '', false);

            try {
                console.log("Calling updateCurrentAdminPassword model function...");
                await settingsModel.updateCurrentAdminPassword(currentPassword, newPassword, newPasswordConfirm);
                console.log("Password update successful.");
                showToast('Password berhasil diubah!', 'success');
                passwordForm.reset();
            } catch (error) {
                console.error("Password update failed:", error);
                showToast(`Gagal mengubah password: ${error.message}`, 'error');
                showMessage(passwordMessage, `Gagal: ${error.message}`, true);
            }
            finally {
                console.log("Removing loading state.");
                setLoading(passwordSaveBtn, false);
            }
        });
        console.log("Event listener for password form attached.");
    } else {
        console.error("Could not attach event listener because password form was not found.");
    }


    // --- Panggil Inisialisasi ---
    console.log("Calling initializePage...");
    initializePage();
    console.log("Settings Controller init finished.");
}
