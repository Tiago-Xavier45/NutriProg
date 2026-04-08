<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClienteController extends Controller
{
    public function index(Request $request)
    {
        $query = Cliente::query();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->get('status') !== 'all') {
            $query->where('status', $request->get('status'));
        }

        $clientes = $query->orderBy('name')->get();

        return Inertia::render('pacientes', [
            'clientes' => $clientes,
            'filters' => [
                'search' => $request->get('search', ''),
                'status' => $request->get('status', 'all'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'age' => 'nullable|integer|min:0|max:150',
            'weight' => 'nullable|string|max:10',
            'height' => 'nullable|string|max:10',
            'plan' => 'nullable|string|max:100',
            'status' => 'nullable|in:Ativo,Pendente,Inativo',
            'last_visit' => 'nullable|date',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:50',
            'zip' => 'nullable|string|max:20',
        ]);

        $cliente = Cliente::create($validated);

        return redirect()->back()->with('success', 'Paciente criado com sucesso!');
    }

    public function update(Request $request)
    {
        $clienteId = $request->route('cliente_id') ?? $request->route('cliente');
        $cliente = Cliente::find((int) $clienteId);
        if (!$cliente) {
            return redirect()->back()->with('error', 'Paciente não encontrado');
        }
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'age' => 'nullable|integer|min:0|max:150',
            'weight' => 'nullable|string|max:10',
            'height' => 'nullable|string|max:10',
            'plan' => 'nullable|string|max:100',
            'status' => 'nullable|in:Ativo,Pendente,Inativo',
            'last_visit' => 'nullable|date',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:50',
            'zip' => 'nullable|string|max:20',
        ]);

        $cliente->update($validated);

        return redirect()->back()->with('success', 'Paciente atualizado com sucesso!');
    }

    public function destroy(Request $request)
    {
        $clienteId = $request->route('cliente_id') ?? $request->route('cliente');
        $cliente = Cliente::find((int) $clienteId);
        if (!$cliente) {
            return redirect()->back()->with('error', 'Paciente não encontrado');
        }
        $cliente->delete();

        return redirect()->back()->with('success', 'Paciente excluído com sucesso!');
    }
}
