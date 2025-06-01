<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Auditoria;
use App\Models\Incidente;
use Inertia\Inertia;

class AuditoriaController extends Controller
{
    public function index()
    {
        return Inertia::render('Auditorias', [
            'auditorias' => Auditoria::with('incidente')->get(),
            'incidentes' => Incidente::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'numero_auditoria' => 'required',
            'estado_incidente' => 'required|string|max:255',
            'id_incidente' => 'required|exists:incidentes,id',
            'plan_accion' => 'required|array|min:1',
            'fecha_plan_accion' => 'required|date',
            'estado' => 'required|string|max:255',
            'cierre' => 'required|boolean',
            'comentario_final' => 'nullable|string',
        ]);

        Auditoria::create($request->all());

        return redirect()->route('auditorias.index')->with('success', 'Auditoría registrada exitosamente');
    }

    public function update(Request $request, $id)
    {
        $auditoria = Auditoria::findOrFail($id);

        $request->validate([
            'numero_auditoria' => 'required|unique:auditorias,numero_auditoria,' . $id,
            'estado_incidente' => 'required|string|max:255',
            'id_incidente' => 'required|exists:incidentes,id',
            'plan_accion' => 'required|array|min:1',
            'fecha_plan_accion' => 'required|date',
            'estado' => 'required|string|max:255',
            'cierre' => 'required|boolean',
            'comentario_final' => 'nullable|string',
        ]);

        $auditoria->update($request->all());

        return redirect()->route('auditorias.index')->with('success', 'Auditoría actualizada exitosamente');
    }

    public function destroy(Auditoria $auditoria)
    {
        $auditoria->delete();
        return redirect()->route('auditorias.index')->with('success', 'Auditoría eliminada exitosamente');
    }
}
