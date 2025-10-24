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
        Schema::table('submissions', function (Blueprint $table) {
            // Mengubah kolom 'status' menjadi tipe ENUM dengan nilai yang kita inginkan
            // Kita juga set default value-nya menjadi 'DIAJUKAN'
            $table->enum('status', ['DIAJUKAN', 'DISPOSISI', 'DITERIMA', 'DITOLAK'])
                  ->default('DIAJUKAN')
                  ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            // Jika ingin rollback, kembalikan ke tipe string biasa
            // Perhatian: Ini bisa menyebabkan kehilangan data jika status sudah diubah
            $table->string('status')->default('pending')->change();
        });
    }
};
