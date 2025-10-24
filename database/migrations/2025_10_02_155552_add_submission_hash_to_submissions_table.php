<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            // Tambahkan kolom untuk menyimpan hash, buat dia bisa null dan unik
            // Bisa unik agar database juga memberikan lapisan perlindungan dari duplikasi
            $table->string('submission_hash')->after('unique_token')->nullable()->unique();
        });
    }

    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropColumn('submission_hash');
        });
    }
};