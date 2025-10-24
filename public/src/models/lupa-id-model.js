

export class LupaIdModel {
    constructor() {
        this.sendLinkUrl = 'http://localhost:8000/api/pengajuan/send-link';
        // Endpoint baru sesuai kode backend Anda
        this.portalUrl = 'http://localhost:8000/api/portal/pengajuan';
    }

    /**
     * Mengirim request ke backend untuk mengirim link ke email
     * @param {string} email - Email yang diinput oleh user
     * @returns {Promise<object>} - Pesan sukses atau gagal dari backend
     */
    async kirimLink(email) {
        try {
            const response = await fetch(this.sendLinkUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: email }) // Kirim email dalam format JSON
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Terjadi kesalahan pada server.');
            }

            return result;

        } catch (error) {
            console.error('Gagal mengirim link:', error);
            throw error;
        }
    }
    async getSubmissionsForPortal(token) {
        try {
            const response = await fetch(this.portalUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}` // Gunakan Bearer Token
                }
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || 'Token portal tidak valid.');
            }
            return result.data; // Backend mengirim data di properti 'data'
        } catch (error) {
            console.error('Gagal mengambil data portal:', error);
            throw error;
        }
    }
}