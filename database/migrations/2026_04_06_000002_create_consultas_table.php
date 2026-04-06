<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consultas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            $table->date('data');
            $table->time('horario');
            $table->integer('duracao')->default(60);
            $table->enum('tipo', ['consulta', 'retorno', 'avaliacao'])->default('consulta');
            $table->enum('status', ['confirmado', 'pendente', 'cancelado'])->default('pendente');
            $table->text('observacoes')->nullable();
            $table->string('telefone')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consultas');
    }
};
