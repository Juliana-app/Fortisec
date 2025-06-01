<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\IncidenteController;
use App\Http\Controllers\AuditoriaController;
use App\Http\Controllers\ActivoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UsuarioDashboardController;



Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/usuario/dashboard', [UsuarioDashboardController::class, 'index'])->name('UsuarioDashboard');
Route::resource('usuarios', UsuarioController::class);
Route::resource('incidentes', IncidenteController::class);
Route::get('/alertas', [IncidenteController::class, 'getIncidentesPorOtrosUsuarios'])->name('alerts');
Route::resource('auditorias', AuditoriaController::class);
Route::get('/activos', [ActivoController::class, 'index'])->name('activos.index');
Route::post('/activos', [ActivoController::class, 'store'])->name('activos.store');
Route::put('/activos/{activo}', [ActivoController::class, 'update'])->name('activos.update');
Route::delete('/activos/{activo}', [ActivoController::class, 'destroy'])->name('activos.destroy');
Route::get('/activos-json', [ActivoController::class, 'obtenerActivosJson']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
