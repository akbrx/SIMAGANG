<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash; // Tambahkan import untuk hashing
use App\Models\Administrator; // Wajib di-import

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
}
