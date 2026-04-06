<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Alimento extends Model
{
    use HasFactory;

    protected $fillable = [
        'refeicao_id',
        'nome',
        'porcao',
        'calorias',
    ];

    protected $casts = [
        'calorias' => 'integer',
    ];

    public function refeicao(): BelongsTo
    {
        return $this->belongsTo(Refeicao::class);
    }
}
