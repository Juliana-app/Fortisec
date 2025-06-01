<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RemoveRemediacionFromAuditoriasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('auditorias', function (Blueprint $table) {
            // Eliminar el campo remediacion
            $table->dropColumn('remediacion');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('auditorias', function (Blueprint $table) {
            // Volver a agregar el campo remediacion en caso de revertir la migración
            $table->string('remediacion')->nullable();
        });
    }
}

