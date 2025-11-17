/**
 * @file Model untuk Halaman Kadis.
 * Mengelola data surat disposisi.
 */

// --- Fungsi Helper untuk Fetch ---
async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('authToken');
    if (!token) { 
        // Izinkan akses jika kita sedang testing tanpa login
        console.warn("Token tidak ditemukan, melanjutkan tanpa otentikasi (mode testing #kadis).");
        // window.location.hash = '#login'; 
        // throw new Error('Token otentikasi tidak ditemukan.'); 
    }
    
    const defaultHeaders = { 'Accept': 'application/json' };
    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
    if (options.method === 'POST' || options.method === 'PUT') {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    const config = { ...options, headers: { ...defaultHeaders, ...options.headers } };

    try {
        const response = await fetch(url, config);
        // if (response.status === 401) { window.location.hash = '#login'; throw new Error('Sesi tidak valid.'); }
        
        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.message || `Gagal ${options.method || 'GET'} ${url}`);
        }
        return responseData;
    } catch (error) { console.error(`Error during fetch ${url}:`, error); throw error; }
}

const API_BASE_URL = 'http://localhost:8000/api/admin/pengajuan';

/**
 * Mengambil semua data pengajuan dari server.
 * Controller akan memfilter ini ke "DISPOSISI".
 */
export async function getAllSubmissions() {
    const responseData = await authenticatedFetch(API_BASE_URL);
    return responseData.data.data || []; 
}

/**
 * Mengirim pembaruan disposisi (bidang) ke backend.
 * NOTE: Ini hanya placeholder.
 */
export async function updateDisposisiBidang(submissionId, bidang) {
    // TODO: Ganti dengan endpoint API yang benar dari backend
    // const url = `${API_BASE_URL}/${submissionId}/disposisi-bidang`; 
    console.log(`[SIMULASI] Mengirim disposisi ID ${submissionId} ke Bidang ${bidang}`);
    
    // Simulasi respons sukses
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: 'Disposisi berhasil dikirim (Simulasi).' });
        }, 1000);
    });
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