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
            $table->dropColumn(['start_date', 'end_date', 'submission_date']);
            $table->string('durasi_magang', 100)->after('unique_token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('submissions', function (Blueprint $table) {
            $table->date('start_date');
            $table->date('end_date');
            $table->timestamp('submission_date')->nullable();

            $table->dropColumn('durasi_magang');
        });
    }
};
