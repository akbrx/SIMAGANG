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
        Schema::table('administrators', function (Blueprint $table) {
            // Tambahkan kolom role, default-nya 'admin' untuk pengguna yang sudah ada
            $table->string('role', 50)->default('admin')->after('phone_number');
            // 'admin' = bisa lihat semua
            // 'pembimbing' = hanya lihat halaman catatan
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('administrators', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
};
