<?php

use App\Http\Controllers\Api\StudentSubmissionController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('app'); // 'app' adalah nama file app.blade.php
});

Route::get('/admin', function () {
    return view('admin');
});

// Rute ini HANYA untuk memverifikasi magic link dan me-redirect ke frontend
Route::get('/verify-submission-link', [StudentSubmissionController::class, 'verifyLinkAndRedirect'])
    ->name('submission.verify-link') // Beri nama untuk dipanggil
    ->middleware('signed');         // WAJIB, untuk keamanan