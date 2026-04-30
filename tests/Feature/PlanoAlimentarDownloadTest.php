<?php

use App\Models\Alimento;
use App\Models\Cliente;
use App\Models\PlanoAlimentar;
use App\Models\Refeicao;

it('can access plan download page', function () {
    // Criar um cliente e um plano com dados básicos
    $cliente = Cliente::factory()->create();
    $plano = PlanoAlimentar::factory()->create([
        'cliente_id' => $cliente->id,
        'nome' => 'Plano Teste',
    ]);

    // Opcional: Criar algumas refeições e alimentos para o plano
    $refeicao = Refeicao::factory()->create([
        'plano_alimentar_id' => $plano->id,
        'nome' => 'Café da Manhã',
    ]);

    Alimento::factory()->create([
        'refeicao_id' => $refeicao->id,
        'nome' => 'Pão Integral',
    ]);

    // Simular acesso à rota de download (sem autenticação por enquanto)
    $response = $this->get(route('planos.download', $plano->id));

    // Verificar se a resposta é 200 (OK)
    $response->assertStatus(200);

    // Verificar se o conteúdo esperado está presente
    $response->assertSee('Plano Alimentar');
    $response->assertSee($plano->nome);
    $response->assertSee($cliente->name);
});

it('returns 404 for non-existent plan', function () {
    $response = $this->get(route('planos.download', 9999));
    $response->assertStatus(404);
});
