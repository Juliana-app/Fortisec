<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::create('incidentes', function (Blueprint $table) {
        $table->id();
        $table->string('titulo');
        $table->text('descripcion');
        $table->string('severidad'); // Baja, Media, Alta
        $table->string('estado'); // Pendiente, En progreso, Cerrado
        $table->string('usuario_email'); // Relación con Usuarios
        $table->text('planAccion')->nullable();
        $table->text('mitigacion')->nullable();
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('incidentes');
    }
};
