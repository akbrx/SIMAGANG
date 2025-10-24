<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StudentSubmissionController;
use App\Http\Controllers\Api\AdminSubmissionController;
use App\Http\Controllers\Api\AuthController; // PENTING: Pastikan ini di-import

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Di sinilah Anda dapat mendaftarkan route API untuk aplikasi Anda.
| Semua route di sini sudah memiliki prefix URL "/api/".
|
*/

// =========================================================================
// RUTE PUBLIK (MAHASISWA/SISWA)
// =========================================================================

// POST /api/pengajuan: Endpoint untuk MENGIRIM pengajuan surat baru
Route::post('pengajuan', [StudentSubmissionController::class, 'store']); 

// POST /api/submission/send-link: Endpoint untuk MENGIRIM link melacak
Route::post('/pengajuan/send-link', [StudentSubmissionController::class, 'sendTrackingLink']);

// Endpoint untuk meng-update data submission (EDIT)
Route::put('/pengajuan/{token}', [StudentSubmissionController::class, 'update']);

// GET /api/tracking/{token}: Endpoint untuk MELACAK status surat
Route::get('tracking/{token}', [StudentSubmissionController::class, 'show']);

// [BARU] Endpoint aman untuk mengambil semua data submission setelah verifikasi Magic Link
Route::get('portal/pengajuan', [StudentSubmissionController::class, 'getSubmissionsForPortal']);

// Catatan: Rute file download dipindahkan ke dalam group Admin untuk keamanan.


// =========================================================================
// RUTE ADMIN (WAJIB AUTHENTIKASI)
// =========================================================================

Route::prefix('admin')->group(function () {
    
    // Rute Otentikasi (PUBLIC)
    Route::post('login', [AuthController::class, 'login']); 

    // Rute yang WAJIB MENGGUNAKAN TOKEN (Dilindungi oleh Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        
        // POST /api/admin/logout: Logout dan cabut token
        Route::post('logout', [AuthController::class, 'logout']);
        
        // Rute Pengelolaan Pengajuan
        // GET /api/admin/pengajuan: Melihat semua pengajuan
        Route::get('pengajuan', [AdminSubmissionController::class, 'index']); 
        
        // PUT /api/admin/pengajuan/{id}: Mengubah status pengajuan
        Route::put('pengajuan/{id}', [AdminSubmissionController::class, 'update']); 
        
        // GET /api/admin/pengajuan/{id}/file: Mendapatkan URL file pengajuan (Admin-only)
        Route::get('pengajuan/{id}/file', [AdminSubmissionController::class, 'downloadFile']);
        
        // [BARU] DELETE /api/admin/pengajuan/{id}: Menghapus pengajuan
        Route::delete('pengajuan/{id}', [AdminSubmissionController::class, 'destroy']);
    });
});
