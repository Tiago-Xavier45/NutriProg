<?php

namespace App\Http\Controllers;

use App\Models\Alimento;
use App\Models\Cliente;
use App\Models\PlanoAlimentar;
use App\Models\Refeicao;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PlanoAlimentarController extends Controller
{
    public function index(Request $request): Response
    {
        $team = $request->user()->currentTeam;

        $query = PlanoAlimentar::with(['cliente', 'refeicoes.alimentos'])
            ->whereHas('cliente', fn ($builder) => $builder->forTeam($team));

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('nome', 'like', "%{$search}%")
                    ->orWhereHas('cliente', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $planos = $query->orderBy('updated_at', 'desc')->get()->map(function (PlanoAlimentar $plano): array {
            return [
                'id' => $plano->id,
                'patientId' => $plano->cliente_id,
                'patientName' => $plano->cliente ? $plano->cliente->name : 'Paciente não encontrado',
                'planName' => $plano->nome,
                'calories' => $plano->calorias,
                'objective' => $plano->objetivo,
                'restrictions' => $plano->restricoes ?? [],
                'status' => $plano->status,
                'notes' => $plano->observacoes,
                'createdAt' => $plano->created_at->format('d/m/Y'),
                'updatedAt' => $plano->updated_at->format('d/m/Y'),
                'meals' => $plano->refeicoes->map(function (Refeicao $refeicao): array {
                    return [
                        'id' => $refeicao->id,
                        'name' => $refeicao->nome,
                        'time' => substr($refeicao->horario, 0, 5),
                        'foods' => $refeicao->alimentos->map(function (Alimento $alimento): array {
                            return [
                                'id' => $alimento->id,
                                'name' => $alimento->nome,
                                'portion' => $alimento->porcao,
                                'calories' => $alimento->calorias,
                            ];
                        }),
                    ];
                }),
            ];
        });

        $pacientes = Cliente::query()
            ->forTeam($team)
            ->orderBy('name')
            ->get()
            ->map(function (Cliente $cliente): array {
                return [
                    'id' => (string) $cliente->id,
                    'name' => $cliente->name,
                ];
            });

        return Inertia::render('planos', [
            'planos' => $planos,
            'pacientes' => $pacientes,
        ]);
    }

    public function duplicate(Request $request): RedirectResponse
{
    $team = $request->user()->currentTeam;
    $planoId = $request->route('plano_id') ?? $request->route('plano');

    $original = PlanoAlimentar::with(['refeicoes.alimentos'])
        ->whereHas('cliente', fn ($builder) => $builder->forTeam($team))
        ->findOrFail((int) $planoId);

    // Cria o plano duplicado
    $novo = PlanoAlimentar::create([
        'cliente_id'  => $original->cliente_id,
        'nome'        => $original->nome . ' (cópia)',
        'calorias'    => $original->calorias,
        'objetivo'    => $original->objetivo,
        'restricoes'  => $original->restricoes,
        'observacoes' => $original->observacoes,
        'status'      => 'inativo', // começa inativo para revisão
    ]);

    // Duplica refeições e alimentos
    foreach ($original->refeicoes as $refeicao) {
        $novaRefeicao = Refeicao::create([
            'plano_alimentar_id' => $novo->id,
            'nome'               => $refeicao->nome,
            'horario'            => $refeicao->horario,
            'ordem'              => $refeicao->ordem,
        ]);

        foreach ($refeicao->alimentos as $alimento) {
            Alimento::create([
                'refeicao_id' => $novaRefeicao->id,
                'nome'        => $alimento->nome,
                'porcao'      => $alimento->porcao,
                'calorias'    => $alimento->calorias,
            ]);
        }
    }

    return redirect()->back()->with('success', 'Plano duplicado com sucesso!');
}

    public function store(Request $request): RedirectResponse
    {
        $team = $request->user()->currentTeam;

        $validated = $request->validate([
            'cliente_id' => [
                'required',
                Rule::exists('clientes', 'id')->where('team_id', $team->id),
            ],
            'nome' => 'required|string|max:255',
            'calorias' => 'nullable|integer|min:500|max:10000',
            'objetivo' => 'nullable|string|max:255',
            'restricoes' => 'nullable|array',
            'observacoes' => 'nullable|string',
            'status' => 'nullable|in:ativo,inativo',
            'meals' => 'nullable|array',
            'meals.*.nome' => 'required_with:meals|string|max:255',
            'meals.*.horario' => 'required_with:meals',
            'meals.*.ordem' => 'nullable|integer',
            'meals.*.alimentos' => 'nullable|array',
            'meals.*.alimentos.*.nome' => 'required_with:meals.*.alimentos|string|max:255',
            'meals.*.alimentos.*.porcao' => 'nullable|string|max:100',
            'meals.*.alimentos.*.calorias' => 'nullable|integer|min:0',
        ]);

        $plano = PlanoAlimentar::create([
            'cliente_id' => $validated['cliente_id'],
            'nome' => $validated['nome'],
            'calorias' => $validated['calorias'] ?? 2000,
            'objetivo' => $validated['objetivo'] ?? null,
            'restricoes' => $validated['restricoes'] ?? [],
            'observacoes' => $validated['observacoes'] ?? null,
            'status' => $validated['status'] ?? 'ativo',
        ]);

        if (isset($validated['meals'])) {
            foreach ($validated['meals'] as $order => $meal) {
                $refeicao = Refeicao::create([
                    'plano_alimentar_id' => $plano->id,
                    'nome' => $meal['nome'],
                    'horario' => $meal['horario'],
                    'ordem' => $order,
                ]);

                if (isset($meal['alimentos'])) {
                    foreach ($meal['alimentos'] as $alimento) {
                        if (! empty($alimento['nome'])) {
                            Alimento::create([
                                'refeicao_id' => $refeicao->id,
                                'nome' => $alimento['nome'],
                                'porcao' => $alimento['porcao'] ?? null,
                                'calorias' => $alimento['calorias'] ?? 0,
                            ]);
                        }
                    }
                }
            }
        }

        return redirect()->back()->with('success', 'Plano alimentar criado com sucesso!');
    }

    public function update(Request $request): RedirectResponse
    {
        $team = $request->user()->currentTeam;
        $planoId = $request->route('plano_id') ?? $request->route('plano');
        $plano = PlanoAlimentar::query()
            ->whereHas('cliente', fn ($builder) => $builder->forTeam($team))
            ->find((int) $planoId);
        if (! $plano) {
            return redirect()->back()->with('error', 'Plano não encontrado');
        }

        $validated = $request->validate([
            'cliente_id' => [
                'sometimes',
                Rule::exists('clientes', 'id')->where('team_id', $team->id),
            ],
            'nome' => 'sometimes|string|max:255',
            'calorias' => 'nullable|integer|min:500|max:10000',
            'objetivo' => 'nullable|string|max:255',
            'restricoes' => 'nullable|array',
            'observacoes' => 'nullable|string',
            'status' => 'nullable|in:ativo,inativo',
            'meals' => 'nullable|array',
        ]);

        $plano->update($validated);

        if (isset($validated['meals'])) {
            $plano->refeicoes()->delete();

            foreach ($validated['meals'] as $order => $meal) {
                $refeicao = Refeicao::create([
                    'plano_alimentar_id' => $plano->id,
                    'nome' => $meal['nome'],
                    'horario' => $meal['horario'],
                    'ordem' => $order,
                ]);

                if (isset($meal['alimentos'])) {
                    foreach ($meal['alimentos'] as $alimento) {
                        if (! empty($alimento['nome'])) {
                            Alimento::create([
                                'refeicao_id' => $refeicao->id,
                                'nome' => $alimento['nome'],
                                'porcao' => $alimento['porcao'] ?? null,
                                'calorias' => $alimento['calorias'] ?? 0,
                            ]);
                        }
                    }
                }
            }
        }

        return redirect()->back()->with('success', 'Plano alimentar atualizado com sucesso!');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $team = $request->user()->currentTeam;
        $planoId = $request->route('plano_id') ?? $request->route('plano');
        $plano = PlanoAlimentar::query()
            ->whereHas('cliente', fn ($builder) => $builder->forTeam($team))
            ->find((int) $planoId);
        if (! $plano) {
            return redirect()->back()->with('error', 'Plano não encontrado');
        }
        $plano->delete();

        return redirect()->back()->with('success', 'Plano alimentar excluído com sucesso!');
    }

    public function download(Request $request)
    {
        $team = $request->user()->currentTeam;
        $planoId = $request->route('plano_id') ?? $request->route('plano');
        $plano = PlanoAlimentar::with(['cliente', 'refeicoes.alimentos'])
            ->whereHas('cliente', fn ($builder) => $builder->forTeam($team))
            ->findOrFail((int) $planoId);

        return view('pdfs.plan', ['plano' => $plano]);
    }
}
