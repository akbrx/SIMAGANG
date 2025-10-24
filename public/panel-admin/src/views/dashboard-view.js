// This file is responsible for rendering the HTML structure of the dashboard page.

export const render = () => {
    // HTML for the dashboard page
    const html = `
        <div class="dashboard-header">
            <h1 class="dashboard-title">Dashboard</h1>
            <p class="dashboard-subtitle">Ringkasan data surat masuk dalam sistem.</p>
        </div>

        <!-- Statistik Cards -->
        <div class="stats-cards">
            <div class="card">
                <div class="card-info">
                    <span id="total-surat" class="card-value">0</span>
                    <span class="card-title">Total Surat Masuk</span>
                </div>
            </div>
            <div class="card">
                <div class="card-info">
                    <span id="pending-surat" class="card-value">0</span>
                    <span class="card-title">Pending</span>
                </div>
            </div>
            <div class="card">
                <div class="card-info">
                    <span id="disposisi-surat" class="card-value">0</span>
                    <span class="card-title">Disposisi</span>
                </div>
            </div>
            <div class="card">
                <div class="card-info">
                    <span id="selesai-surat" class="card-value">0</span>
                    <span class="card-title">Selesai</span>
                </div>
            </div>
        </div>

        <!-- Charts Grid -->
        <div class="charts-grid">
            <!-- Monthly Distribution Chart Card -->
            <div class="chart-container">
                <div class="chart-header">
                    <h4>Statistik Surat Per Bulan</h4>
                    <div class="chart-filter">
                        <select id="month-filter"></select>
                    </div>
                </div>
                <div class="chart-canvas-wrapper">
                    <canvas id="monthly-distribution-chart"></canvas>
                </div>
            </div>

            <!-- Yearly Trend Chart Card -->
            <div class="chart-container">
                <div class="chart-header">
                    <h4>Tren Surat Masuk (Tahunan)</h4>
                </div>
                <div class="chart-canvas-wrapper">
                    <canvas id="yearly-trend-chart"></canvas>
                </div>
            </div>
        </div>
    `;

    return html;
};

