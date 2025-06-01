<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Incidente;
use App\Models\User;
use App\Models\Activo;

class DashboardController extends Controller
{
    public function index()
    {
        $data = [
            'total_usuarios' => User::count(),
            'total_incidentes' => Incidente::count(),
            'total_activos' => Activo::count(),
        ];

        return response()->json($data, 200);
    }
}
