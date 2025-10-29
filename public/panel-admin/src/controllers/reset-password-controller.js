/**
 * @file Controller untuk Halaman Reset Password Admin.
 */

import * as resetPasswordModel from '../models/reset-password-model.js';

// Asumsikan showToast ada secara global atau diimpor

export async function init() {
    const form = document.getElementById('reset-password-form');
    const tokenInput = document.getElementById('reset-token');
    const emailInput = document.getElementById('reset-email'); // [BARU] Seleksi input email
    const newPasswordInput = document.getElementById('new-password');
    const newPasswordConfirmInput = document.getElementById('new-password-confirm');
    const errorMsgElement = document.getElementById('reset-error-message');
    const successMsgElement = document.getElementById('reset-success-message');
    const submitButton = form?.querySelector('.btn-login');

    if (!form || !tokenInput || !emailInput || !submitButton) { // Tambahkan emailInput
        console.error("Elemen form reset password tidak ditemukan.");
        return;
    }

    // --- 1. Ekstrak Token dan Email dari URL Hash ---
    let token = '';
    let email = ''; // [BARU] Variabel untuk email
    const hash = window.location.hash; 
    const params = new URLSearchParams(hash.substring(hash.indexOf('?') + 1));
    token = params.get('token');
    email = params.get('email'); // [BARU] Ambil email dari URL

    if (!token || !email) { // [PERUBAHAN] Cek token dan email
        errorMsgElement.textContent = "Token atau email reset password tidak valid.";
        errorMsgElement.style.display = 'block';
        submitButton.disabled = true; 
        return;
    }
    tokenInput.value = token; 
    emailInput.value = email; // [BARU] Simpan email di input hidden

    // --- 2. Tambahkan Event Listener untuk Submit Form ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPassword = newPasswordInput.value;
        const newPasswordConfirm = newPasswordConfirmInput.value;

        if (newPassword !== newPasswordConfirm) { /* ... (validasi tetap sama) ... */ return; }
        if (newPassword.length < 8) { /* ... (validasi tetap sama) ... */ return; }

        // UI Loading
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        errorMsgElement.style.display = 'none';
        successMsgElement.style.display = 'none';

        try {
            // [PERUBAHAN] Panggil model dengan token dan email
            const result = await resetPasswordModel.resetPassword(token, email, newPassword, newPasswordConfirm);

            successMsgElement.textContent = result.message || 'Password berhasil diubah! Mengarahkan ke halaman login...';
            successMsgElement.style.display = 'block';
            
            setTimeout(() => { window.location.hash = '#login'; }, 3000); 

        } catch (error) {
            errorMsgElement.textContent = error.message || "Terjadi kesalahan.";
            errorMsgElement.style.display = 'block';
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    });
}

