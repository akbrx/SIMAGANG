<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            // Kolom Hubungan (Foreign Keys)
            // Menghubungkan pengajuan ke mahasiswa yang mengajukan
            $table->foreignId('student_id')
                  ->constrained('students') 
                  ->onDelete('cascade'); 
            
            // Kolom Utama untuk Tracking
            $table->string('unique_token')->unique()->comment('Token untuk melacak status surat');
            
            $table->date('start_date');
            $table->date('end_date');
            $table->string('submission_file'); // Path/nama file surat yang di-upload (misalnya: 'surat/token_unik.pdf')
            $table->date('submission_date');
            
            // Kolom Status (Tracking)
            $table->enum('status', ['pending', 'diproses', 'diterima', 'ditolak'])->default('pending');
            $table->text('admin_notes')->nullable()->comment('Catatan/Alasan dari Admin');

            // Kolom Siapa yang Memproses (Opsional, untuk audit)
            $table->unsignedBigInteger('processed_by')->nullable()->comment('ID admin yang terakhir memproses');

// Kemudian, definisikan Foreign Key secara terpisah di bawahnya:
            $table->foreign('processed_by')
                    ->references('id')->on('administrators')
                    ->onDelete('set null');
            $table->timestamp('processed_at')->nullable(); // Kapan terakhir diproses
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
