/**
 * @file View untuk Halaman Kirim Balasan.
 */

export function render() {
    return `
        <div class="page-container reply-page">
            <div class="page-header">
                <h2 class="page-title">Kirim Surat Balasan</h2>
                <a href="#surat" class="btn-back"><i class="fas fa-arrow-left"></i> Kembali ke Daftar Surat</a>
            </div>

            <!-- Info Pengaju (akan diisi oleh controller) -->
            <div class="applicant-info-header" id="reply-applicant-info">
                <p>Memuat data pengaju...</p>
            </div>
            
            <!-- Form Kirim Balasan -->
            <div class="settings-card">
                <form id="reply-form">
                    <input type="hidden" id="reply-submission-id">
                    <input type="hidden" id="reply-student-email">

                    <div class="form-grid">
                        <div class="form-group">
                            <label for="reply-bidang">Penempatan Bidang</label>
                            <select id="reply-bidang" class="filter-select" required>
                                <option value="" disabled selected>-- Pilih Bidang --</option>
                                <option value="SPBE">SPBE</option>
                                <option value="Infrastruktur">Infrastruktur</option>
                                <option value="Statistik">Statistik</option>
                                <option value="IKP">IKP (Informasi & Komunikasi Publik)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="reply-pembimbing">Nama Pembimbing</label>
                            <input type="text" id="reply-pembimbing" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="reply-kontak-pembimbing">Nomor HP Pembimbing</label>
                        <input type="tel" id="reply-kontak-pembimbing" placeholder="Contoh: 08123456789" required>
                    </div>
                    <div class="form-group">
                        <label for="reply-file">Upload Surat Balasan (PDF)</label>
                        <input type="file" id="reply-file" accept=".pdf" required>
                    </div>
                    <div class="form-group">
                        <label for="reply-catatan">Catatan Tambahan (Opsional)</label>
                        <textarea id="reply-catatan" rows="3" placeholder="Pesan tambahan untuk pengaju surat..."></textarea>
                    </div>

                    <p id="reply-error-message" class="info-message error small" style="display: none;"></p>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-save" id="send-reply-submit-btn">
                            <span class="btn-text">Kirim Balasan</span>
                            <div class="spinner"></div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}
