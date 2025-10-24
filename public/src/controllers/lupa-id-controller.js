// /src/controllers/lupa-id-controller.js

import { LupaIdView } from "../views/lupa-id-view.js"; 
import { LupaIdModel } from "../models/lupa-id-model.js"; 
import { showNotification } from "../app.js";

export class LupaIdController {
  constructor() {
    this.view = new LupaIdView();
    this.model = new LupaIdModel();
  }

  showLupaIdPage(params = {}) {
    console.log("showLupaIdPage dipanggil dengan parameter:", params);

    this.view.render();
    this.setupFormListener(); // Menyiapkan form input email

    // Jika ada 'token' dari URL (pengguna datang dari magic link)
    if (params.token) {
      this.handleTokenVerification(params.token);
    }
  }


  setupFormListener() {
        const form = document.getElementById('form-lupa-id');
        if (!form) return;

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const emailInput = document.getElementById('email-input');
            const submitButton = form.querySelector('button[type="submit"]');
            const email = emailInput.value;
            const originalButtonHTML = submitButton.innerHTML;

            // Tampilkan status loading
            submitButton.disabled = true;
            submitButton.classList.add('button--loading');

            submitButton.innerHTML = '<div class="button-loader"></div>';

            try {
                const result = await this.model.kirimLink(email);
                showNotification(result.success ? 'Berhasil' : 'Informasi', result.message, result.success ? 'success' : 'warning');
            } catch (error) {
                showNotification('Terjadi Kesalahan', error.message, 'warning');
            } finally {
                // Kembalikan tombol ke kondisi semula
                submitButton.disabled = false;
                submitButton.classList.remove('button--loading');
                submitButton.innerHTML = originalButtonHTML;
            }
        });
    }
  async handleTokenVerification(token) {
    console.log("handleTokenVerification dipanggil dengan token:", token);
    try {
      this.view.showLoading(); 
      const submissions = await this.model.getSubmissionsForPortal(token);

      console.log("Data submissions yang diterima dari model:", submissions);
      
      this.view.displaySubmissions(submissions);
    } catch (error) {
      console.error("Terjadi error saat verifikasi token:", error);
      
      this.view.displayError(error.message);
    }
  }

}
