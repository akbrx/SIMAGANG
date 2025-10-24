/**
 * @file Model untuk Halaman Surat.
 * Bertanggung jawab untuk semua interaksi dengan API terkait data pengajuan.
 */

const API_BASE_URL = 'http://localhost:8000/api/admin/pengajuan';

/**
 * Mengambil semua data pengajuan dari server.
 * @returns {Promise<Array>} Array data pengajuan.
 */
export async function getAllSubmissions() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.hash = '#login';
        throw new Error('Token otentikasi tidak ditemukan.');
    }

    const response = await fetch(API_BASE_URL, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.status === 401) {
        window.location.hash = '#login';
        throw new Error('Sesi tidak valid.');
    }
    if (!response.ok) {
        throw new Error(`Gagal mengambil data: ${response.statusText}`);
    }
    
    const responseData = await response.json();
    return responseData.data.data;
}

/**
 * Memperbarui status sebuah pengajuan di server.
 * @param {number} id - ID pengajuan yang akan diupdate.
 * @param {string} newStatus - Status baru.
 * @returns {Promise<Object>} Data pengajuan yang telah diperbarui.
 */
export async function updateSubmissionStatus(id, newStatus) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui status.');
    }
    
    const result = await response.json();
    return result.data.data || result.data;
}

/**
 * Mendapatkan URL aman untuk membuka file dari server.
 * @param {number} submissionId - ID pengajuan.
 * @returns {Promise<string>} URL file yang aman.
 */
export async function getProtectedFileUrl(submissionId) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/${submissionId}/file`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Gagal mendapatkan link file. Pastikan Anda memiliki izin.');
    }

    const data = await response.json();
    if (data.success && data.file_url) {
        return data.file_url;
    } else {
        throw new Error(data.message || 'URL file tidak ditemukan dalam respons.');
    }
}

/**
 * [BARU] Menghapus sebuah pengajuan dari server.
 * @param {number} id - ID pengajuan yang akan dihapus.
 * @returns {Promise<Object>} Respons sukses dari server.
 */
export async function deleteSubmission(id) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus surat.');
    }
    
    return await response.json();
}

