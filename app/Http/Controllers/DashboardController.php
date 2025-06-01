<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Incidente;
use App\Models\Usuario; 
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Obtener métricas de incidentes
        $totalIncidentes = Incidente::count();
        $incidentesAbiertos = Incidente::where('estado', 'Abierto')->count();
        $incidentesEnProgreso = Incidente::where('estado', 'En Progreso')->count();
        $incidentesCerrados = Incidente::where('estado', 'Cerrado')->count();

        // Conteo por severidad
        $incidentesBajos = Incidente::where('severidad', 'Baja')->count();
        $incidentesMedios = Incidente::where('severidad', 'Media')->count();
        $incidentesAltos = Incidente::where('severidad', 'Alta')->count();
        $incidentesCriticos = Incidente::where('severidad', 'Crítica')->count();

        // Obtener usuarios (solo nombre y apellido por eficiencia)
        $usuarios = Usuario::select('nombre', 'apellido')->get();

        // Obtener incidentes por fecha de los últimos 4 días
        $incidentesPorFecha = Incidente::select(DB::raw('DATE(created_at) as fecha'), DB::raw('count(*) as total'))
            ->where('created_at', '>=', now()->subDays(3)->startOfDay()) // incluye hoy y 3 días anteriores
            ->groupBy('fecha')
            ->orderBy('fecha', 'desc')
            ->get();

        return Inertia::render('dashboard', [
            'totalIncidentes' => $totalIncidentes ?? 0,
            'incidentesAbiertos' => $incidentesAbiertos ?? 0,
            'incidentesEnProgreso' => $incidentesEnProgreso ?? 0,
            'incidentesCerrados' => $incidentesCerrados ?? 0,
            'incidentesBajos' => $incidentesBajos ?? 0,
            'incidentesMedios' => $incidentesMedios ?? 0,
            'incidentesAltos' => $incidentesAltos ?? 0,
            'incidentesCriticos' => $incidentesCriticos ?? 0,
            'usuarios' => $usuarios,
            'incidentesPorFecha' => $incidentesPorFecha,
        ]);
    }
}
