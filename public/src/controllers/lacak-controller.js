import { LacakView } from "../views/lacak-view.js";
import { LacakModel } from "../models/lacak-model.js";
import { makeDraggable } from "../app.js";

export class LacakController {
  constructor() {
    this.view = new LacakView();
    this.model = new LacakModel();
  }

  showLacakPage(trackingId = null) {
    this.view.render();
    this.setupEventListeners();

    const note = document.getElementById("floating-note");
    if (note) {
      makeDraggable(note);
    }
    if (trackingId) {
      document.getElementById("tracking-id-input").value = trackingId;
      this.handleLacak(trackingId);
    }
  }

  setupEventListeners() {
    // --- Logika untuk Form Pelacakan ---
    const form = document.getElementById("form-lacak");
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const trackingId = document.getElementById("tracking-id-input").value;
        this.handleLacak(trackingId);
      });
    }

    // --- Logika untuk Tombol Close pada Note ---
    const closeButton = document.getElementById("close-note");
    const note = document.getElementById("floating-note");
    if (closeButton && note) {
      closeButton.addEventListener("click", () => {
        note.style.display = "none";
      });
    }

    // --- Logika untuk Tombol Lupa ID Pelacakan ---
    const lupaIdLink = document.getElementById("link-lupa-id");
    if (lupaIdLink) {
      lupaIdLink.addEventListener("click", (event) => {
        event.preventDefault();
        window.location.hash = "/lupa-id";
      });
    }
  }

  async handleLacak(id) {
    if (!id) {
      this.view.displayError("ID Pelacakan tidak boleh kosong.");
      return;
    }

    try {
      // Panggil model untuk mengambil data dari API backend
      const result = await this.model.getStatus(id);
      console.log("Data lengkap dari backend:", result);

      // Tampilkan hasilnya menggunakan view.
      // Asumsi backend mengembalikan data di dalam properti 'data'
      if (result.data) {
        this.view.displayStatus(result.data);
      } else {
        throw new Error("Format respons dari server tidak sesuai.");
      }
    } catch (error) {
      // Jika model mengembalikan error (misal: 404), tampilkan pesannya
      this.view.displayError(error.message);
    }
  }
  // Fungsi getFakeStatus() sudah dihapus dari sini
}
