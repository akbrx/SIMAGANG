export class PengajuanModel {
    constructor() {
        this.apiUrl = 'http://127.0.0.1:8000/api/pengajuan';
    }

    /**
     * Mengirim data form ke API backend
     * @param {FormData} formData - Data dari form, termasuk file
     * @returns {Promise<object>} - Hasil dari API
     */
    async kirim(formData) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    // Minta server untuk merespons dalam format JSON jika memungkinkan.
                    // Ini membantu dalam negosiasi konten.
                    'Accept': 'application/json',
                },
            });

            // PERUBAHAN UTAMA: Cek status respons SEBELUM mencoba mem-parsing body.
            if (!response.ok) {
                // Jika respons adalah error (status 4xx atau 5xx)
                const errorData = await response.json(); // Coba parse body error sebagai JSON

                // Lemparkan error yang berisi seluruh data JSON dari server.
                // Menggunakan JSON.stringify memastikan Controller bisa mem-parsingnya kembali.
                throw new Error(JSON.stringify(errorData));
            }

            // Jika respons sukses (status 2xx), baru kita parsing body-nya.
            return await response.json();

        } catch (error) {
            // Blok catch ini sekarang akan menangani 3 jenis error:
            // 1. Error jaringan (server tidak terjangkau).
            // 2. Error parsing JSON (jika server error 500 dan mengirim HTML).
            // 3. Error yang kita lempar secara manual dari blok `if (!response.ok)`.

            console.error('Gagal mengirim pengajuan:', error);

            // Periksa apakah pesan error adalah string JSON dari blok `if` di atas.
            // Jika ya, jangan diubah. Jika tidak (error jaringan/parsing), buat pesan yg lebih umum.
            if (!(error.message.startsWith('{') && error.message.endsWith('}'))) {
                throw new Error('Tidak dapat terhubung ke server. Periksa koneksi Anda.');
            }

            // Lemparkan kembali error agar bisa ditangani oleh Controller.
            throw error;
        }
    }
}