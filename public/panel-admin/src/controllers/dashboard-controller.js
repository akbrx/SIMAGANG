// [BARU] Import the model to handle all data logic
import * as dashboardModel from '../models/dashboard-model.js';

// --- CHART INSTANCES ---
// Keep track of chart instances to destroy them before re-rendering
let monthlyDistributionChartInstance = null;
let yearlyTrendChartInstance = null;

// [DIHAPUS] Semua fungsi yang berhubungan dengan pengambilan dan pemrosesan data
// sekarang ada di dalam dashboard-model.js.

// --- UI RENDERING FUNCTIONS ---
// Fungsi-fungsi ini (updateStatCards, populateMonthFilter, render...Chart)
// TIDAK BERUBAH karena tugas mereka hanya menampilkan data yang sudah jadi.

/**
 * Updates the big stat cards with processed data.
 */
function updateStatCards(data) {
    const totalSuratEl = document.getElementById('total-surat');
    const pendingSuratEl = document.getElementById('pending-surat');
    const disposisiSuratEl = document.getElementById('disposisi-surat');
    const selesaiSuratEl = document.getElementById('selesai-surat');
    
    if (totalSuratEl) totalSuratEl.textContent = data.total;
    if (pendingSuratEl) pendingSuratEl.textContent = data.pending;
    if (disposisiSuratEl) disposisiSuratEl.textContent = data.disposisi;
    if (selesaiSuratEl) selesaiSuratEl.textContent = data.selesai;
}

/**
 * Populates the month filter dropdown.
 */
function populateMonthFilter() {
    const monthFilter = document.getElementById('month-filter');
    if (!monthFilter) return;

    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    monthFilter.innerHTML = months.map(month => `<option value="${month}">${month}</option>`).join('');
    
    const currentMonthName = new Date().toLocaleString('id-ID', { month: 'long' });
    if (months.includes(currentMonthName)) {
        monthFilter.value = currentMonthName;
    }
}

/**
 * Renders the monthly distribution pie chart.
 */
function renderMonthlyDistributionChart(month, allMonthlyData) {
    const ctx = document.getElementById('monthly-distribution-chart')?.getContext('2d');
    if (!ctx) return;

    const data = allMonthlyData[month];
    if (!data) return;

    if (monthlyDistributionChartInstance) {
        monthlyDistributionChartInstance.destroy();
    }

    monthlyDistributionChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Diajukan', 'Disposisi', 'Diterima', 'Ditolak'],
            datasets: [{
                data: [data.diajukan, data.disposisi, data.diterima, data.ditolak],
                backgroundColor: ['#ffc107', '#007bff', '#28a745', '#dc3545'],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

/**
 * Renders the yearly trend bar chart.
 */
function renderYearlyTrendChart(allMonthlyData) {
    const ctx = document.getElementById('yearly-trend-chart')?.getContext('2d');
    if (!ctx) return;
    
    if (yearlyTrendChartInstance) {
        yearlyTrendChartInstance.destroy();
    }

    const months = Object.keys(allMonthlyData);
    const totalSuratPerMonth = months.map(month => {
        const monthData = allMonthlyData[month];
        return monthData.diajukan + monthData.disposisi + monthData.diterima + monthData.ditolak;
    });

    yearlyTrendChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Jumlah Surat Masuk',
                data: totalSuratPerMonth,
                backgroundColor: '#2c5ae9',
                borderColor: '#1c3e91',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: false } }
        }
    });
}

// --- INITIALIZATION ---

/**
 * Main function called by the router to initialize the dashboard.
 * Now it orchestrates the Model and the View functions.
 */
export const init = async () => {
    // 1. Set a loading state on the UI
    updateStatCards({ total: '...', pending: '...', disposisi: '...', selesai: '...' });

    // 2. [PERUBAHAN] Ask the model for the data
    const data = await dashboardModel.getDashboardStats();
    
    // 3. If data is successfully fetched and processed, render the page
    if (data) {
        const { totalStats, monthlyStats } = data;
        
        // Populate UI elements with real data
        updateStatCards(totalStats);
        populateMonthFilter();
        
        // Render charts with an initial value
        const monthFilterEl = document.getElementById('month-filter');
        if (monthFilterEl) {
            const initialMonth = monthFilterEl.value;
            renderMonthlyDistributionChart(initialMonth, monthlyStats);
            
            // Add event listener for when the filter changes
            monthFilterEl.addEventListener('change', (e) => {
                renderMonthlyDistributionChart(e.target.value, monthlyStats);
            });
        }
        
        renderYearlyTrendChart(monthlyStats);
    } else {
        // If data is null, it means there was an error.
        // The model has already logged it, and for critical errors like auth,
        // it has already redirected. We can show a general error message here.
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.innerHTML = `<div class="error-page"><h4>Gagal Memuat Data</h4><p>Tidak dapat mengambil data dari server. Silakan coba lagi nanti.</p></div>`;
        }
    }
};

