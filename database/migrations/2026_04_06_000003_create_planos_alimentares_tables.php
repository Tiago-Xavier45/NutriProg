<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('planos_alimentares', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            $table->string('nome');
            $table->integer('calorias')->default(2000);
            $table->string('objetivo')->nullable();
            $table->json('restricoes')->nullable();
            $table->text('observacoes')->nullable();
            $table->enum('status', ['ativo', 'inativo'])->default('ativo');
            $table->timestamps();
        });

        Schema::create('refeicoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plano_alimentar_id')->constrained('planos_alimentares')->onDelete('cascade');
            $table->string('nome');
            $table->time('horario');
            $table->integer('ordem')->default(0);
            $table->timestamps();
        });

        Schema::create('alimentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('refeicao_id')->constrained('refeicoes')->onDelete('cascade');
            $table->string('nome');
            $table->string('porcao')->nullable();
            $table->integer('calorias')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alimentos');
        Schema::dropIfExists('refeicoes');
        Schema::dropIfExists('planos_alimentares');
    }
};
