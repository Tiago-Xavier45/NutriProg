<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('exames_laboratoriais', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->cascadeOnDelete();
            $table->date('data_exame');

            // Glicemia
            $table->decimal('glicemia_jejum', 6, 2)->nullable();
            $table->decimal('hemoglobina_glicada', 5, 2)->nullable();

            // Lipidograma
            $table->decimal('colesterol_total', 6, 2)->nullable();
            $table->decimal('colesterol_ldl', 6, 2)->nullable();
            $table->decimal('colesterol_hdl', 6, 2)->nullable();
            $table->decimal('triglicerideos', 6, 2)->nullable();

            // Hemograma
            $table->decimal('hemoglobina', 5, 2)->nullable();
            $table->decimal('hematocrito', 5, 2)->nullable();
            $table->decimal('ferritina', 7, 2)->nullable();

            // Vitaminas e minerais
            $table->decimal('vitamina_d', 6, 2)->nullable();
            $table->decimal('vitamina_b12', 7, 2)->nullable();
            $table->decimal('acido_folico', 6, 2)->nullable();
            $table->decimal('zinco', 6, 2)->nullable();
            $table->decimal('magnesio', 6, 2)->nullable();

            // Função renal/hepática
            $table->decimal('creatinina', 5, 2)->nullable();
            $table->decimal('ureia', 6, 2)->nullable();
            $table->decimal('tgo', 6, 2)->nullable();
            $table->decimal('tgp', 6, 2)->nullable();

            // Tireoide
            $table->decimal('tsh', 7, 3)->nullable();
            $table->decimal('t4_livre', 6, 3)->nullable();

            $table->text('observacoes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exames_laboratoriais');
    }
};