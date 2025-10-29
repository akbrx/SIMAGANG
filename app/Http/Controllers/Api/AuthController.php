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
     * Mengirim link reset password ke email admin.
     */
    public function forgotPassword(Request $request)
    {
        // 1. Validasi email
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:administrators,email',
        ], [
            'email.exists' => 'Email tidak terdaftar sebagai administrator.'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // 2. Kirim link reset menggunakan broker 'administrators'
        try {
            $status = Password::broker('administrators')->sendResetLink(
                $request->only('email')
            );

            // 3. Beri respon
            if ($status == Password::RESET_LINK_SENT) {
                return response()->json([
                    'success' => true,
                    'message' => 'Email reset password telah dikirim.'
                ]);
            } else {
                // Harusnya tidak terjadi jika validasi 'exists' berhasil
                return response()->json([
                    'success' => false,
                    'message' => __($status) // Terjemahkan status error dari Laravel
                ], 400);
            }
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim email: ' . $e->getMessage()
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
            'password' => 'required|string|min:8|confirmed', // 'confirmed' akan cek 'password_confirmation'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // 2. Coba reset password menggunakan broker 'administrators'
        $status = Password::broker('administrators')->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
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
                'message' => 'Password berhasil diperbarui. Anda bisa menutup halaman ini.'
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
