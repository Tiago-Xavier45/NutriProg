<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Refeicao extends Model
{
    use HasFactory;

    protected $table = 'refeicoes';

    protected $fillable = [
        'plano_alimentar_id',
        'nome',
        'horario',
        'ordem',
    ];

    protected $casts = [
        'ordem' => 'integer',
    ];

    public function planoAlimentar(): BelongsTo
    {
        return $this->belongsTo(PlanoAlimentar::class);
    }

    public function alimentos(): HasMany
    {
        return $this->hasMany(Alimento::class);
    }
}
