<?php

    namespace App\Http\Controllers\Api;

    use App\Http\Controllers\Controller;
    use App\Models\MentorNote;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Auth;
    use Illuminate\Support\Facades\Storage;
    use Illuminate\Support\Facades\Validator;

    class MentorNoteController extends Controller
    {
        /**
         * [GET] Menampilkan daftar catatan HANYA milik pembimbing yang login.
         */
        public function index(Request $request)
        {
            // Ambil catatan milik admin (pembimbing) yang sedang login
            $notes = $request->user()->mentorNotes()->latest()->get();
            
            return response()->json([
                'success' => true,
                'data' => $notes
            ]);
        }

        /**
         * [POST] Menyimpan catatan baru milik pembimbing yang login.
         */
        public function store(Request $request)
        {
            $validator = Validator::make($request->all(), [
                'student_name' => 'required|string|max:255',
                'disposition_file' => 'required|image|mimes:jpeg,png,jpg|max:2048', // Maks 2MB
                'notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
            }

            // 1. Upload file
            $filePath = $request->file('disposition_file')->store('dispositions', 'public');
            $originalName = $request->file('disposition_file')->getClientOriginalName();

            // 2. Buat catatan baru, hubungkan ke admin yang login
            $note = $request->user()->mentorNotes()->create([
                'student_name' => $request->student_name,
                'disposition_file_path' => $filePath,
                'original_filename' => $originalName,
                'notes' => $request->notes,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Catatan berhasil disimpan.',
                'data' => $note // Kirim data baru kembali
            ], 201); // 201 = Created
        }

        /**
         * [GET - Opsional] Menampilkan detail satu catatan (bisa digabung di index).
         */
        public function show(Request $request, MentorNote $mentorNote)
        {
             // Pastikan pembimbing hanya bisa lihat catatannya sendiri
            if ($request->user()->id !== $mentorNote->administrator_id) {
                return response()->json(['success' => false, 'message' => 'Tidak diizinkan'], 403);
            }
            return response()->json(['success' => true, 'data' => $mentorNote]);
        }

        /**
         * [PUT/PATCH] Memperbarui catatan yang sudah ada.
         */
        public function update(Request $request, MentorNote $mentorNote)
        {
            // 1. Verifikasi kepemilikan
            if ($request->user()->id !== $mentorNote->administrator_id) {
                return response()->json(['success' => false, 'message' => 'Tidak diizinkan'], 403);
            }

            // 2. [PERBAIKAN] Validasi HANYA field 'notes'
            $validator = Validator::make($request->all(), [
                'notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
            }

            // 3. Update HANYA data 'notes'
            $mentorNote->notes = $request->notes;

            // 4. [DIHAPUS] Logika update file dan nama dihapus dari sini

            $mentorNote->save();
            $mentorNote->refresh(); // Muat ulang data (termasuk accessor URL)

            return response()->json([
                'success' => true,
                'message' => 'Catatan berhasil diperbarui.',
                'data' => $mentorNote
            ]);
        }

        /**
         * [DELETE] Menghapus catatan milik pembimbing yang login.
         */
        public function destroy(Request $request, MentorNote $mentorNote)
        {
            if ($request->user()->id !== $mentorNote->administrator_id) {
                return response()->json(['success' => false, 'message' => 'Tidak diizinkan'], 403);
            }

            if ($mentorNote->disposition_file_path) {
                Storage::disk('public')->delete($mentorNote->disposition_file_path);
            }
            $mentorNote->delete();

            return response()->json([
                'success' => true,
                'message' => 'Catatan berhasil dihapus.'
            ]);
        }
    }