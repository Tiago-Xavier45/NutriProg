<?php
// database/migrations/xxxx_create_taco_alimentos_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('taco_alimentos', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('categoria')->nullable();
            $table->string('porcao_padrao')->default('100g');
            $table->decimal('calorias', 8, 2)->default(0);
            $table->decimal('proteinas', 8, 2)->default(0);
            $table->decimal('carboidratos', 8, 2)->default(0);
            $table->decimal('gorduras', 8, 2)->default(0);
            $table->decimal('fibras', 8, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('taco_alimentos');
    }
};