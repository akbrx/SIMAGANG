/**
 * @file This is the Model for the dashboard.
 * Its only responsibility is to fetch and process data.
 * It knows nothing about charts, cards, or any HTML elements.
 */

/**
 * Fetches raw submission data from the backend API.
 * @private
 * @returns {Promise<Array|null>} A promise that resolves to an array of submissions or null if failed.
 */
async function fetchSubmissions() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.error('No auth token found, redirecting to login.');
        window.location.hash = '#login';
        return null;
    }

    const apiEndpoint = 'http://localhost:8000/api/admin/pengajuan';

    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.hash = '#login';
            return null;
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal mengambil data dari server.');
        }

        const responseData = await response.json();
        
        // Log the response to confirm the structure
        console.log("Data diterima dari backend:", responseData);

        // [PERBAIKAN] Mengakses array yang benar dari objek paginasi Laravel
        // Strukturnya adalah: responseData -> data (object) -> data (array)
        if (responseData && responseData.data && Array.isArray(responseData.data.data)) {
            return responseData.data.data; 
        }

        // Fallback jika suatu saat API mengembalikan array secara langsung
        if (Array.isArray(responseData)) {
            return responseData;
        }
        
        // Jika format tidak dikenali
        throw new Error("Format data dari API tidak sesuai harapan.");

    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

/**
 * Processes the raw submission data from the API.
 * @private
 * @param {Array} submissions - The array of submission objects.
 * @returns {Object} An object containing totalStats and monthlyStats.
 */
function processData(submissions) {
    if (!Array.isArray(submissions)) {
        console.error("Data yang diterima untuk diproses bukan array:", submissions);
        return {
            totalStats: { total: 0, pending: 0, disposisi: 0, selesai: 0 },
            monthlyStats: {}
        };
    }

    const totalStats = {
        total: submissions.length,
        pending: submissions.filter(s => s.status.toUpperCase() === 'DIAJUKAN').length,
        disposisi: submissions.filter(s => s.status.toUpperCase() === 'DISPOSISI').length,
        selesai: submissions.filter(s => ['DITERIMA', 'DITOLAK'].includes(s.status.toUpperCase())).length
    };

    const monthlyStats = {};
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    
    monthNames.forEach(month => {
        monthlyStats[month] = { diajukan: 0, disposisi: 0, diterima: 0, ditolak: 0 };
    });

    submissions.forEach(sub => {
        const submissionDate = new Date(sub.created_at);
        const monthName = monthNames[submissionDate.getMonth()];
        
        if (monthName) {
            const status = sub.status.toUpperCase();
            if (status === 'DIAJUKAN') monthlyStats[monthName].diajukan++;
            if (status === 'DISPOSISI') monthlyStats[monthName].disposisi++;
            if (status === 'DITERIMA') monthlyStats[monthName].diterima++;
            if (status === 'DITOLAK') monthlyStats[monthName].ditolak++;
        }
    });

    return { totalStats, monthlyStats };
}

/**
 * Main exported function. Fetches and processes dashboard data.
 * @returns {Promise<Object|null>} An object with totalStats and monthlyStats, or null on failure.
 */
export const getDashboardStats = async () => {
    try {
        const submissions = await fetchSubmissions();
        if (submissions) {
            return processData(submissions);
        }
        return null;
    } catch (error) {
        console.error("Error in model while getting stats:", error);
        return null;
    }
};

