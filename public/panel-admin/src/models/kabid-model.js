/**
 * @file Model untuk Halaman Kabid.
 * Mengelola data surat untuk Kabid.
 */

// --- Fungsi Helper untuk Fetch ---
async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('authToken');
    if (!token) { 
        // Izinkan akses jika kita sedang testing tanpa login (sesuai logika controller)
        // Namun, untuk API call sungguhan, kita harus mengandalkan token.
        // Jika token tidak ada di state non-testing, alihkan ke login.
        if (!window.location.hash.includes("#kabid")) { // Cek agar tidak loop redirect
             window.location.hash = '#login'; 
        }
        throw new Error('Token otentikasi tidak ditemukan.'); 
    }
    
    const defaultHeaders = { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` };
    
    // Jangan set Content-Type jika mengirim FormData (misal: upload file)
    if (options.method === 'POST' || options.method === 'PUT') {
        if (!(options.body instanceof FormData)) {
            defaultHeaders['Content-Type'] = 'application/json';
        }
    }

    const config = { ...options, headers: { ...defaultHeaders, ...options.headers } };

    try {
        const response = await fetch(url, config);
        
        if (response.status === 401) { 
            localStorage.removeItem('authToken');
            localStorage.removeItem('adminName');
            localStorage.removeItem('adminRole');
            window.location.hash = '#login'; 
            throw new Error('Sesi tidak valid atau telah kedaluwarsa.'); 
        }
        
        const responseData = await response.json();
        
        if (!response.ok) {
            let errorMessage = responseData.message || `Gagal ${options.method || 'GET'} ${url}`;
            if (responseData.errors) {
                const errorKey = Object.keys(responseData.errors)[0];
                errorMessage = responseData.errors[errorKey][0];
            }
            throw new Error(errorMessage);
        }
        return responseData;
    } catch (error) { 
        console.error(`Error during fetch ${url}:`, error); 
        throw error; 
    }
}

const API_BASE_URL = 'http://localhost:8000/api/admin/pengajuan';

/**
 * Mengambil semua data pengajuan dari server.
 * Controller akan memfilter ini.
 */
export async function getAllSubmissions() {
    const responseData = await authenticatedFetch(API_BASE_URL);
    return responseData.data.data || []; 
}

/**
 * Mengirim data pembimbing yang ditugaskan.
 * NOTE: Ini hanya placeholder. Backend perlu endpoint untuk ini.
 * @param {string} submissionId - ID pengajuan.
 * @param {string} pembimbingName - Nama staf pembimbing.
 * @param {string} pembimbingPhone - Kontak staf pembimbing.
 * @returns {Promise<Object>} Respons sukses.
 */
export async function assignPembimbing(submissionId, pembimbingName, pembimbingPhone) {
    // TODO: Ganti dengan endpoint API yang benar saat backend siap
    // const url = `${API_BASE_URL}/${submissionId}/assign-pembimbing`; 

    // Simulasi respons sukses
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[SIMULASI] Menugaskan ID ${submissionId} ke ${pembimbingName} (${pembimbingPhone})`);
            resolve({ success: true, message: 'Pembimbing berhasil ditugaskan (Simulasi).' });
        }, 1000);
    });
    
    /* // Kode asli saat backend siap:
    return await authenticatedFetch(url, {
        method: 'PUT', // atau POST
        body: JSON.stringify({ 
            nama_pembimbing: pembimbingName,
            kontak_pembimbing: pembimbingPhone
        })
    });
    */
}

/**
 * Mengambil URL file (mencomot dari surat-model).
 */
export async function getProtectedFileUrl(submissionId) {
    const responseData = await authenticatedFetch(`${API_BASE_URL}/${submissionId}/file`);
    if (responseData.success && responseData.file_url) {
        return responseData.file_url;
    } else {
        throw new Error(responseData.message || 'URL file tidak ditemukan.');
    }
}