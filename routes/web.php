<?php

use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ConsultaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PlanoAlimentarController;
use App\Http\Controllers\RelatorioController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\TacoAlimentoController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        Route::get('taco/buscar', [TacoAlimentoController::class, 'buscar'])->name('taco.buscar');

        Route::post('planos/{plano_id}/duplicate', [PlanoAlimentarController::class, 'duplicate'])
        ->name('planos.duplicate')
        ->withoutMiddleware(SubstituteBindings::class);

        Route::get('clientes', [ClienteController::class, 'index'])->name('cliente.index');
        Route::post('clientes', [ClienteController::class, 'store'])->name('clientes.store');
        Route::put('clientes/{cliente_id}', [ClienteController::class, 'update'])
            ->name('clientes.update')
            ->withoutMiddleware(SubstituteBindings::class);
        Route::delete('clientes/{cliente_id}', [ClienteController::class, 'destroy'])
            ->name('clientes.destroy')
            ->withoutMiddleware(SubstituteBindings::class);

        Route::get('pacientes', [ClienteController::class, 'index'])->name('pacientes');

        Route::get('planos', [PlanoAlimentarController::class, 'index'])->name('planos');
        Route::post('planos', [PlanoAlimentarController::class, 'store'])->name('planos.store');
        Route::put('planos/{plano_id}', [PlanoAlimentarController::class, 'update'])
            ->name('planos.update')
            ->withoutMiddleware(SubstituteBindings::class);
        Route::delete('planos/{plano_id}', [PlanoAlimentarController::class, 'destroy'])
            ->name('planos.destroy')
            ->withoutMiddleware(SubstituteBindings::class);

        Route::get('planos/{plano_id}/download', [PlanoAlimentarController::class, 'download'])
            ->name('planos.download')
            ->withoutMiddleware(SubstituteBindings::class);

        Route::get('agenda', [ConsultaController::class, 'index'])->name('agenda');
        Route::post('consultas', [ConsultaController::class, 'store'])->name('consultas.store');
        Route::put('consultas/{consulta_id}', [ConsultaController::class, 'update'])
            ->name('consultas.update')
            ->withoutMiddleware(SubstituteBindings::class);
        Route::delete('consultas/{consulta_id}', [ConsultaController::class, 'destroy'])
            ->name('consultas.destroy')
            ->withoutMiddleware(SubstituteBindings::class);

        Route::get('relatorios', [RelatorioController::class, 'index'])->name('relatorios');
        Route::post('relatorios', [RelatorioController::class, 'store'])->name('relatorios.store');
        Route::match(['post', 'delete'], 'relatorios/{relatorio_id}', [RelatorioController::class, 'destroy'])
            ->name('relatorios.destroy')
            ->withoutMiddleware(SubstituteBindings::class);
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
});

require __DIR__.'/settings.php';
