import { PengajuanView } from "../views/pengajuan-view.js";
import { PengajuanModel } from "../models/pengajuan-model.js";
import { showNotification } from "../app.js";
import { makeDraggable } from '../app.js';

export class PengajuanController {
  constructor() {
    this.view = new PengajuanView();
    this.model = new PengajuanModel();
  }

  showPengajuanPage() {
    this.view.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const modal = document.getElementById("pengajuan-modal");
    const openModalBtn = document.getElementById("btn-open-modal");
    const closeModalBtn = document.getElementById("btn-close-modal");
    openModalBtn.addEventListener(
      "click",
      () => (modal.style.display = "flex")
    );
    closeModalBtn.addEventListener(
      "click",
      () => (modal.style.display = "none")
    );
    window.addEventListener("click", (event) => {
      if (event.target === modal) modal.style.display = "none";
    });

    const form = document.getElementById("form-pengajuan-magang");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const submitButton = form.querySelector('button[type="submit"]');

      submitButton.disabled = true;
      submitButton.textContent = "Mengirim...";

      try {
        const result = await this.model.kirim(formData);

        const trackingId = result.unique_token;
        const message = result.message;

        if (!trackingId) {
          throw new Error(
            "Respons dari server tidak menyertakan token pelacakan."
          );
        }

        modal.style.display = "none";
        form.reset();

        this.view.renderSuccess(trackingId, message);
        this.setupSuccessPageListeners(trackingId);
      } catch (error) {
        // Blok ini akan menangani semua respons non-2xx (misalnya 409, 500)

        // Coba untuk mem-parsing pesan error sebagai JSON.
        // Ini karena model kita akan melempar error yang berisi body JSON dari server.
        try {
            const errorData = JSON.parse(error.message);

            // Cek apakah ini error spesifik 'email_exists' dari backend
            if (errorData && errorData.email_exists === true) {
                showNotification("Email Sudah Terdaftar", errorData.message);
                // Karena proses "gagal" tapi informatif, kita tutup modalnya.
                modal.style.display = "none";
                form.reset();
            } else {
                // Untuk error validasi lain (422) atau error terstruktur lainnya
                showNotification("Terjadi Kesalahan", errorData.message || "Gagal memproses permintaan.");
            }
        } catch (e) {
            // Jika pesan error BUKAN JSON (misalnya error jaringan, 500 dengan HTML),
            // tampilkan pesan error seperti biasa.
            showNotification("Terjadi Kesalahan", error.message);
        }
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Kirim Pengajuan";
      }
    });
  }

  // FUNGSI UNTUK HALAMAN SUKSES
  setupSuccessPageListeners(trackingId) {
    // Tombol Lacak Sekarang
    document.getElementById("btn-track-now").addEventListener("click", () => {
      window.location.hash = `/lacak?id=${trackingId}`;
    });

    // Tombol Kembali ke Home
    document.getElementById("btn-go-home").addEventListener("click", () => {
      window.location.hash = '/';
    });

    const note = document.getElementById('floating-note');
    const closeNoteBtn = document.getElementById('close-note');

    if (note && closeNoteBtn) {
        closeNoteBtn.addEventListener('click', () => {
            note.style.display = 'none';
        });
        
        // Panggil fungsi untuk membuat note bisa digeser
        makeDraggable(note); 
    }

    // LOGIKA BARU UNTUK TOMBOL COPY
    const copyBtn = document.getElementById("btn-copy-token");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const tokenText =
          document.getElementById("tracking-id-text").textContent;

        navigator.clipboard
          .writeText(tokenText)
          .then(() => {
            // Beri feedback visual setelah berhasil copy
            copyBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                `;

            // Kembalikan ikon copy setelah 2 detik
            setTimeout(() => {
              copyBtn.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    `;
            }, 2000);
          })
          .catch((err) => {
            console.error("Gagal menyalin token:", err);
            alert("Gagal menyalin token.");
          });
      });
    }
  }
}
