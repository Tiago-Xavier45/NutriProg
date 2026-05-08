<?php
// app/Http/Controllers/TacoAlimentoController.php

namespace App\Http\Controllers;

use App\Models\TacoAlimento;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TacoAlimentoController extends Controller
{
    public function buscar(Request $request): JsonResponse
    {
        $query = $request->get('q', '');

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $alimentos = TacoAlimento::where('nome', 'ilike', "%{$query}%")
            ->orderBy('nome')
            ->limit(10)
            ->get()
            ->map(fn ($a) => [
                'id'          => $a->id,
                'nome'        => $a->nome,
                'categoria'   => $a->categoria,
                'porcao'      => $a->porcao_padrao,
                'calorias'    => $a->calorias,
                'proteinas'   => $a->proteinas,
                'carboidratos'=> $a->carboidratos,
                'gorduras'    => $a->gorduras,
            ]);

        return response()->json($alimentos);
    }
}