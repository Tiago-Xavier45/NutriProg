<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('anamneses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();

            // Dados pessoais clínicos
            $table->enum('sexo', ['masculino', 'feminino', 'outro'])->nullable();
            $table->enum('nivel_atividade', [
                'sedentario',
                'levemente_ativo',
                'moderadamente_ativo',
                'muito_ativo',
                'extremamente_ativo',
            ])->nullable();

            // Histórico clínico
            $table->text('doencas_preexistentes')->nullable();
            $table->text('medicamentos')->nullable();
            $table->text('alergias_alimentares')->nullable();
            $table->text('intolerâncias')->nullable();
            $table->text('historico_familiar')->nullable();

            // Hábitos
            $table->text('rotina_alimentar')->nullable();
            $table->text('alimentos_preferidos')->nullable();
            $table->text('alimentos_nao_gosta')->nullable();
            $table->integer('refeicoes_por_dia')->nullable();
            $table->text('atividade_fisica_descricao')->nullable();
            $table->integer('horas_sono')->nullable();
            $table->text('nivel_estresse')->nullable();

            // Objetivo
            $table->text('objetivo_tratamento')->nullable();
            $table->text('observacoes')->nullable();

            // TMB/GET calculados
            $table->decimal('tmb', 8, 2)->nullable();
            $table->decimal('get', 8, 2)->nullable();
            $table->decimal('meta_calorica', 8, 2)->nullable();
            $table->decimal('meta_proteina', 8, 2)->nullable();
            $table->decimal('meta_carboidrato', 8, 2)->nullable();
            $table->decimal('meta_gordura', 8, 2)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anamneses');
    }
};