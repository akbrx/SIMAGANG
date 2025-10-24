<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Submission;
use Laravel\Sanctum\HasApiTokens;

class Administrator extends Authenticatable
{
    use HasApiTokens, HasFactory;

    // Nama tabel di database
    protected $table = 'administrators'; 

    /**
     * Kolom yang dapat diisi secara massal (mass assignable).
     */
    protected $guarded = [
        'id',

    ];
    protected $casts = [
        'created_at'      => 'datetime:d F Y H:i', // Ini untuk created_at
        'updated_at'      => 'datetime:d F Y H:i',
    ];

    /**
     * Kolom yang harus disembunyikan saat serialisasi (misalnya saat diubah menjadi JSON).
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    
    /**
     * Relasi One-to-Many: Satu Admin memproses banyak Submission.
     */
    public function processedSubmissions()
    {
        // processed_by adalah foreign key di tabel submissions yang menunjuk ke admin
        return $this->hasMany(Submission::class, 'processed_by');
    }
}
