<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'path',
        'metadata',
        'cover_image',
        'user_data',
    ];

    protected $casts = [
        'metadata' => 'array',
        'user_data' => 'array',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
