/**
 * @file Controller untuk Halaman Reset Password Admin.
 */

import * as resetPasswordModel from '../models/reset-password-model.js';

// Asumsikan showToast ada secara global atau diimpor
// import { showToast } from '../app.js'; // Jika diletakkan di app.js
// Jika tidak, definisikan atau impor dari lokasi yang benar

export async function init() {
    const form = document.getElementById('reset-password-form');
    const tokenInput = document.getElementById('reset-token');
    const newPasswordInput = document.getElementById('new-password');
    const newPasswordConfirmInput = document.getElementById('new-password-confirm');
    const errorMsgElement = document.getElementById('reset-error-message');
    const successMsgElement = document.getElementById('reset-success-message');
    const submitButton = form?.querySelector('.btn-login');

    if (!form || !tokenInput || !submitButton) {
        console.error("Elemen form reset password tidak ditemukan.");
        return;
    }

    // --- 1. Ekstrak Token dari URL Hash ---
    let token = '';
    const hash = window.location.hash; // Contoh: #reset-password?token=abcdef12345
    const params = new URLSearchParams(hash.substring(hash.indexOf('?') + 1));
    token = params.get('token');

    if (!token) {
        errorMsgElement.textContent = "Token reset password tidak valid atau tidak ditemukan.";
        errorMsgElement.style.display = 'block';
        submitButton.disabled = true; // Nonaktifkan tombol jika tidak ada token
        return;
    }
    tokenInput.value = token; // Simpan token di input tersembunyi (opsional)

    // --- 2. Tambahkan Event Listener untuk Submit Form ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newPassword = newPasswordInput.value;
        const newPasswordConfirm = newPasswordConfirmInput.value;

        // Validasi frontend sederhana
        if (newPassword !== newPasswordConfirm) {
            errorMsgElement.textContent = "Konfirmasi password baru tidak cocok.";
            errorMsgElement.style.display = 'block';
            return;
        }
        if (newPassword.length < 8) {
            errorMsgElement.textContent = "Password baru minimal harus 8 karakter.";
            errorMsgElement.style.display = 'block';
            return;
        }

        // UI Loading
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        errorMsgElement.style.display = 'none';
        successMsgElement.style.display = 'none';

        try {
            // Panggil model untuk mengirim data ke backend
            const result = await resetPasswordModel.resetPassword(token, newPassword, newPasswordConfirm);

            // Tampilkan pesan sukses dan redirect
            successMsgElement.textContent = result.message || 'Password berhasil diubah! Mengarahkan ke halaman login...';
            successMsgElement.style.display = 'block';
            // showToast(result.message || 'Password berhasil diubah!', 'success'); // Alternatif dengan toast

            // Redirect ke halaman login setelah beberapa detik
            setTimeout(() => {
                window.location.hash = '#login';
            }, 3000); // Tunggu 3 detik

        } catch (error) {
            // Tampilkan error dari backend atau error jaringan
            errorMsgElement.textContent = error.message || "Terjadi kesalahan saat mengatur ulang password.";
            errorMsgElement.style.display = 'block';
            // showToast(error.message || "Terjadi kesalahan.", 'error'); // Alternatif dengan toast

            // Kembalikan UI
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    });
}
