<?php
// app/Models/TacoAlimento.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TacoAlimento extends Model
{
    protected $table = 'taco_alimentos';

    protected $fillable = [
        'nome', 'categoria', 'porcao_padrao',
        'calorias', 'proteinas', 'carboidratos',
        'gorduras', 'fibras',
    ];
}   