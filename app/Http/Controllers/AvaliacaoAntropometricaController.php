<?php

namespace App\Http\Controllers;

use App\Models\AvaliacaoAntropometrica;
use App\Models\Cliente;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AvaliacaoAntropometricaController extends Controller
{
    public function index(Request $request): Response
    {
        $team      = $request->user()->currentTeam;
        $clienteId = $request->route('cliente_id');

        $cliente = Cliente::query()
            ->forTeam($team)
            ->findOrFail((int) $clienteId);

        $avaliacoes = AvaliacaoAntropometrica::where('cliente_id', $cliente->id)
            ->orderBy('data_avaliacao', 'asc')
            ->get()
            ->map(fn ($a) => [
                'id'                        => $a->id,
                'data'                      => $a->data_avaliacao->format('d/m/Y'),
                'dataRaw'                   => $a->data_avaliacao->format('Y-m-d'),
                'peso'                      => $a->peso,
                'altura'                    => $a->altura,
                'imc'                       => $a->imc,
                'imcClassificacao'          => $a->imc ? AvaliacaoAntropometrica::classificarImc($a->imc) : null,
                'percentualGordura'         => $a->percentual_gordura,
                'massaGorda'                => $a->massa_gorda,
                'massaMagra'                => $a->massa_magra,
                'percentualMassaMuscular'   => $a->percentual_massa_muscular,
                'circAbdominal'             => $a->circ_abdominal,
                'circQuadril'               => $a->circ_quadril,
                'circBraco'                 => $a->circ_braco,
                'circCoxa'                  => $a->circ_coxa,
                'rcq'                       => $a->rcq,
                'dobraTricipital'           => $a->dobra_tricipital,
                'dobraSubescapular'         => $a->dobra_subescapular,
                'dobraAbdominal'            => $a->dobra_abdominal,
                'dobraSuprailiaca'          => $a->dobra_suprailiaca,
                'dobraCoxa'                 => $a->dobra_coxa,
                'observacoes'               => $a->observacoes,
            ]);

        return Inertia::render('avaliacoes', [
            'cliente'    => [
                'id'     => $cliente->id,
                'name'   => $cliente->name,
                'age'    => $cliente->age,
                'weight' => $cliente->weight,
                'height' => $cliente->height,
            ],
            'avaliacoes' => $avaliacoes,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $team      = $request->user()->currentTeam;
        $clienteId = $request->route('cliente_id');

        $cliente = Cliente::query()
            ->forTeam($team)
            ->findOrFail((int) $clienteId);

        $validated = $request->validate([
            'data_avaliacao'            => 'required|date',
            'peso'                      => 'nullable|numeric|min:1|max:500',
            'altura'                    => 'nullable|numeric|min:0.5|max:3',
            'percentual_gordura'        => 'nullable|numeric|min:0|max:100',
            'massa_gorda'               => 'nullable|numeric|min:0',
            'massa_magra'               => 'nullable|numeric|min:0',
            'percentual_massa_muscular' => 'nullable|numeric|min:0|max:100',
            'circ_abdominal'            => 'nullable|numeric|min:0',
            'circ_quadril'              => 'nullable|numeric|min:0',
            'circ_braco'                => 'nullable|numeric|min:0',
            'circ_coxa'                 => 'nullable|numeric|min:0',
            'dobra_tricipital'          => 'nullable|numeric|min:0',
            'dobra_subescapular'        => 'nullable|numeric|min:0',
            'dobra_abdominal'           => 'nullable|numeric|min:0',
            'dobra_suprailiaca'         => 'nullable|numeric|min:0',
            'dobra_coxa'                => 'nullable|numeric|min:0',
            'observacoes'               => 'nullable|string',
        ]);

        // Calcula IMC automaticamente
        if (!empty($validated['peso']) && !empty($validated['altura'])) {
            $validated['imc'] = AvaliacaoAntropometrica::calcularImc(
                $validated['peso'],
                $validated['altura']
            );
        }

        // Calcula RCQ automaticamente
        if (!empty($validated['circ_abdominal']) && !empty($validated['circ_quadril'])) {
            $validated['rcq'] = round(
                $validated['circ_abdominal'] / $validated['circ_quadril'], 3
            );
        }

        AvaliacaoAntropometrica::create([
            ...$validated,
            'cliente_id' => $cliente->id,
        ]);

        return redirect()->back()->with('success', 'Avaliação registrada com sucesso!');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $team         = $request->user()->currentTeam;
        $clienteId    = $request->route('cliente_id');
        $avaliacaoId  = $request->route('avaliacao_id');

        $cliente = Cliente::query()
            ->forTeam($team)
            ->findOrFail((int) $clienteId);

        $avaliacao = AvaliacaoAntropometrica::where('cliente_id', $cliente->id)
            ->findOrFail((int) $avaliacaoId);

        $avaliacao->delete();

        return redirect()->back()->with('success', 'Avaliação excluída com sucesso!');
    }
}