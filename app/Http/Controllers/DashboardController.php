<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $totalPacientes = Cliente::count();
        $pacientesAtivos = Cliente::where('status', 'Ativo')->count();
        $pacientesPendentes = Cliente::where('status', 'Pendente')->count();

        $recentPatients = Cliente::orderBy('updated_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($cliente) {
                return [
                    'id' => $cliente->id,
                    'name' => $cliente->name,
                    'plan' => $cliente->plan ?? 'Sem plano',
                    'lastVisit' => $cliente->last_visit 
                        ? $cliente->last_visit->format('d/m/Y') 
                        : 'Nunca',
                    'status' => $cliente->status ?? 'Ativo',
                ];
            });

        $stats = [
            [
                'name' => 'Total de Pacientes',
                'value' => (string) $totalPacientes,
                'change' => '+0%',
                'changeType' => 'positive',
                'icon' => 'Users',
                'color' => 'bg-blue-500',
            ],
            [
                'name' => 'Pacientes Ativos',
                'value' => (string) $pacientesAtivos,
                'change' => '+0%',
                'changeType' => 'positive',
                'icon' => 'Users',
                'color' => 'bg-emerald-500',
            ],
            [
                'name' => 'Planos Ativos',
                'value' => (string) $pacientesAtivos,
                'change' => '+0%',
                'changeType' => 'positive',
                'icon' => 'UtensilsCrossed',
                'color' => 'bg-purple-500',
            ],
            [
                'name' => 'Pendentes',
                'value' => (string) $pacientesPendentes,
                'change' => '+0%',
                'changeType' => 'neutral',
                'icon' => 'Calendar',
                'color' => 'bg-orange-500',
            ],
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recentPatients' => $recentPatients,
        ]);
    }
}
