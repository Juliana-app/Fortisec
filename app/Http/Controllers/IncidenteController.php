<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Usuario;
use App\Models\Activo;
use App\Models\Incidente;
use Carbon\Carbon;

class IncidenteController extends Controller
{
    // Método para obtener incidentes creados por otros usuarios
    public function getIncidentesPorOtrosUsuarios()
    {
        // Filtrar los incidentes donde el creador no sea el usuario logueado
        $incidentes = Incidente::where('usuario_email', '!=', Auth::user()->email)->get();

        return Inertia::render('Alertas', [
            'incidentes' => $incidentes
        ]);
    }

    // Método para mostrar todos los incidentes, usuarios y activos
    public function index()
    {
        // Obtener los datos de los incidentes, usuarios y activos
        $incidentes = Incidente::all();
        $usuarios = Usuario::all();
        $activos = Activo::all();  // Aquí deberías recuperar los datos de activos
    
        return Inertia::render('Incidentes', [
            'incidentes' => $incidentes,
            'usuarios' => $usuarios,
            'activos' => $activos,  // Pasar los datos de activos a la vista
        ]);
    }

    // Método para crear un incidente
    public function create()
    {
        return view('incidentes.create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'severidad' => 'required|string',
            'estado' => 'required|string',
            'usuario_email' => 'required|email',
            'activo_involucrado' => 'required|string',
            'comentario_cierre' => 'nullable|string',
            'mitigacion' => 'nullable|string',
        ]);
    
        $incidenteData = $validatedData;
        $incidenteData['created_at'] = now();
    
        // Si el incidente se cierra, registra la fecha de cierre
        if ($validatedData['estado'] === 'Cerrado') {
            $incidenteData['fecha_cierre'] = now();
        }
    
    
        // Crear el incidente
        $incidente = Incidente::create($incidenteData);
    
    
        return redirect()->route('incidentes.index')
            ->with('success', 'Incidente registrado exitosamente');
    }
    

    // Método para mostrar un incidente específico
    public function show(Incidente $incidente)
    {
        return view('incidentes.show', compact('incidente'));
    }

    // Método para mostrar el formulario de edición de un incidente
    public function edit(Incidente $incidente)
    {
        return view('incidentes.edit', compact('incidente'));
    }

    public function update(Request $request, Incidente $incidente)
    {
        $validatedData = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'severidad' => 'required|string',
            'estado' => 'required|string',
            'usuario_email' => 'required|email',
            'activo_involucrado' => 'required|string',
            'comentario_cierre' => 'nullable|string',
            'mitigacion' => 'nullable|string',
        ]);
    
        // Asignar planesAccion como array o vacío si no se envía
        $validatedData['planesAccion'] = $validatedData['planesAccion'] ?? [];
    
        // Si se cierra y no tiene fecha de cierre
        if ($validatedData['estado'] === 'Cerrado' && !$incidente->fecha_cierre) {
            $validatedData['fecha_cierre'] = now();
        }
    
        // Actualizar el incidente
        $incidente->update($validatedData);
    
        return redirect()->route('incidentes.index')
            ->with('success', 'Incidente actualizado exitosamente');
    }
    
    // Método para eliminar un incidente
    public function destroy(Incidente $incidente)
    {
        $incidente->delete();
        return redirect()->route('incidentes.index')->with('success', 'Incidente eliminado exitosamente');
    }
}
