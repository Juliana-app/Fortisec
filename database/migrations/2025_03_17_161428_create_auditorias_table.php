<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::create('auditorias', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('id_incidente');
        $table->string('estado_incidente');
        $table->text('remediacion');
        $table->date('fechaRemediacion');
        $table->timestamps();

        $table->foreign('id_incidente')->references('id')->on('incidentes')->onDelete('cascade');
    });
}

    public function down(): void
    {
        Schema::dropIfExists('auditorias');
    }
};
