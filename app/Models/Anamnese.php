<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Anamnese extends Model
{
    protected $table = 'anamneses';

    protected $fillable = [
        'cliente_id', 'sexo', 'nivel_atividade',
        'doencas_preexistentes', 'medicamentos', 'alergias_alimentares',
        'intolerâncias', 'historico_familiar', 'rotina_alimentar',
        'alimentos_preferidos', 'alimentos_nao_gosta', 'refeicoes_por_dia',
        'atividade_fisica_descricao', 'horas_sono', 'nivel_estresse',
        'objetivo_tratamento', 'observacoes',
        'tmb', 'get', 'meta_calorica',
        'meta_proteina', 'meta_carboidrato', 'meta_gordura',
    ];

    protected $casts = [
        'tmb'            => 'float',
        'get'            => 'float',
        'meta_calorica'  => 'float',
        'meta_proteina'  => 'float',
        'meta_carboidrato' => 'float',
        'meta_gordura'   => 'float',
        'refeicoes_por_dia' => 'integer',
        'horas_sono'     => 'integer',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    // Fatores de atividade física
    public static function fatorAtividade(string $nivel): float
    {
        return match($nivel) {
            'sedentario'            => 1.2,
            'levemente_ativo'       => 1.375,
            'moderadamente_ativo'   => 1.55,
            'muito_ativo'           => 1.725,
            'extremamente_ativo'    => 1.9,
            default                 => 1.2,
        };
    }

    // Mifflin-St Jeor
    public static function calcularTMB(
        float $peso, float $altura, int $idade, string $sexo
    ): float {
        $alturaC = $altura * 100; // converte metros para cm
        if ($sexo === 'masculino') {
            return round((10 * $peso) + (6.25 * $alturaC) - (5 * $idade) + 5, 2);
        }
        return round((10 * $peso) + (6.25 * $alturaC) - (5 * $idade) - 161, 2);
    }

    public static function calcularGET(float $tmb, string $nivelAtividade): float
    {
        return round($tmb * self::fatorAtividade($nivelAtividade), 2);
    }
}