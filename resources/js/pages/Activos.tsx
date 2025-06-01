import { useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

interface Activo {
    id: number;
    nombre: string;
    descripcion: string;
    ubicacion: string;
}

interface ActivoForm {
    nombre: string;
    descripcion: string;
    ubicacion: string;
}

export default function Activos() {
    const { activos } = usePage<{ activos: Activo[] }>().props;
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, put, reset } = useForm<ActivoForm>({
        nombre: '',
        descripcion: '',
        ubicacion: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isEditing && data.nombre) {
            // Asumo que para editar necesitas el id, pero aquí no lo tienes en data, por eso se usa otro state
            const activoEdit = activos.find(a => a.nombre === data.nombre); // ejemplo, ajusta según ID o maneja el id correctamente
            if (!activoEdit) return;
            put(route('activos.update', activoEdit.id), {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                }
            });
        } else {
            post(route('activos.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (activo: Activo) => {
        setData({
            nombre: activo.nombre,
            descripcion: activo.descripcion,
            ubicacion: activo.ubicacion,
        });
        setIsEditing(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quieres eliminar este activo?')) {
            router.delete(route('activos.destroy', id), {
                onSuccess: () => console.log('Activo eliminado'),
                onError: (err) => console.error(err),
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Activos" />

            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6 text-white">Gestión de Activos</h1>

                {/* Formulario */}
                <div className="rounded-2xl shadow-lg p-6 mb-8 ">
                    <h2 className="text-xl font-semibold text-white mb-4">
                        {isEditing ? 'Editar Activo' : 'Crear Nuevo Activo'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Descripción"
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Ubicación"
                                value={data.ubicacion}
                                onChange={(e) => setData('ubicacion', e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        <div className="mt-6 flex gap-4">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition"
                            >
                                {isEditing ? 'Actualizar Activo' : 'Crear Activo'}
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

                {/* Tabla de activos */}
                <div className="rounded-2xl shadow-lg p-6 overflow-x-auto">
                    <h2 className="text-xl font-semibold text-white mb-4">Activos Registrados</h2>
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-blue-100 text-left text-gray-700">
                                <th className="p-3">ID</th>
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Descripción</th>
                                <th className="p-3">Ubicación</th>
                                <th className="p-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activos.map((activo) => (
                                <tr key={activo.id} className="text-sm hover:bg-gray-800">
                                    <td className="p-3">{activo.id}</td>
                                    <td className="p-3">{activo.nombre}</td>
                                    <td className="p-3">{activo.descripcion}</td>
                                    <td className="p-3">{activo.ubicacion}</td>
                                    <td className="p-3 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(activo)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(activo.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
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
