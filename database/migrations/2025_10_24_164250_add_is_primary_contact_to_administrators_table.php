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
            // Tambahkan kolom boolean baru, defaultnya false (tidak), bisa null
            $table->boolean('is_primary_contact')->nullable()->default(false)->after('phone_number');
            // Tambahkan index untuk pencarian yang lebih cepat (opsional tapi bagus)
            $table->index('is_primary_contact');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('administrators', function (Blueprint $table) {
            $table->dropIndex(['is_primary_contact']); // Hapus index dulu
            $table->dropColumn('is_primary_contact'); // Hapus kolomnya
        });
    }
};