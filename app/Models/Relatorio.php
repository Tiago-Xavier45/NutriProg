<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Relatorio extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'tipo',
        'periodo',
        'dados',
    ];

    protected $casts = [
        'dados' => 'array',
    ];
}
