<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'age',
        'weight',
        'height',
        'plan',
        'status',
        'last_visit',
        'address',
        'city',
        'state',
        'zip',
    ];

    protected $casts = [
        'age' => 'integer',
        'last_visit' => 'date',
    ];

    protected $table = 'clientes';
}
