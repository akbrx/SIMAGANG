<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Kolom yang dapat diisi secara massal (mass assignable).
     * Kolom 'email_verified_at' biasanya diurus oleh fitur verifikasi.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * Kolom yang harus disembunyikan saat serialisasi (misalnya saat diubah menjadi JSON).
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Casts untuk konversi tipe data otomatis.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'created_at' => 'datetime:d F Y H:i', 
        'updated_at' => 'datetime:d F Y H:i',
    ];
}
