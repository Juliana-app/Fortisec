<?php

namespace App\Http\Controllers;

use App\Models\Activo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivoController extends Controller
{
    // Retorna la vista Inertia (si usas esta para CRUD)
    public function index()
    {
        return Inertia::render('Activos', [
            'activos' => Activo::all(),
        ]);
    }

    // ✅ Endpoint para devolver activos en JSON (usado por Alerts.tsx)
    public function api()
    {
        return response()->json(Activo::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'descripcion' => 'required|string',
            'ubicacion' => 'required|string',
        ]);

        Activo::create($request->only(['nombre', 'descripcion', 'ubicacion']));
    }

    public function update(Request $request, Activo $activo)
    {
        $request->validate([
            'nombre' => 'required|string',
            'descripcion' => 'required|string',
            'ubicacion' => 'required|string',
        ]);

        $activo->update($request->only(['nombre', 'descripcion', 'ubicacion']));
    }

    public function destroy(Activo $activo)
    {
        $activo->delete();
    }
}
