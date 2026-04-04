import { Users, UtensilsCrossed, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const stats = [
    {
        name: 'Total de Pacientes',
        value: '127',
        change: '+12%',
        changeType: 'positive',
        icon: Users,
        color: 'bg-blue-500',
    },
    {
        name: 'Planos Ativos',
        value: '89',
        change: '+5%',
        changeType: 'positive',
        icon: UtensilsCrossed,
        color: 'bg-emerald-500',
    },
    {
        name: 'Consultas Hoje',
        value: '8',
        change: '-2%',
        changeType: 'negative',
        icon: Calendar,
        color: 'bg-purple-500',
    },
    {
        name: 'Receita Mensal',
        value: 'R$ 12.450',
        change: '+18%',
        changeType: 'positive',
        icon: TrendingUp,
        color: 'bg-orange-500',
    },
];

const recentPatients = [
    { id: 1, name: 'Maria Silva', plan: 'Low Carb', lastVisit: '28/03/2024', status: 'Ativo' },
    { id: 2, name: 'João Santos', plan: 'Mediterrânea', lastVisit: '27/03/2024', status: 'Ativo' },
    { id: 3, name: 'Ana Costa', plan: 'Halal', lastVisit: '26/03/2024', status: 'Pendente' },
    { id: 4, name: 'Pedro Oliveira', plan: 'Vegetariana', lastVisit: '25/03/2024', status: 'Ativo' },
    { id: 5, name: 'Carla Mendes', plan: 'Low FODMAP', lastVisit: '24/03/2024', status: 'Ativo' },
];

export function Dashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Visão geral do seu consultório</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <div className={`flex items-center text-sm ${
                                    stat.changeType === 'positive' ? 'text-emerald-600' : 'text-red-500'
                                }`}>
                                    {stat.changeType === 'positive' ? (
                                        <ArrowUpRight className="w-4 h-4" />
                                    ) : (
                                        <ArrowDownRight className="w-4 h-4" />
                                    )}
                                    {stat.change}
                                </div>
                            </div>
                            <p className="mt-4 text-3xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-gray-500 text-sm">{stat.name}</p>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Últimos Pacientes</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Paciente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Plano
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Última Visita
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <span className="text-emerald-700 font-medium text-sm">
                                                    {patient.name.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <span className="ml-3 text-sm font-medium text-gray-900">
                                                {patient.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {patient.plan}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {patient.lastVisit}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                            patient.status === 'Ativo'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
