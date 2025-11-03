/**
 * @file Model untuk Lupa Password Admin.
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
        console.error(`[DEBUG Model] Error di dalam publicFetch:`, error);
        throw error; 
    }
}


/**
 * Mengirim permintaan link reset password ke backend.
 * @param {string} email - Email admin.
 * @returns {Promise<Object>} Respons sukses dari server.
 */
export async function requestResetLink(email) {
    const url = '/api/admin/forgot-password'; 

    return await publicFetch(url, {
        method: 'POST',
        body: JSON.stringify({ email: email })
    });
}

