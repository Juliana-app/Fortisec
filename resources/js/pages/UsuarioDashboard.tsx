import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { AlertTriangle, Send } from 'lucide-react';

export default function UsuarioDashboard() {
    const { data, setData, post, processing, errors, reset } = useForm({
        titulo: '',
        descripcion: '',
        severidad: '',
        estado: '',
        usuario_email: '',
        activo_involucrado: '',
        comentario_cierre: '',
        mitigacion: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/incidentes'); // Ruta del backend que guarda el incidente
    };

    return (
        <AppLayout>
            <Head title="Panel de Usuario" />
            <div className="bg-[#18122B] min-h-screen text-white p-8 font-sans">
                <div className="max-w-4xl mx-auto bg-[#1F1D2B] p-8 rounded-2xl shadow-lg">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-green-400 flex items-center justify-center gap-2">
                            <AlertTriangle className="text-yellow-400" /> Reportar Incidente
                        </h1>
                        <p className="text-gray-300 mt-2">Llena el siguiente formulario para crear un nuevo incidente.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block mb-1 text-sm font-medium">Título</label>
                            <input
                                type="text"
                                className="w-full p-3 rounded-lg bg-[#292C3E] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                                value={data.titulo}
                                onChange={(e) => setData('titulo', e.target.value)}
                            />
                            {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Descripción</label>
                            <textarea
                                className="w-full p-3 rounded-lg bg-[#292C3E] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                                rows={4}
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                            />
                            {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium">Severidad</label>
                                <select
                                    className="w-full p-3 rounded-lg bg-[#292C3E] text-white border border-gray-600"
                                    value={data.severidad}
                                    onChange={(e) => setData('severidad', e.target.value)}
                                >
                                    <option value="">Selecciona</option>
                                    <option value="baja">Baja</option>
                                    <option value="media">Media</option>
                                    <option value="alta">Alta</option>
                                    <option value="crítica">Crítica</option>
                                </select>
                                {errors.severidad && <p className="text-red-500 text-sm mt-1">{errors.severidad}</p>}
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium">Estado</label>
                                <select
                                    className="w-full p-3 rounded-lg bg-[#292C3E] text-white border border-gray-600"
                                    value={data.estado}
                                    onChange={(e) => setData('estado', e.target.value)}
                                >
                                    <option value="">Selecciona</option>
                                    <option value="abierto">Abierto</option>
                                    <option value="en progreso">En Progreso</option>
                                    <option value="cerrado">Cerrado</option>
                                </select>
                                {errors.estado && <p className="text-red-500 text-sm mt-1">{errors.estado}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Correo del Usuario</label>
                            <input
                                type="email"
                                className="w-full p-3 rounded-lg bg-[#292C3E] text-white border border-gray-600"
                                value={data.usuario_email}
                                onChange={(e) => setData('usuario_email', e.target.value)}
                            />
                            {errors.usuario_email && <p className="text-red-500 text-sm mt-1">{errors.usuario_email}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium">Activo Involucrado</label>
                            <input
                                type="text"
                                className="w-full p-3 rounded-lg bg-[#292C3E] text-white border border-gray-600"
                                value={data.activo_involucrado}
                                onChange={(e) => setData('activo_involucrado', e.target.value)}
                            />
                            {errors.activo_involucrado && <p className="text-red-500 text-sm mt-1">{errors.activo_involucrado}</p>}
                        </div>

                        <div className="text-center pt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black font-bold py-3 px-8 rounded-xl flex items-center justify-center mx-auto gap-2 transition duration-200"
                            >
                                <Send size={20} />
                                Crear Incidente
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
