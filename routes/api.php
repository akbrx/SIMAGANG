<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StudentSubmissionController;
use App\Http\Controllers\Api\AdminSubmissionController;
use App\Http\Controllers\Api\AuthController; 
use App\Http\Controllers\Api\AdminProfileController; 
use App\Http\Controllers\Api\AdministratorController; 
use App\Http\Controllers\Api\PublicContactController;
use App\Http\Controllers\Api\MentorNoteController;

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

// Endpoint aman untuk mengambil semua data submission setelah verifikasi Magic Link
Route::get('portal/pengajuan', [StudentSubmissionController::class, 'getSubmissionsForPortal']);

// Endpoint GET kontak
Route::get('/contact-info', [PublicContactController::class, 'getContactInfo']);


// =========================================================================
// RUTE ADMIN (WAJIB AUTHENTIKASI)
// =========================================================================

Route::prefix('admin')->group(function () {
    
    // Rute Otentikasi (PUBLIC)
    Route::post('login', [AuthController::class, 'login']); 

    // RUTE LUPA PASSWORD (PUBLIC)
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);

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
        
        // DELETE /api/admin/pengajuan/{id}: Menghapus pengajuan
        Route::delete('pengajuan/{id}', [AdminSubmissionController::class, 'destroy']);

        // Pengelolaan Profil Admin Sendiri
        Route::get('profile', [AdminProfileController::class, 'show']);
        Route::put('profile', [AdminProfileController::class, 'update']);
        Route::put('profile/password', [AdminProfileController::class, 'updatePassword']);

        // Daftar Semua Admin (untuk dropdown)
        Route::get('administrators', [AdministratorController::class, 'index']);
        Route::put('administrators/{id}/set-primary-contact', [AdministratorController::class, 'setPrimaryContact']);

        // Rute untuk Halaman Pembimbing (CRUD Catatan Magang)
        // Ini akan membuat:
        // GET /api/admin/mentor-notes -> index()
        // POST /api/admin/mentor-notes -> store()
        // GET /api/admin/mentor-notes/{id} -> show()
        // DELETE /api/admin/mentor-notes/{id} -> destroy()
        Route::apiResource('mentor-notes', MentorNoteController::class);
    });
});
