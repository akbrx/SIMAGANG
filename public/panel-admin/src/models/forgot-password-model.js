/**
 * @file Model untuk Lupa Password Admin.
 */

// Fungsi publicFetch (asumsikan sudah ada di file terpisah atau definisikan di sini)
async function publicFetch(url, options = {}) { /* ... (kode publicFetch dari reset-password-model.js) ... */ }

/**
 * Mengirim permintaan link reset password ke backend.
 * @param {string} email - Email admin.
 * @returns {Promise<Object>} Respons sukses dari server.
 */
export async function requestResetLink(email) {
    // --- PASTIKAN URL INI SESUAI DENGAN ENDPOINT BACKEND ANDA ---
    const url = '/api/admin/forgot-password'; // Endpoint dari AuthController

    return await publicFetch(url, {
        method: 'POST',
        body: JSON.stringify({ email: email })
    });
}
