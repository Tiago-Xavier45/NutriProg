<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Consulta extends Model
{
    use HasFactory;

    protected $fillable = [
        'cliente_id',
        'data',
        'horario',
        'duracao',
        'tipo',
        'status',
        'observacoes',
        'telefone',
    ];

    protected $casts = [
        'data' => 'date',
        'duracao' => 'integer',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }
}
