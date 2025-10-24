<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Student;
use Carbon\Carbon;

class Submission extends Model
{
    use HasFactory;

    // Tambahkan kolom yang bisa diisi
    protected $guarded = [
        'id',
    ];

    protected $casts = [
        'processed_at'  => 'datetime',
        'created_at'    => 'datetime',
        'updated_at'    => 'datetime',
        'accepted_at'   => 'datetime',
        'rejected_at'   => 'datetime',
        'first_accessed_at' => 'datetime',
    ];

    public function processor()
    {
        // Parameter kedua ('processed_by') adalah nama foreign key di tabel submissions.
        return $this->belongsTo(Administrator::class, 'processed_by');
    }
    
    protected function serializeDate(\DateTimeInterface $date)
    {
        return Carbon::parse($date)->setTimezone(config('app.timezone'))->format('d F Y H:i');
    }



    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
