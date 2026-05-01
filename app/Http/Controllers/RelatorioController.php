<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Consulta;
use App\Models\PlanoAlimentar;
use App\Models\Relatorio;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RelatorioController extends Controller
{
    public function index(Request $request): Response
    {
        $team = $request->user()->currentTeam;
        $period = $request->get('period', 'mes');

        $stats = $this->getStats($team, $period);
        $pacientesPorMes = $this->getPacientesPorMes($team);
        $planosDistribution = $this->getPlanosDistribution($team);

        $savedReports = Relatorio::orderBy('created_at', 'desc')->limit(10)->get()->map(function ($r) {
            return [
                'id' => $r->id,
                'title' => $r->titulo,
                'type' => $r->tipo,
                'period' => $r->periodo,
                'generatedAt' => $r->created_at->format('d/m/Y'),
                'size' => '0 KB',
            ];
        });

        return Inertia::render('relatorios', [
            'stats' => $stats,
            'pacientesPorMes' => $pacientesPorMes,
            'planosDistribution' => $planosDistribution,
            'savedReports' => $savedReports,
            'currentPeriod' => $period,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'tipo' => 'required|in:pacientes,financeiro,planos,consultas',
            'periodo' => 'required|string|max:100',
            'dados' => 'nullable|array',
        ]);

        $relatorio = Relatorio::create($validated);

        return redirect()->back()->with('success', 'Relatório salvo com sucesso!');
    }

    public function destroy(Request $request)
    {
        $relatorioId = $request->route('relatorio_id') ?? $request->route('relatorio');
        $relatorio = Relatorio::find((int) $relatorioId);
        if (! $relatorio) {
            return redirect()->back()->with('error', 'Relatório não encontrado');
        }
        $relatorio->delete();

        return redirect()->back()->with('success', 'Relatório excluído!');
    }

    private function getStats(Team $team, string $period): array
    {
        $dateFilter = $this->getDateFilter($period);

        $totalPacientes = Cliente::query()->forTeam($team)->when($dateFilter, function ($query) use ($dateFilter) {
            return $query->where('created_at', '>=', $dateFilter);
        })->count();

        $pacientesAtivos = Cliente::query()->forTeam($team)->where('status', 'Ativo')
            ->when($dateFilter, function ($query) use ($dateFilter) {
                return $query->where('created_at', '>=', $dateFilter);
            })
            ->count();

        $totalConsultas = Consulta::query()
            ->whereHas('cliente', fn ($query) => $query->forTeam($team))
            ->when($dateFilter, function ($query) use ($dateFilter) {
                return $query->where('data', '>=', $dateFilter);
            })
            ->count();

        $totalPlanos = PlanoAlimentar::query()
            ->whereHas('cliente', fn ($query) => $query->forTeam($team))
            ->where('status', 'ativo')
            ->when($dateFilter, function ($query) use ($dateFilter) {
                return $query->where('created_at', '>=', $dateFilter);
            })
            ->count();

        return [
            'totalPacientes' => $totalPacientes,
            'pacientesAtivos' => $pacientesAtivos,
            'totalConsultas' => $totalConsultas,
            'totalPlanos' => $totalPlanos,
        ];
    }

    private function getDateFilter(string $period)
    {
        switch ($period) {
            case 'semana':
                return now()->startOfWeek();
            case 'mes':
                return now()->startOfMonth();
            case 'trimestre':
                return now()->subMonths(3);
            case 'ano':
                return now()->startOfYear();
            default:
                return null;
        }
    }

    private function getPacientesPorMes(Team $team): array
    {
        $months = [];

        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthName = $date->format('M');

            $pacientes = Cliente::query()->forTeam($team)
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();

            $consultas = Consulta::query()
                ->whereHas('cliente', fn ($query) => $query->forTeam($team))
                ->whereYear('data', $date->year)
                ->whereMonth('data', $date->month)
                ->count();

            $months[] = [
                'month' => $monthName,
                'pacientes' => $pacientes,
                'consultas' => $consultas,
            ];
        }

        return $months;
    }

    private function getPlanosDistribution(Team $team): array
    {
        $plans = Cliente::query()
            ->forTeam($team)
            ->select('plan', DB::raw('COUNT(*) as total'))
            ->whereNotNull('plan')
            ->where('plan', '!=', '')
            ->groupBy('plan')
            ->get();

        $colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];
        $total = $plans->sum('total') ?: 1;

        return $plans->map(function ($plan, $index) use ($total, $colors) {
            return [
                'name' => $plan->plan,
                'value' => round(($plan->total / $total) * 100),
                'color' => $colors[$index % count($colors)],
            ];
        })->toArray();
    }
}
