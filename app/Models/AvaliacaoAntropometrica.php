<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AvaliacaoAntropometrica extends Model
{
    use HasFactory;

    protected $table = 'avaliacoes_antropometricas';

    protected $fillable = [
        'cliente_id',
        'data_avaliacao',
        'peso',
        'altura',
        'imc',
        'percentual_gordura',
        'massa_gorda',
        'massa_magra',
        'percentual_massa_muscular',
        'circ_abdominal',
        'circ_quadril',
        'circ_braco',
        'circ_coxa',
        'rcq',
        'dobra_tricipital',
        'dobra_subescapular',
        'dobra_abdominal',
        'dobra_suprailiaca',
        'dobra_coxa',
        'observacoes',
    ];

    protected $casts = [
        'data_avaliacao'           => 'date',
        'peso'                     => 'float',
        'altura'                   => 'float',
        'imc'                      => 'float',
        'percentual_gordura'       => 'float',
        'massa_gorda'              => 'float',
        'massa_magra'              => 'float',
        'percentual_massa_muscular'=> 'float',
        'circ_abdominal'           => 'float',
        'circ_quadril'             => 'float',
        'circ_braco'               => 'float',
        'circ_coxa'                => 'float',
        'rcq'                      => 'float',
        'dobra_tricipital'         => 'float',
        'dobra_subescapular'       => 'float',
        'dobra_abdominal'          => 'float',
        'dobra_suprailiaca'        => 'float',
        'dobra_coxa'               => 'float',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    // Calcula IMC automaticamente
    public static function calcularImc(float $peso, float $altura): float
    {
        if ($altura <= 0) return 0;
        return round($peso / ($altura * $altura), 2);
    }

    // Classificação IMC
    public static function classificarImc(float $imc): string
    {
        return match(true) {
            $imc < 18.5 => 'Abaixo do peso',
            $imc < 25.0 => 'Peso normal',
            $imc < 30.0 => 'Sobrepeso',
            $imc < 35.0 => 'Obesidade grau I',
            $imc < 40.0 => 'Obesidade grau II',
            default     => 'Obesidade grau III',
        };
    }
}