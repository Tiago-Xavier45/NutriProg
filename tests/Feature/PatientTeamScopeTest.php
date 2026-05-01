<?php

use App\Models\Cliente;
use App\Models\Consulta;
use App\Models\PlanoAlimentar;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('dashboard shows only patients from the current team', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    Cliente::factory()->create([
        'team_id' => $user->currentTeam->id,
        'name' => 'Paciente da Ana',
        'status' => 'Ativo',
    ]);

    Cliente::factory()->create([
        'team_id' => $otherUser->currentTeam->id,
        'name' => 'Paciente de Outro Time',
        'status' => 'Ativo',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('dashboard', ['current_team' => $user->currentTeam->slug]));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('dashboard')
        ->where('stats.0.value', '1')
        ->where('stats.1.value', '1')
        ->where('stats.2.value', '1')
        ->where('stats.3.value', '0')
        ->has('recentPatients', 1)
        ->where('recentPatients.0.name', 'Paciente da Ana')
    );
});

test('patient list only shows current team patients and new patients inherit the current team', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    Cliente::factory()->create([
        'team_id' => $user->currentTeam->id,
        'name' => 'Paciente da Equipe',
    ]);

    Cliente::factory()->create([
        'team_id' => $otherUser->currentTeam->id,
        'name' => 'Paciente Vazado',
    ]);

    $listResponse = $this
        ->actingAs($user)
        ->get(route('pacientes', ['current_team' => $user->currentTeam->slug]));

    $listResponse->assertOk();
    $listResponse->assertInertia(fn (Assert $page) => $page
        ->component('pacientes')
        ->has('clientes', 1)
        ->where('clientes.0.name', 'Paciente da Equipe')
    );

    $storeResponse = $this
        ->actingAs($user)
        ->post(route('clientes.store', ['current_team' => $user->currentTeam->slug]), [
            'name' => 'Novo Paciente',
            'email' => 'novo@example.com',
            'status' => 'Ativo',
        ]);

    $storeResponse->assertRedirect();

    $this->assertDatabaseHas('clientes', [
        'name' => 'Novo Paciente',
        'team_id' => $user->currentTeam->id,
    ]);
});

test('cannot update or delete a patient from another team', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $foreignCliente = Cliente::factory()->create([
        'team_id' => $otherUser->currentTeam->id,
        'name' => 'Paciente Protegido',
        'email' => 'protegido@example.com',
    ]);

    $patientsUrl = route('pacientes', ['current_team' => $user->currentTeam->slug]);

    $updateResponse = $this
        ->actingAs($user)
        ->from($patientsUrl)
        ->put(route('clientes.update', [
            'current_team' => $user->currentTeam->slug,
            'cliente_id' => $foreignCliente->id,
        ]), [
            'name' => 'Nome Alterado',
            'email' => 'alterado@example.com',
        ]);

    $updateResponse->assertRedirect($patientsUrl);
    $updateResponse->assertSessionHas('error', 'Paciente não encontrado');

    expect($foreignCliente->fresh()->name)->toBe('Paciente Protegido');

    $deleteResponse = $this
        ->actingAs($user)
        ->from($patientsUrl)
        ->delete(route('clientes.destroy', [
            'current_team' => $user->currentTeam->slug,
            'cliente_id' => $foreignCliente->id,
        ]));

    $deleteResponse->assertRedirect($patientsUrl);
    $deleteResponse->assertSessionHas('error', 'Paciente não encontrado');
    $this->assertModelExists($foreignCliente->fresh());
});

test('agenda and meal plans only expose current team patients', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $ownCliente = Cliente::factory()->create([
        'team_id' => $user->currentTeam->id,
        'name' => 'Paciente Agenda',
    ]);

    $otherCliente = Cliente::factory()->create([
        'team_id' => $otherUser->currentTeam->id,
        'name' => 'Paciente Externo',
    ]);

    Consulta::create([
        'cliente_id' => $ownCliente->id,
        'data' => today(),
        'horario' => '09:00',
        'duracao' => 60,
        'tipo' => 'consulta',
        'status' => 'confirmado',
    ]);

    Consulta::create([
        'cliente_id' => $otherCliente->id,
        'data' => today(),
        'horario' => '10:00',
        'duracao' => 60,
        'tipo' => 'consulta',
        'status' => 'confirmado',
    ]);

    PlanoAlimentar::create([
        'cliente_id' => $ownCliente->id,
        'nome' => 'Plano da Equipe',
        'calorias' => 1800,
        'status' => 'ativo',
    ]);

    PlanoAlimentar::create([
        'cliente_id' => $otherCliente->id,
        'nome' => 'Plano Externo',
        'calorias' => 2200,
        'status' => 'ativo',
    ]);

    $agendaResponse = $this
        ->actingAs($user)
        ->get(route('agenda', ['current_team' => $user->currentTeam->slug]));

    $agendaResponse->assertOk();
    $agendaResponse->assertInertia(fn (Assert $page) => $page
        ->component('agenda')
        ->has('pacientes', 1)
        ->where('pacientes.0.name', 'Paciente Agenda')
        ->has('consultas', 1)
        ->where('consultas.0.patientName', 'Paciente Agenda')
    );

    $planosResponse = $this
        ->actingAs($user)
        ->get(route('planos', ['current_team' => $user->currentTeam->slug]));

    $planosResponse->assertOk();
    $planosResponse->assertInertia(fn (Assert $page) => $page
        ->component('planos')
        ->has('pacientes', 1)
        ->where('pacientes.0.name', 'Paciente Agenda')
        ->has('planos', 1)
        ->where('planos.0.patientName', 'Paciente Agenda')
    );
});

test('reports only count data from the current team', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $ownCliente = Cliente::factory()->create([
        'team_id' => $user->currentTeam->id,
        'plan' => 'Plano Ouro',
        'status' => 'Ativo',
    ]);

    $otherCliente = Cliente::factory()->create([
        'team_id' => $otherUser->currentTeam->id,
        'plan' => 'Plano Prata',
        'status' => 'Ativo',
    ]);

    Consulta::create([
        'cliente_id' => $ownCliente->id,
        'data' => today(),
        'horario' => '08:00',
        'duracao' => 60,
        'tipo' => 'consulta',
        'status' => 'confirmado',
    ]);

    Consulta::create([
        'cliente_id' => $otherCliente->id,
        'data' => today(),
        'horario' => '11:00',
        'duracao' => 60,
        'tipo' => 'consulta',
        'status' => 'confirmado',
    ]);

    PlanoAlimentar::create([
        'cliente_id' => $ownCliente->id,
        'nome' => 'Plano Ativo',
        'calorias' => 2000,
        'status' => 'ativo',
    ]);

    PlanoAlimentar::create([
        'cliente_id' => $otherCliente->id,
        'nome' => 'Plano de Fora',
        'calorias' => 2300,
        'status' => 'ativo',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('relatorios', ['current_team' => $user->currentTeam->slug]));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('relatorios')
        ->where('stats.totalPacientes', 1)
        ->where('stats.pacientesAtivos', 1)
        ->where('stats.totalConsultas', 1)
        ->where('stats.totalPlanos', 1)
        ->has('planosDistribution', 1)
        ->where('planosDistribution.0.name', 'Plano Ouro')
    );
});
