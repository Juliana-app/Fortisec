<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Auditoria extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero_auditoria',
        'id_incidente',
        'plan_accion',
        'fecha_plan_accion',
        'estado',
        'cierre',
        'comentario_final',
    ];

    protected $casts = [
        'plan_accion' => 'array',
        'cierre' => 'boolean',
        'fecha_plan_accion' => 'date',
    ];

    public function incidente()
    {
        return $this->belongsTo(Incidente::class, 'id_incidente');
    }
}
