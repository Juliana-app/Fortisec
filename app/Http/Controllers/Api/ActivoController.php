<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activo;
use Illuminate\Http\Request;

class ActivoController extends Controller
{
    public function index()
    {
        return response()->json(Activo::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string',
            'descripcion' => 'required|string',
            'ubicacion' => 'required|string',
        ]);

        $activo = Activo::create($validated);

        return response()->json($activo, 201);
    }

    public function update(Request $request, Activo $activo)
    {
        $validated = $request->validate([
            'nombre' => 'required|string',
            'descripcion' => 'required|string',
            'ubicacion' => 'required|string',
        ]);

        $activo->update($validated);

        return response()->json($activo, 200);
    }

    public function destroy(Activo $activo)
    {
        $activo->delete();

        return response()->json(['message' => 'Activo eliminado'], 200);
    }

    public function obtenerActivosJson()
    {
        return response()->json(Activo::all(), 200);
    }
}
