<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UsuarioController extends Controller
{
    public function index()
    {
        $usuarios = Usuario::all();
        return Inertia::render('Usuarios', ['usuarios' => $usuarios]);
    }

   public function store(Request $request)
{
    $validated = $request->validate([
        'nombre' => 'required|string',
        'apellido' => 'required|string',
        'email' => 'required|email|unique:usuarios,email',
        'password' => 'required|min:6',
        'rol' => 'required|string',
        'departamento' => 'required|string',
    ]);

    // Crear usuario en tabla usuarios
    $usuario = Usuario::create([
        'nombre' => $validated['nombre'],
        'apellido' => $validated['apellido'],
        'email' => $validated['email'],
        'password' => $validated['password'], // se espera mutator
        'rol' => $validated['rol'],
        'departamento' => $validated['departamento'],
    ]);

    // Crear también en tabla users para login
    User::create([
        'name' => $validated['nombre'], // <- AQUÍ ESTABA FALLANDO SI FALTABA
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
        'rol' => $validated['rol'],
    ]);

    // Redirección según rol
    if ($usuario->rol === 'administrador') {
        return response()->json(['redirect' => route('dashboard')]);
    } elseif ($usuario->rol === 'usuario') {
        return response()->json(['redirect' => route('UsuarioDashboard')]);
    }

}

    public function update(Request $request, Usuario $usuario)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:usuarios,email,' . $usuario->id,
            'rol' => 'required|string|in:administrador,usuario',
            'departamento' => 'required|string|max:255',
            'password' => 'nullable|string|min:6',
        ]);

        // Email original para buscar en tabla users
        $emailAnterior = $usuario->email;

        // Actualizar campos
        $usuario->nombre = $validated['nombre'];
        $usuario->apellido = $validated['apellido'];
        $usuario->email = $validated['email'];
        $usuario->rol = $validated['rol'];
        $usuario->departamento = $validated['departamento'];

        if (!empty($validated['password'])) {
            $usuario->password = Hash::make($validated['password']); // Solo si el mutator no lo hace
        }

        $usuario->save();

        // Sincronizar con tabla users
        $user = User::where('email', $emailAnterior)->first();
        if ($user) {
            $user->name = $validated['nombre'];
            $user->email = $validated['email'];
            $user->rol = $validated['rol'];
            if (!empty($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }
            $user->save();
        }
    }

    public function destroy(Usuario $usuario)
    {
        // Eliminar el usuario correspondiente de la tabla users
        User::where('email', $usuario->email)->delete();

        // Eliminar de la tabla usuarios
        $usuario->delete();

    }
}
