<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash; // Tambahkan import untuk hashing
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use App\Models\Administrator; // Wajib di-import
use Exception;

class AuthController extends Controller
{
    /**
     * [Endpoint POST /api/admin/login]
     * Menerima kredensial admin dan mengembalikan token.
     */
    public function login(Request $request)
    {
        // 1. Validasi Kredensial
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors(),
            ], 422);
        }

        // 2. Verifikasi Kredensial SECARA MANUAL (Mengatasi error RequestGuard::attempt)
        $user = Administrator::where('email', $request->email)->first();

        // Cek apakah user ditemukan DAN password cocok (menggunakan Hash::check)
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Kredensial Admin tidak valid.',
            ], 401); // 401 Unauthorized
        }

        // 3. Buat Token Sanctum
        // Karena $user adalah Model Administrator yang sudah memiliki HasApiTokens, createToken bekerja
        $token = $user->createToken('admin-token', ['admin'])->plainTextToken;

        // 4. Response Sukses
        return response()->json([
            'success' => true,
            'message' => 'Login Admin berhasil. Token siap digunakan.',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'nama' => $user->nama,
                'email' => $user->email,
                'role' => $user->role
            ]
        ]);
    }

    /**
     * [Endpoint POST /api/admin/logout]
     * Menghapus token yang digunakan.
     */
    public function logout(Request $request)
    {
        // Periksa apakah ada user yang terautentikasi 
        if ($request->user()) {
            // Hapus token yang sedang digunakan (currentAccessToken)
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logout Admin berhasil. Token telah dicabut.'
            ]);
        }
        
        // Jika tidak ada user yang terautentikasi (seharusnya dicegah oleh middleware auth:sanctum)
        return response()->json([
            'success' => false,
            'message' => 'Tidak ada sesi yang aktif untuk di-logout.'
        ], 401); 
    }

    /**
     * [Endpoint POST /api/admin/forgot-password]
     * Menerima email admin dan mengirimkan link reset password.
     */
    public function forgotPassword(Request $request)
    {
        // 1. Validasi email
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:administrators,email',
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.exists' => 'Email tidak terdaftar sebagai administrator.'
        ]);

        if ($validator->fails()) {
            // Jika validasi gagal (email tidak ada), kirim error 422
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        // 2. Kirim link reset
        $status = Password::broker('administrators')->sendResetLink(
            $request->only('email')
        );

        // 3. [PERBAIKAN] Cek status pengiriman email
        if ($status == Password::RESET_LINK_SENT) {
            // HANYA jika email berhasil dikirim, kembalikan sukses
            return response()->json([
                'success' => true,
                'message' => 'Link reset password telah dikirim ke email Anda.'
            ]);
        } else {
            // Jika gagal (misal: throttling, server email down)
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim link reset. Silakan coba lagi nanti.'
            ], 500);
        }
    }


    /**
     * [Endpoint POST /api/admin/reset-password]
     * Memperbarui password admin dengan token yang valid.
     */
    public function resetPassword(Request $request)
    {
        // 1. Validasi input
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'email' => 'required|email|exists:administrators,email',
            // [PERBAIKAN] Sesuaikan nama field dengan frontend
            'new_password' => 'required|string|min:8|confirmed', 
        ], [
            // [PERBAIKAN] Tambahkan pesan error untuk field baru
            'new_password.required' => 'Password baru wajib diisi.',
            'new_password.min' => 'Password baru minimal 8 karakter.',
            'new_password.confirmed' => 'Konfirmasi password baru tidak cocok.',
        ]);


        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        // 2. Coba reset password
        $status = Password::broker('administrators')->reset(
            // [PERBAIKAN] Gunakan field yang benar dari request
            [
                'email' => $request->email,
                'token' => $request->token,
                'password' => $request->new_password, // Ambil dari 'new_password'
                'password_confirmation' => $request->new_password_confirmation, // Ambil dari 'new_password_confirmation'
            ],
            function ($admin, $password) {
                // Callback ini dijalankan JIKA token dan email valid
                $admin->password = Hash::make($password);
                $admin->save();
            }
        );

        // 3. Beri respon berdasarkan status
        if ($status == Password::PASSWORD_RESET) {
            return response()->json([
                'success' => true,
                'message' => 'Password berhasil diperbarui!'
            ]);
        } else {
            // Jika token tidak valid atau kedaluwarsa
            return response()->json([
                'success' => false,
                'message' => __($status) // (misal: "Token reset password ini tidak valid.")
            ], 400);
        }
    }
}