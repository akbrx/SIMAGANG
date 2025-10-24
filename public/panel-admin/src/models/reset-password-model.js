/**
 * @file Model untuk Reset Password Admin.
 */

// --- Fungsi Helper untuk Fetch (Bisa dipindahkan ke file utilitas nanti) ---
async function publicFetch(url, options = {}) {
    const defaultHeaders = { 'Accept': 'application/json' };
    if (options.method === 'POST' || options.method === 'PUT') {
        defaultHeaders['Content-Type'] = 'application/json';
    }
    const config = { ...options, headers: { ...defaultHeaders, ...options.headers } };
    try {
        const response = await fetch(url, config);
        const responseData = await response.json(); // Selalu coba baca JSON
        if (!response.ok) {
            // Gunakan pesan error dari backend jika ada, jika tidak gunakan pesan default
            throw new Error(responseData.message || `Gagal ${options.method || 'GET'} ${url}. Status: ${response.status}`);
        }
        return responseData;
    } catch (error) {
        console.error(`Error during fetch ${url}:`, error);
        // Pastikan error message diteruskan dengan benar
        throw new Error(error.message || `Terjadi kesalahan jaringan saat mengakses ${url}`);
    }
}


/**
 * Mengirim permintaan reset password ke backend.
 * @param {string} token - Token reset password dari URL.
 * @param {string} newPassword - Password baru.
 * @param {string} newPasswordConfirm - Konfirmasi password baru.
 * @returns {Promise<Object>} Respons sukses dari server.
 */
export async function resetPassword(token, newPassword, newPasswordConfirm) {
    // --- PASTIKAN URL INI SESUAI DENGAN ENDPOINT BACKEND ANDA ---
    const url = '/api/admin/reset-password'; // Contoh URL

    return await publicFetch(url, {
        method: 'POST', // Sesuaikan method jika backend menggunakan PUT
        body: JSON.stringify({
            token: token,
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirm
        })
    });
}
