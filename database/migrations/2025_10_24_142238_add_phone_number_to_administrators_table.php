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
        // Memberitahu Laravel untuk memodifikasi tabel 'administrators'
        Schema::table('administrators', function (Blueprint $table) {
            // Tambahkan kolom 'phone_number' setelah kolom 'email'
            // Tipe: string, panjang maks 20, boleh kosong (nullable)
            $table->string('phone_number', 20)->nullable()->after('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Memberitahu Laravel untuk memodifikasi tabel 'administrators'
        Schema::table('administrators', function (Blueprint $table) {
            // Hapus kolom 'phone_number' jika migrasi di-rollback
            $table->dropColumn('phone_number');
        });
    }
};
