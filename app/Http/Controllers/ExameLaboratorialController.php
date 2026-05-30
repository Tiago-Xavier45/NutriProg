<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\ExameLaboratorial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExameLaboratorialController extends Controller
{
    public function index(Request $request): Response
    {
        $team      = $request->user()->currentTeam;
        $clienteId = $request->route('cliente_id');

        $cliente = Cliente::query()->forTeam($team)->findOrFail((int) $clienteId);

        $exames = ExameLaboratorial::where('cliente_id', $cliente->id)
            ->orderBy('data_exame', 'desc')
            ->get()
            ->map(fn ($e) => [
                'id'                 => $e->id,
                'data'               => $e->data_exame->format('d/m/Y'),
                'dataRaw'            => $e->data_exame->format('Y-m-d'),
                'glicemiaJejum'      => $e->glicemia_jejum,
                'hemoglobinaGlicada' => $e->hemoglobina_glicada,
                'colesterolTotal'    => $e->colesterol_total,
                'colesterolLdl'      => $e->colesterol_ldl,
                'colesterolHdl'      => $e->colesterol_hdl,
                'triglicerideos'     => $e->triglicerideos,
                'hemoglobina'        => $e->hemoglobina,
                'hematocrito'        => $e->hematocrito,
                'ferritina'          => $e->ferritina,
                'vitaminaD'          => $e->vitamina_d,
                'vitaminaB12'        => $e->vitamina_b12,
                'acidoFolico'        => $e->acido_folico,
                'zinco'              => $e->zinco,
                'magnesio'           => $e->magnesio,
                'creatinina'         => $e->creatinina,
                'ureia'              => $e->ureia,
                'tgo'                => $e->tgo,
                'tgp'                => $e->tgp,
                'tsh'                => $e->tsh,
                't4Livre'            => $e->t4_livre,
                'observacoes'        => $e->observacoes,
            ]);

        return Inertia::render('exames', [
            'cliente' => [
                'id'   => $cliente->id,
                'name' => $cliente->name,
            ],
            'exames'     => $exames,
            'referencias' => ExameLaboratorial::referencias(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $team      = $request->user()->currentTeam;
        $clienteId = $request->route('cliente_id');

        $cliente = Cliente::query()->forTeam($team)->findOrFail((int) $clienteId);

        $validated = $request->validate([
            'data_exame'          => 'required|date',
            'glicemia_jejum'      => 'nullable|numeric|min:0',
            'hemoglobina_glicada' => 'nullable|numeric|min:0',
            'colesterol_total'    => 'nullable|numeric|min:0',
            'colesterol_ldl'      => 'nullable|numeric|min:0',
            'colesterol_hdl'      => 'nullable|numeric|min:0',
            'triglicerideos'      => 'nullable|numeric|min:0',
            'hemoglobina'         => 'nullable|numeric|min:0',
            'hematocrito'         => 'nullable|numeric|min:0',
            'ferritina'           => 'nullable|numeric|min:0',
            'vitamina_d'          => 'nullable|numeric|min:0',
            'vitamina_b12'        => 'nullable|numeric|min:0',
            'acido_folico'        => 'nullable|numeric|min:0',
            'zinco'               => 'nullable|numeric|min:0',
            'magnesio'            => 'nullable|numeric|min:0',
            'creatinina'          => 'nullable|numeric|min:0',
            'ureia'               => 'nullable|numeric|min:0',
            'tgo'                 => 'nullable|numeric|min:0',
            'tgp'                 => 'nullable|numeric|min:0',
            'tsh'                 => 'nullable|numeric|min:0',
            't4_livre'            => 'nullable|numeric|min:0',
            'observacoes'         => 'nullable|string',
        ]);

        ExameLaboratorial::create([...$validated, 'cliente_id' => $cliente->id]);

        return redirect()->back()->with('success', 'Exame registrado com sucesso!');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $team        = $request->user()->currentTeam;
        $clienteId   = $request->route('cliente_id');
        $exameId     = $request->route('exame_id');

        $cliente = Cliente::query()->forTeam($team)->findOrFail((int) $clienteId);

        ExameLaboratorial::where('cliente_id', $cliente->id)
            ->findOrFail((int) $exameId)
            ->delete();

        return redirect()->back()->with('success', 'Exame excluído com sucesso!');
    }
}