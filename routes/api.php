<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\Api\IncidenteController;
use App\Http\Controllers\Api\AuditoriaController;
use App\Http\Controllers\Api\ActivoController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UsuarioDashboardController;
use App\Http\Controllers\Api\AuthController;

// Middleware 'auth:sanctum' para proteger rutas API
Route::middleware('auth:sanctum')->group(function () {

    // Dashboard general
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Dashboard de usuario
    Route::get('/usuario/dashboard', [UsuarioDashboardController::class, 'index']);

    // Usuarios (CRUD)
    Route::apiResource('usuarios', UsuarioController::class);

    // Incidentes (CRUD)
    Route::apiResource('incidentes', IncidenteController::class);

    // Alertas (incidentes de otros usuarios)
    Route::get('/alertas', [IncidenteController::class, 'getIncidentesPorOtrosUsuarios']);

    // Auditorías (CRUD)
    Route::apiResource('auditorias', AuditoriaController::class);

    // Activos (CRUD manual)
    Route::get('/activos', [ActivoController::class, 'index']);
    Route::post('/activos', [ActivoController::class, 'store']);
    Route::put('/activos/{activo}', [ActivoController::class, 'update']);
    Route::delete('/activos/{activo}', [ActivoController::class, 'destroy']);

    // Activos JSON (extra)
    Route::get('/activos-json', [ActivoController::class, 'obtenerActivosJson']);

    Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']); // opcional
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
});
