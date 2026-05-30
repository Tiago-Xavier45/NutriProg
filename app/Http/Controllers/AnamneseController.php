<?php

namespace App\Http\Controllers;

use App\Models\Anamnese;
use App\Models\Cliente;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnamneseController extends Controller
{
    public function show(Request $request): Response
    {
        $team      = $request->user()->currentTeam;
        $clienteId = $request->route('cliente_id');

        $cliente = Cliente::query()->forTeam($team)->findOrFail((int) $clienteId);
        $anamnese = Anamnese::where('cliente_id', $cliente->id)->first();

        return Inertia::render('anamnese', [
            'cliente'  => [
                'id'     => $cliente->id,
                'name'   => $cliente->name,
                'age'    => $cliente->age,
                'weight' => $cliente->weight,
                'height' => $cliente->height,
            ],
            'anamnese' => $anamnese,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $team      = $request->user()->currentTeam;
        $clienteId = $request->route('cliente_id');

        $cliente = Cliente::query()->forTeam($team)->findOrFail((int) $clienteId);

        $validated = $request->validate([
            'sexo'                       => 'nullable|in:masculino,feminino,outro',
            'nivel_atividade'            => 'nullable|in:sedentario,levemente_ativo,moderadamente_ativo,muito_ativo,extremamente_ativo',
            'doencas_preexistentes'      => 'nullable|string',
            'medicamentos'               => 'nullable|string',
            'alergias_alimentares'       => 'nullable|string',
            'intolerâncias'              => 'nullable|string',
            'historico_familiar'         => 'nullable|string',
            'rotina_alimentar'           => 'nullable|string',
            'alimentos_preferidos'       => 'nullable|string',
            'alimentos_nao_gosta'        => 'nullable|string',
            'refeicoes_por_dia'          => 'nullable|integer|min:1|max:10',
            'atividade_fisica_descricao' => 'nullable|string',
            'horas_sono'                 => 'nullable|integer|min:1|max:24',
            'nivel_estresse'             => 'nullable|string',
            'objetivo_tratamento'        => 'nullable|string',
            'observacoes'                => 'nullable|string',
            'tmb'                        => 'nullable|numeric',
            'get'                        => 'nullable|numeric',
            'meta_calorica'              => 'nullable|numeric',
            'meta_proteina'              => 'nullable|numeric',
            'meta_carboidrato'           => 'nullable|numeric',
            'meta_gordura'               => 'nullable|numeric',
        ]);

        // Calcula TMB/GET automaticamente se tiver os dados
        if (
            !empty($validated['sexo']) &&
            !empty($validated['nivel_atividade']) &&
            $cliente->age &&
            $cliente->weight &&
            $cliente->height
        ) {
            $peso   = (float) $cliente->weight;
            $altura = (float) str_replace(',', '.', $cliente->height);
            $idade  = (int) $cliente->age;

            $tmb = Anamnese::calcularTMB($peso, $altura, $idade, $validated['sexo']);
            $get = Anamnese::calcularGET($tmb, $validated['nivel_atividade']);

            $validated['tmb'] = $tmb;
            $validated['get'] = $get;

            // Distribuição padrão de macros baseada no objetivo
            $metaCalorica = $validated['meta_calorica'] ?? $get;
            $validated['meta_calorica']    = $metaCalorica;
            $validated['meta_proteina']    = round(($metaCalorica * 0.25) / 4, 1); // 25% proteína
            $validated['meta_carboidrato'] = round(($metaCalorica * 0.50) / 4, 1); // 50% carb
            $validated['meta_gordura']     = round(($metaCalorica * 0.25) / 9, 1); // 25% gordura
        }

        Anamnese::updateOrCreate(
            ['cliente_id' => $cliente->id],
            [...$validated, 'cliente_id' => $cliente->id]
        );

        return redirect()->back()->with('success', 'Anamnese salva com sucesso!');
    }
}