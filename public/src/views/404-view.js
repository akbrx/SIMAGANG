// /src/views/404-view.js

export class NotFoundView {
    constructor() {
        this.app = document.getElementById('app');
    }

    render() {
        this.app.innerHTML = `
            <div class="page-container">
                <div class="not-found-container">
                    <h1>404</h1>
                    <h2>Halaman Tidak Ditemukan</h2>
                    <p>Maaf, halaman yang Anda cari tidak ada atau sudah dipindahkan.</p>
                    <a href="/#/" class="btn btn-primary">Kembali ke Home</a>
                </div>
            </div>
        `;
    }
}