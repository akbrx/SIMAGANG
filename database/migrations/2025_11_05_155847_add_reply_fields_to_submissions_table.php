<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->string('bidang_penempatan')->nullable()->after('status');
            $table->string('nama_pembimbing')->nullable()->after('bidang_penempatan');
            $table->string('kontak_pembimbing')->nullable()->after('nama_pembimbing');
            $table->string('surat_balasan')->nullable()->after('admin_notes'); // Untuk menyimpan path file balasan
        });
    }

    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->dropColumn([
                'bidang_penempatan',
                'nama_pembimbing',
                'kontak_pembimbing',
                'surat_balasan',
            ]);
        });
    }
};