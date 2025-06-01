<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Incidente;
use Illuminate\Support\Facades\Auth;

class UsuarioDashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $totalIncidentes = Incidente::where('usuario_id', $userId)->count();

        return response()->json([
            'total_mis_incidentes' => $totalIncidentes,
        ], 200);
    }
}

