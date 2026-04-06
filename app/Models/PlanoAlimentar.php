<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PlanoAlimentar extends Model
{
    use HasFactory;

    protected $table = 'planos_alimentares';

    protected $fillable = [
        'cliente_id',
        'nome',
        'calorias',
        'objetivo',
        'restricoes',
        'observacoes',
        'status',
    ];

    protected $casts = [
        'restricoes' => 'array',
        'calorias' => 'integer',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    public function refeicoes(): HasMany
    {
        return $this->hasMany(Refeicao::class)->orderBy('ordem');
    }
}
