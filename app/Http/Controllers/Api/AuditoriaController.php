<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Auditoria;
use Illuminate\Http\Request;

class AuditoriaController extends Controller
{
    public function index()
    {
        return response()->json(Auditoria::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'accion' => 'required|string',
            'usuario_id' => 'required|integer',
            'descripcion' => 'required|string',
        ]);

        $auditoria = Auditoria::create($validated);

        return response()->json($auditoria, 201);
    }

    public function show(Auditoria $auditoria)
    {
        return response()->json($auditoria, 200);
    }

    public function update(Request $request, Auditoria $auditoria)
    {
        $validated = $request->validate([
            'accion' => 'required|string',
            'usuario_id' => 'required|integer',
            'descripcion' => 'required|string',
        ]);

        $auditoria->update($validated);

        return response()->json($auditoria, 200);
    }

    public function destroy(Auditoria $auditoria)
    {
        $auditoria->delete();

        return response()->json(['message' => 'Auditoría eliminada'], 200);
    }
}
