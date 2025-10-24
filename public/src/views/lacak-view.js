export class LacakView {
    constructor() {
        this.app = document.getElementById('app');
    }

    render() {
        this.app.innerHTML = `
        

        <div class="page-container">
            <!-- Catatan Melayang -->
            <div id="floating-note" class="floating-note">
                <div class="note-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="note-icon">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span class="note-title">Lupa ID nya?</span>
                    <button id="close-note" class="close-button" aria-label="Tutup">&times;</button>
                </div>
                <div class="note-body">
                    <p>Lupa dengan ID Lacak Anda? Klik <a href="#" id="link-lupa-id">di sini</a> untuk bantuan.</p>
                </div>
            </div>

            <div class="tracking-container">
                <h1>Lacak Surat Pengajuan Anda</h1>
                <p>Masukkan ID Pelacakan yang Anda dapatkan setelah mengajukan surat untuk melihat statusnya saat ini.</p>
                
                <form id="form-lacak" class="tracking-form-new">
                    <div class="input-wrapper">
                        <input type="text" id="tracking-id-input" placeholder="Ketik ID Pelacakan Anda di sini..." required>
                        <button type="submit" aria-label="Lacak">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </button>
                    </div>
                </form>
                <div id="tracking-result" class="tracking-result-container">
                
                </div>
            </div>
        </div>
        `;
    }

    // Fungsi untuk menampilkan hasil status
    displayStatus(statusData) {
        const resultContainer = document.getElementById('tracking-result');
        
        const { 
            status, catatan, 
            student_name: nama,
            asal_sekolah: instansi,
            jurusan,
            student_email: email,
            created_at,
            processed_at,
            updated_at,
            accepted_at,
            rejected_at
        } = statusData;

        const formatTanggal = (tanggal) => {
            if (!tanggal) return '';
            if (typeof tanggal === 'string' && tanggal.includes(' ')) {
                return tanggal;
            }
            const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            return new Date(tanggal).toLocaleDateString('id-ID', options);
        };

        const submissionDetailsHTML = `
            <div class="submission-details">
                <h3>Detail Pengaju</h3>
                <div class="detail-grid">
                    <div class="detail-item"><span class="detail-label">Nama</span><span class="detail-value">${nama || '-'}</span></div>
                    <div class="detail-item"><span class="detail-label">Asal Sekolah/Instansi</span><span class="detail-value">${instansi || '-'}</span></div>
                    <div class="detail-item"><span class="detail-label">Jurusan</span><span class="detail-value">${jurusan || '-'}</span></div>
                    <div class="detail-item"><span class="detail-label">Email</span><span class="detail-value">${email || '-'}</span></div>
                </div>
            </div>
        `;

        const statusMap = {
            'DIAJUKAN': { displayText: 'DIAJUKAN', message: 'Surat Anda telah kami terima dan sedang dalam antrian untuk diverifikasi.', cssClass: 'status-proses', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></svg>` },
            'DISPOSISI': { displayText: 'DISPOSISI', message: 'Surat Anda telah diverifikasi dan sedang dalam proses peninjauan oleh pimpinan.', cssClass: 'status-proses', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></svg>` },
            'DITERIMA': { displayText: 'DITERIMA', message: 'Selamat! Surat balasan telah dikirim ke email Anda. Silakan periksa folder inbox atau spam.', cssClass: 'status-diterima', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>` },
            'DITOLAK': { displayText: 'DITOLAK', message: 'Mohon maaf, pengajuan Anda belum dapat kami proses saat ini.', cssClass: 'status-ditolak', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>` }
        };
        const currentStatusInfo = statusMap[status.toUpperCase()] || { displayText: 'Status Tidak Dikenal', message: '', cssClass: '', icon: '' };
        const statusCardHTML = `
            <div class="status-card ${currentStatusInfo.cssClass}">
                <div class="status-icon">${currentStatusInfo.icon}</div>
                <div class="status-details">
                    <h4>${currentStatusInfo.displayText}</h4>
                    <p>${catatan || currentStatusInfo.message}</p>
                </div>
                <div class="status-spacer"></div>
            </div>
        `;

        const steps = ['DIAJUKAN', 'DISPOSISI', 'DITERIMA'];
        let timelineHTML = `<div class="status-timeline">`;
        const finalStatus = status.toUpperCase();

        steps.forEach((step) => {
            if (finalStatus === 'DITOLAK' && step === 'DITERIMA') return;
            let timestamp = '';
            let statusClass = '';
            switch (step) {
                case 'DIAJUKAN': timestamp = formatTanggal(created_at); break;
                case 'DISPOSISI': timestamp = formatTanggal(processed_at); break;
                case 'DITERIMA': timestamp = formatTanggal(accepted_at); break;
            }
            if (timestamp){
                statusClass = 'completed';
            } 
            if (finalStatus === step){
                statusClass = 'active';

            }
            timelineHTML += `
                <div class="timeline-item ${statusClass}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h4>${step.charAt(0).toUpperCase() + step.slice(1).toLowerCase()}</h4>
                        <p>${timestamp}</p>
                    </div>
                </div>
            `;
        });
        if (finalStatus === 'DITOLAK') {
            timelineHTML += `
                <div class="timeline-item active-rejected">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h4>Ditolak</h4>
                        <p>${formatTanggal(rejected_at)}</p>
                    </div>
                </div>
            `;
        }
        timelineHTML += '</div>';

        resultContainer.innerHTML = submissionDetailsHTML + statusCardHTML + timelineHTML;
        resultContainer.style.display = 'block';
    }

    displayError(message) {
        const resultContainer = document.getElementById('tracking-result');
        resultContainer.innerHTML = `<p class="error-message">${message}</p>`;
        resultContainer.style.display = 'block';
    }
}

