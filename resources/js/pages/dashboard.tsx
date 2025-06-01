import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Pie } from 'react-chartjs-2';
import {
    Chart,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { CalendarDays, Users, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

Chart.register(ArcElement, Tooltip, Legend);

interface Usuario {
    nombre: string;
    apellido: string;
}

interface IncidentePorFecha {
    fecha: string;
    total: number;
}

interface DashboardProps {
    totalIncidentes: number;
    incidentesAbiertos: number;
    incidentesEnProgreso: number;
    incidentesCerrados: number;
    incidentesBajos: number;
    incidentesMedios: number;
    incidentesAltos: number;
    incidentesCriticos: number;
    usuarios: Usuario[];
    incidentesPorFecha: IncidentePorFecha[];
}

const breadcrumbs = [{ title: 'Dashboard', href: '/dashboard' }];

// Componente para círculo de progreso con número en el centro
function ProgressCircle({ day, maxDay }: { day: number; maxDay: number }) {
    const radius = 28;
    const stroke = 5;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (day / maxDay) * circumference;

    return (
        <svg height={radius * 2} width={radius * 2} className="mx-auto mb-2">
            <circle
                stroke="#444C6B"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <circle
                stroke="#ffffff"
                fill="transparent"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
            />
            <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontWeight="bold"
                fontSize="14"
                fill="white"
            >
                {day}
            </text>
        </svg>
    );
}

export default function Dashboard() {
    const {
        totalIncidentes,
        incidentesAbiertos,
        incidentesEnProgreso,
        incidentesCerrados,
        incidentesBajos,
        incidentesMedios,
        incidentesAltos,
        incidentesCriticos,
        usuarios,
        incidentesPorFecha,
    } = usePage<DashboardProps>().props;

    const pieData = {
        labels: ['Alerta baja', 'Alerta media', 'Alerta alta', 'Alerta crítica'],
        datasets: [
            {
                data: [
                    incidentesBajos ?? 0,
                    incidentesMedios ?? 0,
                    incidentesAltos ?? 0,
                    incidentesCriticos ?? 0,
                ],
                backgroundColor: ['#4FC3F7', '#FFD54F', '#FF8A65', '#E57373'],
                borderWidth: 1,
            },
        ],
    };

    const pieOptions = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value} incidentes`;
                    },
                },
            },
            legend: {
                labels: {
                    color: '#E0E0E0',
                },
            },
        },
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="bg-[#18122B] min-h-screen p-6 text-white font-sans">
                <h1 className="text-3xl font-bold text-center mb-8">Panel de Incidentes</h1>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card title="Total Incidentes" value={totalIncidentes} color="from-purple-500 to-indigo-500" icon={<AlertCircle size={32} />} />
                    <Card title="Abiertos" value={incidentesAbiertos} color="from-pink-500 to-rose-500" icon={<Clock size={32} />} />
                    <Card title="En Progreso" value={incidentesEnProgreso} color="from-yellow-500 to-orange-400" icon={<Users size={32} />} />
                    <Card title="Cerrados" value={incidentesCerrados} color="from-green-400 to-emerald-500" icon={<CheckCircle size={32} />} />
                </div>

                <div className="mt-10 flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-2/3 p-6 rounded-2xl bg-[#1F1D2B] shadow-lg">
                        <h2 className="text-2xl font-semibold text-center mb-4">Incidentes por Severidad</h2>
                        <div className="w-full max-w-xl mx-auto">
                            <Pie data={pieData} options={pieOptions} />
                        </div>
                    </div>

                    <div className="lg:w-1/3 p-6 rounded-2xl bg-[#1F1D2B] shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">Usuarios Registrados</h2>
                        <ul className="space-y-2">
                            {usuarios.map((usuario, index) => (
                                <li key={index} className="bg-[#292C3E] p-3 rounded-lg">
                                    {usuario.nombre} {usuario.apellido}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {incidentesPorFecha.map((item, i) => {
                        const dateObj = new Date(item.fecha);
                        const monthName = format(dateObj, 'LLLL', { locale: es }); // nombre completo del mes en español
                        const year = format(dateObj, 'yyyy');
                        const day = dateObj.getDate();
                        const maxDay = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0).getDate();

                    return (
                        <div
                            key={i}
                            className="p-4 rounded-xl shadow text-white"
                            style={{
                                background: `linear-gradient(135deg,rgb(235, 57, 226),rgb(246, 165, 59))`,
                            }}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <div className="text-2xl font-bold select-none">
                                        {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                                    </div>
                                    <hr className="border-t-2 border-white w-12 my-1 mx-0" />
                                    <div className="text-sm select-none">{year}</div>
                                </div>
                                <div>
                                    <ProgressCircle day={day} maxDay={maxDay} />
                                </div>
                            </div>
                            <p className="mt-1 text-base opacity-100 font-bold">{item.total} incidentes</p>
                        </div>
                    );

                    })}
                </div>
            </div>
        </AppLayout>
    );
}

function Card({ title, value, color, icon }: { title: string; value: number; color: string; icon: React.ReactNode }) {
    return (
        <div className={`p-6 rounded-2xl shadow-md bg-gradient-to-r ${color} text-black font-bold flex flex-col items-center justify-center`}>
            {icon}
            <h2 className="text-lg mt-2">{title}</h2>
            <p className="text-3xl">{value}</p>
        </div>
    );
}
