<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Submission;
use Illuminate\Support\Facades\Validator;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\SubmissionResource;
use App\Models\Submission as SubmissionModel;


class AdminSubmissionController extends Controller
{
    // Daftar status yang valid (untuk validasi)
    private $validStatuses = ['DIAJUKAN', 'DISPOSISI', 'DITERIMA', 'DITOLAK'];

    /**
     * [Endpoint GET /api/admin/submissions]
     * Menampilkan daftar semua pengajuan.
     */
    public function index(Request $request)
    {
        // Ambil semua submission, urutkan berdasarkan tanggal terbaru, dan ambil data student.
        $submissions = Submission::with(['student', 'processor'])
            ->latest() // Urutkan dari yang terbaru
            ->paginate(15); // Gunakan paginate agar tidak memberatkan server

        return response()->json([
            'success' => true,
            'data' => $submissions
        ]);
    }

    /**
     * [Endpoint PUT /api/admin/submissions/{id}]
     * Mengubah status pengajuan oleh Admin.
     */
    public function update(Request $request, $id)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:DIAJUKAN,DISPOSISI,DITERIMA,DITOLAK',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        // 2. Ambil data admin yang sedang login
        $admin = $request->user();

        // 3. Cari data pengajuan
        $submission = Submission::find($id);
        if (!$submission) {
            return response()->json(['success' => false, 'message' => 'Data pengajuan tidak ditemukan.'], 404);
        }   

        // 4. --- LOGIKA TIMESTAMP YANG BARU DAN LEBIH AKURAT ---

        // A. Catat waktu akses pertama (hanya jika belum pernah diakses)
        // Ini berjalan jika status awal adalah 'DIAJUKAN' dan diubah ke status lain.
        if (is_null($submission->first_accessed_at) && $submission->status === 'DIAJUKAN' && $request->status !== 'DIAJUKAN') {
            $submission->first_accessed_at = now();
        }
        
        // B. Selalu update status, catatan, dan siapa yang terakhir memproses
        $submission->status = $request->status;
        $submission->admin_notes = $request->admin_notes;
        $submission->processed_by = $admin->id;

        // C. Atur timestamp spesifik untuk setiap status
        switch ($request->status) {
            case 'DISPOSISI':
                $submission->processed_at = now();
                // Reset timestamp final jika status diubah kembali ke Disposisi
                $submission->accepted_at = null;
                $submission->rejected_at = null;
                break;
            case 'DITERIMA':
                $submission->accepted_at = now();
                $submission->rejected_at = null;
                break;
            case 'DITOLAK':
                $submission->rejected_at = now();
                $submission->accepted_at = null;
                break;
            case 'DIAJUKAN':
                // Jika status dikembalikan ke awal, JANGAN reset first_accessed_at
                // Cukup reset timestamp proses lainnya
                $submission->processed_at = null;
                $submission->accepted_at = null;
                $submission->rejected_at = null;
                $submission->processed_by = null;
                break;
        }
        
        $submission->save();
        $submission->load(['student', 'processor']);
        
        // 5. Berikan response sukses (Tetap sama)
        return response()->json([
            'success' => true,
            'message' => 'Status pengajuan berhasil diperbarui.',
            'data' => new SubmissionResource($submission),
        ]);
    }
    public function downloadFile(Request $request, $id)
    {
        // 1. Cari data pengajuan berdasarkan ID
        $submission = Submission::find($id);

        // 2. Jika data pengajuan tidak ditemukan, kirim response 404
        if (!$submission) {
            return response()->json([
                'success' => false,
                'message' => 'Data pengajuan tidak ditemukan.',
            ], 404);
        }

        // 3. Cek apakah ada file yang tercatat di database dan file fisiknya ada di storage
        if (!$submission->submission_file || !Storage::disk('public')->exists($submission->submission_file)) {
            return response()->json([
                'success' => false,
                'message' => 'File untuk pengajuan ini tidak ditemukan di server.',
            ], 404);
        }

        // 4. Jika file ada, buat URL yang bisa diakses publik
        //    Pastikan kamu sudah menjalankan 'php artisan storage:link'
        $fileUrl = asset('storage/' . $submission->submission_file);

        // 5. Kirim response sukses berisi URL file
        return response()->json([
            'success' => true,
            'message' => 'URL file berhasil didapatkan.',
            'file_url' => $fileUrl,
        ]);
    }
    /**
     * [Endpoint DELETE /api/admin/submissions/{id}]
     * Menghapus data pengajuan secara permanen.
     */
    public function destroy($id)
    {
        // 1. Cari data pengajuan
        $submission = Submission::find($id);

        // 2. Jika data pengajuan tidak ditemukan, kirim response 404
        if (!$submission) {
            return response()->json([
                'success' => false,
                'message' => 'Data pengajuan tidak ditemukan.',
            ], 404);
        }

        try {
            // 3. Simpan path file untuk dihapus nanti
            $filePath = $submission->submission_file;

            // 4. Hapus data dari database
            $submission->delete();

            // 5. Hapus file fisik dari storage SETELAH data db berhasil dihapus
            // Ini untuk mencegah file terhapus jika proses hapus database gagal.
            if ($filePath && Storage::disk('public')->exists($filePath)) {
                Storage::disk('public')->delete($filePath);
            }

            // 6. Kirim response sukses
            return response()->json([
                'success' => true,
                'message' => 'Data pengajuan berhasil dihapus.'
            ], 200);

        } catch (Exception $e) {
            // 7. Tangani jika ada error server (misal: error database)
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menghapus data.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}