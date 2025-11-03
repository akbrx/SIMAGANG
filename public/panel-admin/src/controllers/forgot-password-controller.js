/**
 * @file Controller untuk Halaman Lupa Password (Input Email).
 */

import * as forgotPasswordModel from '../models/forgot-password-model.js';

export async function init() {
    console.log("[DEBUG] ForgotPasswordController init() dijalankan."); // DEBUG 1

    const form = document.getElementById('forgot-password-form');
    const emailInput = document.getElementById('email');
    const errorMsgElement = document.getElementById('forgot-error-message');
    const successMsgElement = document.getElementById('forgot-success-message');
    const submitButton = form?.querySelector('.btn-login');

    if (!form || !submitButton) {
        console.error("[DEBUG] Elemen form lupa password (#forgot-password-form) tidak ditemukan.");
        return;
    }
    console.log("[DEBUG] Form lupa password ditemukan."); // DEBUG 2

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("[DEBUG] Form lupa password disubmit."); // DEBUG 3

        const email = emailInput.value;

        if (!email) {
            errorMsgElement.textContent = "Alamat email wajib diisi.";
            errorMsgElement.style.display = 'block';
            return;
        }

        submitButton.disabled = true;
        submitButton.classList.add('loading');
        errorMsgElement.style.display = 'none';
        successMsgElement.style.display = 'none';

        try {
            console.log(`[DEBUG] Memanggil model requestResetLink dengan email: ${email}`); // DEBUG 4
            const result = await forgotPasswordModel.requestResetLink(email);
            
            console.log("[DEBUG] Panggilan model SUKSES. Respons:", result); // DEBUG 5
            const successMessageText = result?.message || 'Link reset password telah dikirim! Silakan periksa email Anda.';
            successMsgElement.textContent = successMessageText;
            successMsgElement.style.display = 'block';
            form.reset(); 

        } catch (error) {
            console.error("[DEBUG] Panggilan model GAGAL. Error:", error); // DEBUG 6
            const errorMessageText = error?.message || "Terjadi kesalahan yang tidak diketahui. Silakan coba lagi nanti.";
            errorMsgElement.textContent = errorMessageText;
            errorMsgElement.style.display = 'block';

        } finally {
            console.log("[DEBUG] Blok 'finally' dieksekusi, mengembalikan tombol."); // DEBUG 7
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    });
}

