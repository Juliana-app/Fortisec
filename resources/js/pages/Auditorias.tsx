import { useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

// Interfaces
interface AuditoriaForm {
  id?: number;
  numero_auditoria: string;
  id_incidente: number;
  estado_incidente: 'Pendiente' | 'En Proceso' | 'Cerrado';
  plan_accion: string[];
  fecha_plan_accion: string;
  estado: 'Pendiente' | 'En Proceso' | 'Cerrado';
  cierre: boolean;
  comentario_final: string;
}

interface Auditoria extends AuditoriaForm {
  id: number;
}

interface Incidente {
  id: number;
  descripcion: string;
  estado_incidente: 'Pendiente' | 'En Proceso' | 'Cerrado';
}

export default function Auditorias() {
  const { auditorias, incidentes } = usePage<{ auditorias: Auditoria[], incidentes: Incidente[] }>().props;
  const [isEditing, setIsEditing] = useState(false);

  const { data, setData, post, put, delete: destroy, reset, errors } = useForm<AuditoriaForm>({
    numero_auditoria: '',
    id_incidente: incidentes.length > 0 ? incidentes[0].id : 0,
    estado_incidente: 'Pendiente',
    plan_accion: [''],
    fecha_plan_accion: '',
    estado: 'Pendiente',
    cierre: false,
    comentario_final: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isEditing && data.id) {
      put(route('auditorias.update', { id: data.id }), {
        data: { ...data },
        onSuccess: () => {
          reset();
          setIsEditing(false);
        }
      });
    } else {
      post(route('auditorias.store'), {
        data: { ...data },
        onSuccess: () => reset()
      });
    }
  };

  const handleEdit = (auditoria: Auditoria) => {
    setData({ ...auditoria });
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Seguro que quieres eliminar esta auditoría?')) {
      destroy(route('auditorias.destroy', { id }), {
        onSuccess: () => console.log("Auditoría eliminada correctamente.")
      });
    }
  };

  return (
    <AppLayout>
      <Head title="Auditorías" />

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-white">Gestión de Auditorías</h1>

        {/* Formulario */}
        <div className="rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {isEditing ? 'Editar Auditoría' : 'Crear Nueva Auditoría'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Número de Auditoría"
                value={data.numero_auditoria}
                onChange={e => setData('numero_auditoria', e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <select
                value={data.id_incidente}
                onChange={e => setData('id_incidente', Number(e.target.value))}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {incidentes.length > 0 ? (
                  incidentes.map(incidente => (
                    <option key={incidente.id} value={incidente.id}>
                      {`ID: ${incidente.id} - ${incidente.descripcion} - Estado: ${incidente.estado_incidente}`}
                    </option>
                  ))
                ) : (
                  <option value={0} disabled>No hay incidentes</option>
                )}
              </select>

              <select
                value={data.estado_incidente}
                onChange={e => setData('estado_incidente', e.target.value as any)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {['Pendiente', 'En Proceso', 'Cerrado'].map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>

              <input
                type="date"
                placeholder="Fecha Plan de Acción"
                value={data.fecha_plan_accion}
                onChange={e => setData('fecha_plan_accion', e.target.value)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <select
                value={data.estado}
                onChange={e => setData('estado', e.target.value as any)}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {['Pendiente', 'En Proceso', 'Cerrado'].map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={data.cierre}
                  onChange={e => setData('cierre', e.target.checked)}
                  id="cierre-checkbox"
                  className="focus:ring-2 focus:ring-blue-400"
                />
                <label htmlFor="cierre-checkbox" className="text-gray-700">Cierre</label>
              </div>

              {/* Plan de Acción - muestra solo primer item para simplificar */}
              <textarea
                placeholder="Plan de Acción"
                value={data.plan_accion[0]}
                onChange={e => setData('plan_accion', [e.target.value])}
                className="border border-gray-300 rounded-lg p-3 col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                rows={3}
              />

              <textarea
                placeholder="Comentario Final"
                value={data.comentario_final}
                onChange={e => setData('comentario_final', e.target.value)}
                className="border border-gray-300 rounded-lg p-3 col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                rows={3}
              />
            </div>

            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition"
              >
                {isEditing ? 'Actualizar Auditoría' : 'Crear Auditoría'}
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

        {/* Tabla de Auditorías */}
        <div className="rounded-2xl shadow-lg p-6 overflow-x-auto">
          <h2 className="text-xl font-semibold text-white mb-4">Auditorías Registradas</h2>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-100 text-left text-gray-700">
                <th className="p-3">Número</th>
                <th className="p-3">Incidente</th>
                <th className="p-3">Estado Incidente</th>
                <th className="p-3">Estado Auditoría</th>
                <th className="p-3">Cierre</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {auditorias.map(auditoria => {
                const incidenteRelacionado = incidentes.find(i => i.id === auditoria.id_incidente);
                return (
                  <tr key={auditoria.id} className="text-sm hover:bg-gray-800">
                    <td className="p-3">{auditoria.numero_auditoria}</td>
                    <td className="p-3">{incidenteRelacionado ? incidenteRelacionado.descripcion : 'N/A'}</td>
                    <td className="p-3">{auditoria.estado_incidente}</td>
                    <td className="p-3">{auditoria.estado}</td>
                    <td className="p-3">{auditoria.cierre ? 'Sí' : 'No'}</td>
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
                );
              })}
              {auditorias.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-3 text-center text-gray-500">
                    No hay auditorías registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
