/**
 * @file Controller untuk Halaman Lupa Password (Input Email).
 */

import * as forgotPasswordModel from '../models/forgot-password-model.js';

// Asumsikan showToast ada secara global atau diimpor
// import { showToast } from '../app.js'; 

export async function init() {
    const form = document.getElementById('forgot-password-form');
    const emailInput = document.getElementById('email');
    const errorMsgElement = document.getElementById('forgot-error-message');
    const successMsgElement = document.getElementById('forgot-success-message');
    const submitButton = form?.querySelector('.btn-login');

    if (!form || !submitButton) {
        console.error("Elemen form lupa password tidak ditemukan.");
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value;

        if (!email) {
            errorMsgElement.textContent = "Alamat email wajib diisi.";
            errorMsgElement.style.display = 'block';
            return;
        }

        // UI Loading
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        errorMsgElement.style.display = 'none';
        successMsgElement.style.display = 'none';

        try {
            const result = await forgotPasswordModel.requestResetLink(email);

            // [PERBAIKAN] Penanganan pesan sukses yang lebih aman
            // Gunakan optional chaining pada result juga
            const successMessageText = result?.message || 'Link reset password telah dikirim! Silakan periksa email Anda.';
            successMsgElement.textContent = successMessageText;
            successMsgElement.style.display = 'block';
            form.reset(); 

        } catch (error) {
            // Penanganan error yang lebih aman (sudah diperbaiki sebelumnya)
            console.error("Error saat mengirim link reset:", error); 
            const errorMessageText = error?.message || "Terjadi kesalahan yang tidak diketahui. Silakan coba lagi nanti.";
            errorMsgElement.textContent = errorMessageText;
            errorMsgElement.style.display = 'block';

        } finally {
             // Kembalikan UI
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    });
}

