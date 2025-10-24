<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Submission;
use Carbon\Carbon;

class Student extends Model
{
    use HasFactory;
    protected $guarded = [
        'id',
    ];
    protected $casts = [
        'created_at'      => 'datetime:d F Y H:i', // Ini untuk created_at
        'updated_at'      => 'datetime:d F Y H:i',
    ];
    protected function serializeDate(\DateTimeInterface $date)
    {
        return Carbon::parse($date)->setTimezone(config('app.timezone'))->format('d F Y H:i');
    }
    
    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
}
