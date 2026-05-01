<?php

use App\Models\Cliente;
use App\Models\PlanoAlimentar;
use App\Models\User;

it('can access plan download page', function () {
    $user = User::factory()->create();
    $cliente = Cliente::factory()->create([
        'team_id' => $user->currentTeam->id,
    ]);

    $plano = PlanoAlimentar::create([
        'cliente_id' => $cliente->id,
        'nome' => 'Plano Teste',
        'calorias' => 2000,
        'status' => 'ativo',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('planos.download', [
            'current_team' => $user->currentTeam->slug,
            'plano_id' => $plano->id,
        ]));

    $response->assertStatus(200);
    $response->assertSee('Plano Alimentar');
    $response->assertSee($plano->nome);
    $response->assertSee($cliente->name);
});

it('returns 404 for non-existent plan', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('planos.download', [
            'current_team' => $user->currentTeam->slug,
            'plano_id' => 9999,
        ]));

    $response->assertStatus(404);
});
