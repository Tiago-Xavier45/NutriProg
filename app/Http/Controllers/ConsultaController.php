<?php

namespace App\Http\Controllers;

use App\Models\Consulta;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConsultaController extends Controller
{
    public function index(Request $request)
    {
        $month = $request->get('month', now()->month);
        $year = $request->get('year', now()->year);

        $consultas = Consulta::with('cliente')
            ->whereYear('data', $year)
            ->whereMonth('data', $month)
            ->orderBy('horario')
            ->get()
            ->map(function ($consulta) {
                return [
                    'id' => (string) $consulta->id,
                    'patientId' => (string) $consulta->cliente_id,
                    'patientName' => $consulta->cliente->name,
                    'phone' => $consulta->telefone ?? $consulta->cliente->phone,
                    'time' => substr($consulta->horario, 0, 5),
                    'date' => $consulta->data->format('Y-m-d'),
                    'duration' => $consulta->duracao,
                    'type' => $consulta->tipo,
                    'status' => $consulta->status,
                    'notes' => $consulta->observacoes,
                ];
            });

        $pacientes = Cliente::orderBy('name')->get()->map(function ($cliente) {
            return [
                'id' => (string) $cliente->id,
                'name' => $cliente->name,
            ];
        });

        return Inertia::render('agenda', [
            'consultas' => $consultas,
            'currentMonth' => $month,
            'currentYear' => $year,
            'pacientes' => $pacientes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'data' => 'required|date',
            'horario' => 'required',
            'duracao' => 'nullable|integer|min:30|max:180',
            'tipo' => 'nullable|in:consulta,retorno,avaliacao',
            'status' => 'nullable|in:confirmado,pendente,cancelado',
            'observacoes' => 'nullable|string',
            'telefone' => 'nullable|string|max:20',
        ]);

        Consulta::create($validated);

        return redirect()->back()->with('success', 'Consulta agendada com sucesso!');
    }

    public function update(Request $request)
    {
        $consultaId = $request->route('consulta_id') ?? $request->route('consulta');
        $consulta = Consulta::find((int) $consultaId);
        if (!$consulta) {
            return redirect()->back()->with('error', 'Consulta não encontrada');
        }
        
        $validated = $request->validate([
            'cliente_id' => 'sometimes|exists:clientes,id',
            'data' => 'sometimes|date',
            'horario' => 'sometimes',
            'duracao' => 'nullable|integer|min:30|max:180',
            'tipo' => 'nullable|in:consulta,retorno,avaliacao',
            'status' => 'nullable|in:confirmado,pendente,cancelado',
            'observacoes' => 'nullable|string',
            'telefone' => 'nullable|string|max:20',
        ]);

        $consulta->update($validated);

        return redirect()->back()->with('success', 'Consulta atualizada com sucesso!');
    }

    public function destroy(Request $request)
    {
        $consultaId = $request->route('consulta_id') ?? $request->route('consulta');
        $consulta = Consulta::find((int) $consultaId);
        if (!$consulta) {
            return redirect()->back()->with('error', 'Consulta não encontrada');
        }
        $consulta->delete();

        return redirect()->back()->with('success', 'Consulta excluída com sucesso!');
    }
}
