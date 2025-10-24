<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class AdminProfileController extends Controller
{
    /**
     * [Endpoint GET /api/admin/profile]
     * Mengambil detail profil admin yang sedang login.
     */
    public function show(Request $request)
    {
        $admin = $request->user(); // Dapatkan admin yang terotentikasi dari token
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $admin->id,
                'nama' => $admin->nama, // Sesuaikan nama kolom jika berbeda
                'email' => $admin->email,
                'phone_number' => $admin->phone_number,
            ]
        ]);
    }

    /**
     * [Endpoint PUT /api/admin/profile]
     * Memperbarui nama dan nomor telepon admin yang sedang login.
     */
    public function update(Request $request)
    {
        $admin = $request->user();

        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'phone_number' => 'required|string|regex:/^0[0-9]{9,15}$/',
        ], [
            'nama.required' => 'Nama wajib diisi.',
            'phone_number.required' => 'Nomor telepon wajib diisi.',
            'phone_number.regex' => 'Format nomor telepon tidak valid (08xxxx, 10-16 digit).',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        $admin->nama = $request->nama;
        $admin->phone_number = $request->phone_number;
        $admin->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
            'data' => $admin // Kembalikan data admin yang sudah diperbarui
        ]);
    }

    /**
     * [Endpoint PUT /api/admin/profile/password]
     * Memperbarui password admin yang sedang login.
     */
    public function updatePassword(Request $request)
    {
        $admin = $request->user();

        $validator = Validator::make($request->all(), [
            'current_password' => ['required', 'string', function ($attribute, $value, $fail) use ($admin) {
                if (!Hash::check($value, $admin->password)) {
                    $fail('Password saat ini salah.');
                }
            }],
            'new_password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'current_password.required' => 'Password saat ini wajib diisi.',
            'new_password.required' => 'Password baru wajib diisi.',
            'new_password.confirmed' => 'Konfirmasi password baru tidak cocok.',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        $admin->password = Hash::make($request->new_password);
        $admin->save();

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diperbarui.'
        ]);
    }
}
