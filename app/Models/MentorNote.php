<?php

    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;
    use Illuminate\Support\Facades\Storage; // [BARU] Untuk URL file

    class MentorNote extends Model
    {
        use HasFactory;

        protected $table = 'mentor_notes';

        protected $guarded = ['id']; // Izinkan mass assignment

        /**
         * [BARU] Accessor untuk mendapatkan URL publik file disposisi.
         * Ini akan membuat 'disposition_file_url' tersedia di API respons.
         */
        protected $appends = ['disposition_file_url'];

        public function getDispositionFileUrlAttribute()
        {
            // Pastikan Anda sudah menjalankan 'php artisan storage:link'
            if ($this->disposition_file_path) {
                return Storage::url($this->disposition_file_path);
            }
            // Gambar placeholder jika file tidak ada
            return asset('https.via.placeholder.com/300x180.png?text=No+Image');
        }

        /**
         * Relasi Many-to-One: Catatan ini milik satu Administrator (Pembimbing).
         */
        public function administrator()
        {
            return $this->belongsTo(Administrator::class);
        }
    }