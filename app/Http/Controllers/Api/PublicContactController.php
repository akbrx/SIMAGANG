<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Administrator;

class PublicContactController extends Controller
{
    /**
     * [Endpoint GET /api/contact-info] (Publik)
     * Mengambil nomor telepon admin yang ditandai sebagai kontak utama.
     */
    public function getContactInfo()
    {
        // Cari admin yang is_primary_contact = true
        $primaryContactAdmin = Administrator::where('is_primary_contact', true)->first();

        $phoneNumber = '';
        if ($primaryContactAdmin) {
            // Jika ditemukan, ambil nomor teleponnya
            $phoneNumber = $primaryContactAdmin->phone_number ?? '';
        } else {
            // Fallback: Jika tidak ada yang ditandai, ambil admin pertama yang punya nomor
            $fallbackAdmin = Administrator::whereNotNull('phone_number')
                                          ->where('phone_number', '!=', '')
                                          ->orderBy('id', 'asc')
                                          ->first();
            $phoneNumber = $fallbackAdmin ? $fallbackAdmin->phone_number : '';
        }


        return response()->json([
            'success' => true,
            'data' => [
                'phone_number' => $phoneNumber
            ]
        ]);
    }
}

