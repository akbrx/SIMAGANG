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
        Schema::create('mentor_notes', function (Blueprint $table) {
            $table->id();
            // Kunci Asing: Catatan ini milik admin (pembimbing) mana
            $table->foreignId('administrator_id')
                    ->constrained('administrators')
                    ->onDelete('cascade'); // Jika admin dihapus, catatannya juga terhapus
            
            $table->string('student_name'); // Nama anak magang
            $table->string('disposition_file_path'); // Path ke file gambar disposisi
            $table->string('original_filename')->nullable(); // Nama asli file
            $table->text('notes')->nullable(); // Catatan (opsional)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mentor_notes');
    }
};