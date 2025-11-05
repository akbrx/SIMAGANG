/**
 * @file Model untuk Halaman Pembimbing.
 * Mengelola data catatan magang.
 */

// --- Fungsi Helper untuk Fetch ---
async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('authToken');
    if (!token) { window.location.hash = '#login'; throw new Error('Token otentikasi tidak ditemukan.'); }
    
    const defaultHeaders = { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` };
    if (options.method === 'POST' || options.method === 'PUT') {
        // Hanya set Content-Type jika BUKAN FormData
        if (!(options.body instanceof FormData)) {
            defaultHeaders['Content-Type'] = 'application/json';
        }
    }

    const config = { ...options, headers: { ...defaultHeaders, ...options.headers } };

    try {
        const response = await fetch(url, config);
        if (response.status === 401) { window.location.hash = '#login'; throw new Error('Sesi tidak valid.'); }
        
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || `Gagal ${options.method || 'GET'} ${url}`);
        }
        return responseData;
    } catch (error) { console.error(`Error during fetch ${url}:`, error); throw error; }
}

const API_BASE_URL = '/api/admin/mentor-notes';

/**
 * Mengambil semua catatan untuk pembimbing yang login.
 */
export async function getNotes() {
    const responseData = await authenticatedFetch(API_BASE_URL);
    return responseData.data || [];
}

/**
 * Membuat catatan baru (termasuk upload file).
 */
export async function createNote(formData) {
    const responseData = await authenticatedFetch(API_BASE_URL, {
        method: 'POST',
        body: formData
    });
    return responseData.data;
}

/**
 * [PERUBAHAN] Memperbarui HANYA catatan.
 * @param {number} id - ID catatan yang akan diupdate.
 * @param {string} notes - Teks catatan yang baru.
 * @returns {Promise<Object>} Data catatan yang telah diperbarui.
 */
export async function updateNote(id, notes) {
    return await authenticatedFetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ notes: notes }) // Kirim hanya notes
    });
}

/**
 * Menghapus catatan.
 */
export async function deleteNote(id) {
    return await authenticatedFetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
    });
}