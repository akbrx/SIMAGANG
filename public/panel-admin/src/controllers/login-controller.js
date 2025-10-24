// This is the main logic file for the login page.

export const init = () => {
    const loginForm = document.getElementById('login-form');
    // [PERUBAHAN] Mengganti 'username' menjadi 'email'
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const loginButton = document.querySelector('.btn-login');

    if (!loginForm || !loginButton) return;

    // --- Menggunakan 'async' untuk menangani permintaan jaringan (fetch) ---
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // --- 1. Mengatur UI untuk Status Loading ---
        loginButton.disabled = true;
        loginButton.classList.add('loading');
        errorMessage.style.display = 'none';

        // [PERUBAHAN] Mengambil nilai dari input email
        const email = emailInput.value;
        const password = passwordInput.value;

        // --- GANTI URL INI dengan URL Endpoint Login Anda ---
        const apiEndpoint = 'http://localhost:8000/api/admin/login'; // Contoh URL

        try {
            // --- 2. Mengirim Data ke Backend ---
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // [PERUBAHAN] Mengirim 'email' dan 'password' di body
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            // --- 3. Memeriksa Respons dari Backend ---
            if (response.ok) { // Status HTTP 200-299
                console.log('Login berhasil!', data);
                
                // Simpan token ke localStorage untuk sesi login
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('adminName', data.user.nama);

                // Arahkan ke halaman dashboard
                window.location.hash = '#dashboard';
            } else {
                // Tampilkan pesan error dari backend (misal: "Password salah")
                errorMessage.textContent = data.message || 'Terjadi kesalahan saat login.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            // --- 4. Menangani Error Jaringan ---
            console.error('Error jaringan:', error);
            errorMessage.textContent = 'Tidak dapat terhubung ke server. Periksa koneksi Anda.';
            errorMessage.style.display = 'block';
        } finally {
            // --- 5. Mengembalikan UI ke Status Normal ---
            // 'finally' akan selalu berjalan, baik login berhasil maupun gagal
            loginButton.disabled = false;
            loginButton.classList.remove('loading');
        }
    });

    // Event listener untuk Lupa Password (tidak berubah)
    const forgotPasswordLink = document.getElementById('forgot-password');
    if(forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Fitur "Lupa Password" sedang dalam pengembangan.');
        });
    }
};

