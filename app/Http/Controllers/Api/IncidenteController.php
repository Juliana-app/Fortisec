<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Incidente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IncidenteController extends Controller
{
    public function index()
    {
        return response()->json(Incidente::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'required|string',
            'descripcion' => 'required|string',
            'activo_id' => 'required|integer',
        ]);

        $validated['usuario_id'] = Auth::id();

        $incidente = Incidente::create($validated);

        return response()->json($incidente, 201);
    }

    public function show(Incidente $incidente)
    {
        return response()->json($incidente, 200);
    }

    public function update(Request $request, Incidente $incidente)
    {
        $validated = $request->validate([
            'titulo' => 'required|string',
            'descripcion' => 'required|string',
            'activo_id' => 'required|integer',
        ]);

        $incidente->update($validated);

        return response()->json($incidente, 200);
    }

    public function destroy(Incidente $incidente)
    {
        $incidente->delete();

        return response()->json(['message' => 'Incidente eliminado'], 200);
    }

    public function getIncidentesPorOtrosUsuarios()
    {
        $userId = Auth::id();
        $incidentes = Incidente::where('usuario_id', '!=', $userId)->get();

        return response()->json($incidentes, 200);
    }
}
