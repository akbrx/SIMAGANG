// /src/models/home.js

export class HomeModel {
    constructor() {
        // Saat ini tidak ada data spesifik yang perlu dikelola untuk home.
        // File ini bisa digunakan nanti jika ada info dinamis yang perlu ditampilkan di home,
        // misalnya jumlah pendaftar magang saat ini.
        this.pageTitle = "Selamat Datang di SIMAGANG";
    }

    // Contoh fungsi yang bisa dikembangkan nanti
    // async getInfoDashboard() {
    //     const response = await fetch('/api/info');
    //     return await response.json();
    // }
}