<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incidente extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'descripcion',
        'severidad',
        'estado',
        'usuario_email',
        'activo_involucrado',
        'fecha_creacion',
        'fecha_cierre',
        'comentario_cierre',
        'mitigacion',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuario_email', 'email');
    }
}
