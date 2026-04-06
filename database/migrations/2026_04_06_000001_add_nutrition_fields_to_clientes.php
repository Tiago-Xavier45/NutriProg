<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clientes', function (Blueprint $table) {
            $table->integer('age')->nullable()->after('email');
            $table->string('weight')->nullable()->after('age');
            $table->string('height')->nullable()->after('weight');
            $table->string('plan')->nullable()->after('height');
            $table->enum('status', ['Ativo', 'Pendente', 'Inativo'])->default('Ativo')->after('plan');
            $table->date('last_visit')->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('clientes', function (Blueprint $table) {
            $table->dropColumn(['age', 'weight', 'height', 'plan', 'status', 'last_visit']);
        });
    }
};
