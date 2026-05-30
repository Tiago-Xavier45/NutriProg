<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('avaliacoes_antropometricas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->date('data_avaliacao');

            // Básico
            $table->decimal('peso', 5, 2)->nullable();         // kg
            $table->decimal('altura', 4, 2)->nullable();       // m
            $table->decimal('imc', 5, 2)->nullable();          // calculado

            // Composição corporal
            $table->decimal('percentual_gordura', 5, 2)->nullable();
            $table->decimal('massa_gorda', 5, 2)->nullable();  // kg
            $table->decimal('massa_magra', 5, 2)->nullable();  // kg
            $table->decimal('percentual_massa_muscular', 5, 2)->nullable(); 

            // Circunferências (cm)
            $table->decimal('circ_abdominal', 5, 2)->nullable();
            $table->decimal('circ_quadril', 5, 2)->nullable();
            $table->decimal('circ_braco', 5, 2)->nullable();
            $table->decimal('circ_coxa', 5, 2)->nullable();
            $table->decimal('rcq', 5, 3)->nullable(); // relação cintura/quadril

            // Dobras cutâneas (mm)
            $table->decimal('dobra_tricipital', 5, 2)->nullable();
            $table->decimal('dobra_subescapular', 5, 2)->nullable();
            $table->decimal('dobra_abdominal', 5, 2)->nullable();
            $table->decimal('dobra_suprailiaca', 5, 2)->nullable();
            $table->decimal('dobra_coxa', 5, 2)->nullable();

            $table->text('observacoes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('avaliacoes_antropometricas');
    }
};