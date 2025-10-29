/**
 * @file Model untuk Reset Password Admin.
 */

// Fungsi publicFetch (asumsikan sudah ada)
async function publicFetch(url, options = {}) { /* ... */ }

/**
 * Mengirim permintaan reset password ke backend.
 * @param {string} token - Token reset password dari URL.
 * @param {string} email - Email admin dari URL. [BARU]
 * @param {string} newPassword - Password baru.
 * @param {string} newPasswordConfirm - Konfirmasi password baru.
 * @returns {Promise<Object>} Respons sukses dari server.
 */
export async function resetPassword(token, email, newPassword, newPasswordConfirm) { // Tambah parameter email
    const url = '/api/admin/reset-password'; 

    return await publicFetch(url, {
        method: 'POST', 
        body: JSON.stringify({
            token: token,
            email: email, // [BARU] Kirim email ke backend
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirm
        })
    });
}

