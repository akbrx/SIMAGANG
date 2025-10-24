export class LacakModel {
    constructor() {
        // Endpoint API Anda untuk melacak status
        this.baseUrl = 'http://localhost:8000/api/tracking/';
    }

    /**
     * Mengambil data status dari API berdasarkan token/ID
     * @param {string} trackingId - ID unik untuk pelacakan
     * @returns {Promise<object>} - Data status surat dari API
     */
    async getStatus(trackingId) {
        try {
            // Gabungkan base URL dengan ID untuk membuat URL lengkap
            const response = await fetch(this.baseUrl + trackingId, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();

            if (!response.ok) {
                // Jika server mengembalikan error (misal: 404 Not Found),
                // kita ambil pesan error dari JSON responsenya.
                throw new Error(result.message || 'Gagal mengambil status surat.');
            }

            return result; // Mengembalikan seluruh data JSON dari server

        } catch (error) {
            console.error('Error saat mengambil data status:', error);
            // Lempar lagi error agar bisa ditangkap oleh Controller
            throw error;
        }
    }
}