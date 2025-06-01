import { useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface UsuarioForm {
    id?: number;
    nombre: string;
    apellido: string;
    email: string;
    password?: string;
    rol: string;
    departamento: string;
}

interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: string;
    departamento: string;
}

const departamentos = [
    'Desarrollo de Producto/Software',
    'Diseño y Experiencia de Usuario (UX/UI)',
    'Gestión de Producto',
    'Ventas y Marketing',
    'Operaciones y Administración',
    'Soporte al Cliente y Success',
    'Innovación y I+D (Investigación y Desarrollo)',
    'IT y Seguridad'
];

const rolesFijos = [
    { value: 'usuario', label: 'Usuario' },
    { value: 'administrador', label: 'Administrador' }
];

export default function Usuarios() {
    const { usuarios } = usePage<{ usuarios: Usuario[] }>().props;
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, put, reset, errors } = useForm<UsuarioForm>({
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        rol: '',
        departamento: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEditing && data.id) {
            put(route('usuarios.update', { id: data.id }), {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                },
            });
        } else {
            post(route('usuarios.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (usuario: Usuario) => {
        setData({
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.rol,
            departamento: usuario.departamento,
            password: '',
        });
        setIsEditing(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            router.delete(route('usuarios.destroy', { id }), {
                onSuccess: () => console.log('Usuario eliminado correctamente'),
                onError: (errors) => console.error('Error al eliminar:', errors),
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Usuarios" />

            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Usuarios</h1>

                {/* Formulario */}
                <div className="rounded-2xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="text"
                                placeholder="Apellido"
                                value={data.apellido}
                                onChange={(e) => setData('apellido', e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            {/* Mostrar password solo para creación o edición con campo visible */}
                            {!isEditing && (
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={data.password || ''}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            )}
                            {isEditing && (
                                <input
                                    type="password"
                                    placeholder="Nueva contraseña (opcional)"
                                    value={data.password || ''}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            )}

                            {/* Select para Departamento */}
                            <select
                                value={data.departamento}
                                onChange={(e) => setData('departamento', e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Seleccione un Departamento</option>
                                {departamentos.map((dep) => (
                                    <option key={dep} value={dep}>
                                        {dep}
                                    </option>
                                ))}
                            </select>

                            {/* Select fijo para Rol */}
                            <select
                                value={data.rol}
                                onChange={(e) => setData('rol', e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                <option value="">Seleccione un Rol</option>
                                {rolesFijos.map((rol) => (
                                    <option key={rol.value} value={rol.value}>
                                        {rol.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-6 flex gap-4">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition"
                            >
                                {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg transition"
                                    onClick={() => {
                                        reset();
                                        setIsEditing(false);
                                    }}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Tabla de Usuarios */}
                <div className="rounded-2xl shadow-lg p-6 overflow-x-auto">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Usuarios Registrados</h2>
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-blue-100 text-left text-gray-700">
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Apellido</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Rol</th>
                                <th className="p-3">Departamento</th>
                                <th className="p-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id} className="border-b border-gray-200 hover:bg-gray-800">
                                    <td className="p-3">{usuario.nombre}</td>
                                    <td className="p-3">{usuario.apellido}</td>
                                    <td className="p-3">{usuario.email}</td>
                                    <td className="p-3 capitalize">{usuario.rol}</td>
                                    <td className="p-3">{usuario.departamento}</td>
                                    <td className="p-3 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(usuario)}
                                            className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded text-white"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(usuario.id)}
                                            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
