<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Administrator;
use Illuminate\Support\Facades\DB; // Impor DB facade
use Illuminate\Support\Facades\Validator; // Impor Validator

class AdministratorController extends Controller
{
    /**
     * [Endpoint GET /api/admin/administrators]
     * Mengambil daftar semua admin (ID, Nama, Nomor Telepon, Status Kontak Utama).
     */
    public function index()
    {
        // Ambil semua admin yang relevan
        $admins = Administrator::orderBy('nama')
                                ->get(['id', 'nama', 'phone_number', 'is_primary_contact']);

        return response()->json([
            'success' => true,
            'data' => $admins
        ]);
    }

    /**
     * [Endpoint PUT /api/admin/administrators/{id}/set-primary-contact]
     * Menetapkan admin tertentu sebagai kontak utama.
     */
    public function setPrimaryContact(Request $request, $id)
    {
        // 1. Validasi apakah admin yang akan dijadikan kontak utama ada
        $adminToSet = Administrator::find($id);
        if (!$adminToSet) {
            return response()->json(['success' => false, 'message' => 'Admin tidak ditemukan.'], 404);
        }
        // Pastikan admin tersebut punya nomor telepon
        if (empty($adminToSet->phone_number)) {
             return response()->json(['success' => false, 'message' => 'Admin yang dipilih tidak memiliki nomor telepon.'], 422);
        }


        // 2. Gunakan transaksi database untuk keamanan
        DB::beginTransaction();
        try {
            // Set semua admin lain menjadi false
            Administrator::where('id', '!=', $id)->update(['is_primary_contact' => false]);

            // Set admin yang dipilih menjadi true
            $adminToSet->is_primary_contact = true;
            $adminToSet->save();

            DB::commit(); // Konfirmasi transaksi jika semua berhasil

            return response()->json([
                'success' => true,
                'message' => $adminToSet->nama . ' berhasil ditetapkan sebagai kontak utama.',
                'data' => $adminToSet // Kembalikan data admin yang baru diupdate
            ]);

        } catch (\Exception $e) {
            DB::rollBack(); // Batalkan transaksi jika terjadi error
            return response()->json([
                'success' => false,
                'message' => 'Gagal menetapkan kontak utama: ' . $e->getMessage()
            ], 500);
        }
    }
}

