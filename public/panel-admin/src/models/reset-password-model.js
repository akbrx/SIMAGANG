/**
 * @file Model untuk Reset Password Admin.
 */

/**
 * [PERBAIKAN] Fungsi fetch yang lebih robust untuk menangani respons publik.
 * Fungsi ini akan melempar (throw) error jika respons server BUKAN 'ok' (bukan 2xx).
 */
async function publicFetch(url, options = {}) {
    const defaultHeaders = { 'Accept': 'application/json' };
    if (options.method === 'POST' || options.method === 'PUT') {
        defaultHeaders['Content-Type'] = 'application/json';
    }
    const config = { ...options, headers: { ...defaultHeaders, ...options.headers } };

    try {
        const response = await fetch(url, config);
        const responseData = await response.json(); 
        if (!response.ok) {
            let errorMessage = responseData.message || 'Terjadi kesalahan server.';
            
            if (responseData.errors) {
                const errorKey = Object.keys(responseData.errors)[0];
                errorMessage = responseData.errors[errorKey][0];
            }
            
            throw new Error(errorMessage);
        }
        return responseData; 

    } catch (error) {
        throw error; 
    }
}


/**
 * Mengirim permintaan reset password ke backend.
 * @param {string} token - Token reset password dari URL.
 * @param {string} email - Email admin dari URL.
 * @param {string} newPassword - Password baru.
 * @param {string} newPasswordConfirm - Konfirmasi password baru.
 * @returns {Promise<Object>} Respons sukses dari server.
 */
export async function resetPassword(token, email, newPassword, newPasswordConfirm) {
    const url = '/api/admin/reset-password'; 

    return await publicFetch(url, {
        method: 'POST', 
        body: JSON.stringify({
            token: token,
            email: email,
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirm 
        })
    });
}

