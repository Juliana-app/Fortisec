import { useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface IncidenteForm {
    titulo: string;
    descripcion: string;
    severidad: string;
    estado: string;
    usuario_email: string;
    activo_involucrado: string;
    comentario_cierre: string;
    mitigacion: string;
}

interface Incidente {
    id: number;
    titulo: string;
    descripcion: string;
    severidad: string;
    estado: string;
    usuario_email: string;
    activo_involucrado: string;
    comentario_cierre: string;
    mitigacion: string;
    fecha: string;
}

interface Usuario {
    email: string;
    nombre: string;
}

interface Activo {
    id: string;
    nombre: string;
}

export default function Incidentes() {
    const { incidentes, usuarios, activos } = usePage<{ incidentes: Incidente[], usuarios: Usuario[], activos: Activo[] }>().props;
    const [editingIncidente, setEditingIncidente] = useState<Incidente | null>(null);

    const { data, setData, post, put, delete: destroy, reset, errors } = useForm<IncidenteForm>({
        titulo: '',
        descripcion: '',
        severidad: 'Media',
        estado: 'Abierto',
        usuario_email: '',
        activo_involucrado: '',
        comentario_cierre: '',
        mitigacion: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (data.estado === 'Cerrado' && !data.comentario_cierre.trim()) {
            alert('Debe ingresar un comentario de cierre para cerrar el incidente.');
            return;
        }

        if (editingIncidente) {
            put(route('incidentes.update', editingIncidente.id), {
                onSuccess: () => {
                    reset();
                    setEditingIncidente(null);
                },
            });
        } else {
            post(route('incidentes.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (incidente: Incidente) => {
        setEditingIncidente(incidente);
        setData({
            titulo: incidente.titulo,
            descripcion: incidente.descripcion,
            severidad: incidente.severidad,
            estado: incidente.estado,
            usuario_email: incidente.usuario_email,
            activo_involucrado: incidente.activo_involucrado,
            comentario_cierre: incidente.comentario_cierre,
            mitigacion: incidente.mitigacion,
        });
    };

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quieres eliminar este incidente?')) {
            destroy(route('incidentes.destroy', id));
        }
    };

    return (
        <AppLayout>
            <Head title="Incidentes" />
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">Gestión de Incidentes</h1>

                <div className=" rounded shadow-md p-6 mb-8 max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-1 font-semibold" htmlFor="titulo">Título</label>
                                <input
                                    id="titulo"
                                    type="text"
                                    placeholder="Título"
                                    value={data.titulo}
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.titulo && <p className="text-red-600 text-sm mt-1">{errors.titulo}</p>}
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold" htmlFor="usuario_email">Usuario</label>
                                <select
                                    id="usuario_email"
                                    value={data.usuario_email}
                                    onChange={(e) => setData('usuario_email', e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccionar Usuario</option>
                                    {usuarios.map((usuario) => (
                                        <option key={usuario.email} value={usuario.email}>
                                            {usuario.nombre} - {usuario.email}
                                        </option>
                                    ))}
                                </select>
                                {errors.usuario_email && <p className="text-red-600 text-sm mt-1">{errors.usuario_email}</p>}
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold" htmlFor="activo_involucrado">Activo Involucrado</label>
                                <select
                                    id="activo_involucrado"
                                    value={data.activo_involucrado}
                                    onChange={(e) => setData('activo_involucrado', e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Seleccionar Activo</option>
                                    {activos.map((activo) => (
                                        <option key={activo.id} value={activo.id}>
                                            {activo.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.activo_involucrado && <p className="text-red-600 text-sm mt-1">{errors.activo_involucrado}</p>}
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold" htmlFor="estado">Estado</label>
                                <select
                                    id="estado"
                                    value={data.estado}
                                    onChange={(e) => setData('estado', e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Abierto">Abierto</option>
                                    <option value="En Progreso">En Progreso</option>
                                    <option value="Cerrado">Cerrado</option>
                                </select>
                                {errors.estado && <p className="text-red-600 text-sm mt-1">{errors.estado}</p>}
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold" htmlFor="severidad">Severidad</label>
                                <select
                                    id="severidad"
                                    value={data.severidad}
                                    onChange={(e) => setData('severidad', e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Baja">Baja</option>
                                    <option value="Media">Media</option>
                                    <option value="Alta">Alta</option>
                                </select>
                                {errors.severidad && <p className="text-red-600 text-sm mt-1">{errors.severidad}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 font-semibold" htmlFor="descripcion">Descripción</label>
                            <textarea
                                id="descripcion"
                                placeholder="Descripción"
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={4}
                                required
                            ></textarea>
                            {errors.descripcion && <p className="text-red-600 text-sm mt-1">{errors.descripcion}</p>}
                        </div>

                        {data.estado === 'Cerrado' && (
                            <div>
                                <label className="block mb-1 font-semibold" htmlFor="comentario_cierre">Comentario de cierre</label>
                                <textarea
                                    id="comentario_cierre"
                                    placeholder="Comentario de cierre"
                                    value={data.comentario_cierre}
                                    onChange={(e) => setData('comentario_cierre', e.target.value)}
                                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                ></textarea>
                                {errors.comentario_cierre && <p className="text-red-600 text-sm mt-1">{errors.comentario_cierre}</p>}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition"
                        >
                            {editingIncidente ? 'Actualizar Incidente' : 'Crear Incidente'}
                        </button>
                    </form>
                </div>

                <h2 className="text-2xl font-semibold mb-4 max-w-4xl mx-auto">Incidentes Existentes</h2>
                <div className="overflow-x-auto max-w-6xl mx-auto">
                    <table className="table-auto w-full border border-gray-300 rounded shadow-sm ">
                        <thead>
                            <tr className="bg-blue-100 text-left text-gray-700">
                                <th className="border px-4 py-2 text-left">Título</th>
                                <th className="border px-4 py-2 text-left">Estado</th>
                                <th className="border px-4 py-2 text-left">Severidad</th>
                                <th className="border px-4 py-2 text-left">Usuario</th>
                                <th className="border px-4 py-2 text-left">Activo</th>
                                <th className="border px-4 py-2 text-left">Comentario Cierre</th>
                                <th className="border px-4 py-2 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incidentes.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="border px-4 py-3 text-center text-gray-500">
                                        No hay incidentes registrados.
                                    </td>
                                </tr>
                            )}
                            {incidentes.map((incidente) => (
                                <tr key={incidente.id} className="text-sm hover:bg-gray-800">
                                    <td className="border px-4 py-2">{incidente.titulo}</td>
                                    <td className="border px-4 py-2">{incidente.estado}</td>
                                    <td className="border px-4 py-2">{incidente.severidad}</td>
                                    <td className="border px-4 py-2">{incidente.usuario_email}</td>
                                    <td className="border px-4 py-2">{incidente.activo_involucrado}</td>
                                    <td className="border px-4 py-2">{incidente.comentario_cierre || '-'}</td>
                                    <td className="border px-4 py-2 space-x-2">
                                        <button
                                            onClick={() => handleEdit(incidente)}
                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(incidente.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
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
