/**
 * @file Controller untuk Halaman Kirim Balasan.
 */

import * as suratModel from '../models/surat-model.js';

export async function init() {
    // --- Seleksi Elemen ---
    const applicantInfo = document.getElementById('reply-applicant-info');
    const form = document.getElementById('reply-form');
    const submitBtn = document.getElementById('send-reply-submit-btn');
    const errorMsg = document.getElementById('reply-error-message');
    
    // Seleksi input
    const submissionIdInput = document.getElementById('reply-submission-id');
    const studentEmailInput = document.getElementById('reply-student-email');
    const bidangSelect = document.getElementById('reply-bidang');
    const pembimbingInput = document.getElementById('reply-pembimbing');
    const kontakInput = document.getElementById('reply-kontak-pembimbing');
    const fileInput = document.getElementById('reply-file');
    const catatanInput = document.getElementById('reply-catatan');

    // --- Ambil Data dari SessionStorage ---
    let submissionId = null;
    try {
        const submission = JSON.parse(sessionStorage.getItem('replySubmission'));
        const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
        const idFromUrl = urlParams.get('id');

        // Validasi data
        if (!submission || submission.id != idFromUrl) {
            throw new Error('Data pengajuan tidak ditemukan. Silakan kembali ke halaman surat.');
        }
        
        submissionId = submission.id;

        // 1. Tampilkan Info Pengaju
        applicantInfo.innerHTML = `
            <p><strong>Kepada:</strong> ${submission.student?.nama || 'N/A'} (<span class="email-text">${submission.student?.email || 'N/A'}</span>)</p>
            <p><strong>Instansi:</strong> ${submission.student?.asal_sekolah || 'N/A'}</p>
        `;
        
        // 2. Isi data tersembunyi di form
        submissionIdInput.value = submission.id;
        studentEmailInput.value = submission.student?.email || '';

    } catch (err) {
        applicantInfo.innerHTML = `<p class="info-message error">${err.message}</p>`;
        form.style.display = 'none'; // Sembunyikan form jika data tidak valid
        return;
    }

    // --- Event Listener untuk Submit Form ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        if (fileInput.files.length === 0) {
            errorMsg.textContent = 'Anda harus memilih file PDF surat balasan.';
            errorMsg.style.display = 'block';
            return;
        }

        // UI Loading
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        errorMsg.style.display = 'none';

        // Buat FormData
        const formData = new FormData();
        formData.append('email_penerima', studentEmailInput.value);
        formData.append('bidang_penempatan', bidangSelect.value);
        formData.append('nama_pembimbing', pembimbingInput.value);
        formData.append('kontak_pembimbing', kontakInput.value);
        formData.append('catatan', catatanInput.value);
        formData.append('surat_balasan_file', fileInput.files[0]);

        try {
            // Panggil model (fungsi sendReply sudah ada di surat-model.js)
            const result = await suratModel.sendReply(submissionId, formData);
            
            showToast(result.message || 'Surat balasan berhasil dikirim!');
            sessionStorage.removeItem('replySubmission'); // Hapus data dari session
            
            // Redirect kembali ke halaman surat
            window.location.hash = '#surat';
            
        } catch (error) {
            errorMsg.textContent = error.message || 'Terjadi kesalahan saat mengirim.';
            errorMsg.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });
}
