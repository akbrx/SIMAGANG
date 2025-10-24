/**
 * @file Model untuk Halaman Pengaturan.
 * Mengelola pengambilan dan penyimpanan data profil admin & pemilihan kontak utama.
 */

// --- Fungsi Helper untuk Fetch ---
async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('authToken');
    if (!token) { window.location.hash = '#login'; throw new Error('Token otentikasi tidak ditemukan.'); }
    const defaultHeaders = { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` };
    if (options.method === 'POST' || options.method === 'PUT') { defaultHeaders['Content-Type'] = 'application/json'; }
    const config = { ...options, headers: { ...defaultHeaders, ...options.headers } };
    try {
        const response = await fetch(url, config);
        if (response.status === 401) { window.location.hash = '#login'; throw new Error('Sesi tidak valid.'); }
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
            throw new Error(errorData.message || `Gagal ${options.method || 'GET'} ${url}`);
        }
        if (response.status === 204 || response.headers.get('content-length') === '0') { return { success: true, message: 'Operasi berhasil.' }; }
        return await response.json();
    } catch (error) { console.error(`Error during fetch ${url}:`, error); throw error; }
}

// --- [DIHAPUS] Pengaturan Kontak Widget (Fungsi lama dihapus) ---
// async function getSelectedContactAdminId() { ... }
// async function updateSelectedContactAdmin(adminId) { ... }

// --- Daftar Administrator ---
/**
 * Mengambil daftar semua admin (untuk dropdown).
 * @returns {Promise<Array>} Array objek admin {id, nama, phone_number, is_primary_contact}.
 */
export async function getAllAdministrators() {
    const url = 'http://localhost:8000/api/admin/administrators';
    const responseData = await authenticatedFetch(url);
    return responseData.data || [];
}

/**
 * [BARU] Menetapkan admin yang dipilih sebagai kontak utama.
 * @param {number} adminId - ID admin yang akan dijadikan kontak utama.
 * @returns {Promise<Object>} Respons sukses dari server.
 */
export async function setPrimaryContactAdmin(adminId) {
    const url = `http://localhost:8000/api/admin/administrators/${adminId}/set-primary-contact`;
    return await authenticatedFetch(url, {
        method: 'PUT',
        // Tidak perlu body karena ID sudah ada di URL
    });
}


// --- Profil Admin Saat Ini ---
/**
 * Mengambil detail profil admin yang sedang login.
 */
export async function getCurrentAdminProfile() {
    const url = 'http://localhost:8000/api/admin/profile';
    const responseData = await authenticatedFetch(url);
    return responseData.data || {};
}
/**
 * Memperbarui profil (nama, no. telepon) admin yang sedang login.
 */
export async function updateCurrentAdminProfile(name, phoneNumber) {
    const url = 'http://localhost:8000/api/admin/profile';
    return await authenticatedFetch(url, {
        method: 'PUT',
        body: JSON.stringify({ nama: name, phone_number: phoneNumber })
    });
}
/**
 * Memperbarui password admin yang sedang login.
 */
export async function updateCurrentAdminPassword(currentPassword, newPassword, newPasswordConfirm) {
    const url = 'http://localhost:8000/api/admin/profile/password';
    return await authenticatedFetch(url, {
        method: 'PUT',
        body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirm
        })
    });
}

