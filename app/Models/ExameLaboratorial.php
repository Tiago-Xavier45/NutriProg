<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExameLaboratorial extends Model
{
    protected $table = 'exames_laboratoriais';

    protected $fillable = [
        'cliente_id', 'data_exame',
        'glicemia_jejum', 'hemoglobina_glicada',
        'colesterol_total', 'colesterol_ldl', 'colesterol_hdl', 'triglicerideos',
        'hemoglobina', 'hematocrito', 'ferritina',
        'vitamina_d', 'vitamina_b12', 'acido_folico', 'zinco', 'magnesio',
        'creatinina', 'ureia', 'tgo', 'tgp',
        'tsh', 't4_livre', 'observacoes',
    ];

    protected $casts = [
        'data_exame' => 'date',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    // Referências normais para alertas visuais
    public static function referencias(): array
    {
        return [
            'glicemia_jejum'      => ['min' => 70,  'max' => 99,   'unidade' => 'mg/dL'],
            'hemoglobina_glicada' => ['min' => 0,   'max' => 5.7,  'unidade' => '%'],
            'colesterol_total'    => ['min' => 0,   'max' => 190,  'unidade' => 'mg/dL'],
            'colesterol_ldl'      => ['min' => 0,   'max' => 130,  'unidade' => 'mg/dL'],
            'colesterol_hdl'      => ['min' => 40,  'max' => 999,  'unidade' => 'mg/dL'],
            'triglicerideos'      => ['min' => 0,   'max' => 150,  'unidade' => 'mg/dL'],
            'vitamina_d'          => ['min' => 30,  'max' => 100,  'unidade' => 'ng/mL'],
            'tsh'                 => ['min' => 0.4, 'max' => 4.0,  'unidade' => 'mUI/L'],
        ];
    }
}