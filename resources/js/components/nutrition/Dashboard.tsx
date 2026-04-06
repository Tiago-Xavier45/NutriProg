import { usePage } from '@inertiajs/react';
import { Users, UtensilsCrossed, Calendar, TrendingUp } from 'lucide-react';
import { PageHeader, StatCard, ContentCard } from '@/components/ui';

interface PageProps {
    stats: Array<{
        name: string;
        value: string;
        change: string;
        changeType: 'positive' | 'negative' | 'neutral';
        icon: string;
        color: string;
    }>;
    recentPatients: Array<{
        id: number;
        name: string;
        plan: string;
        lastVisit: string;
        status: string;
    }>;
}

const iconMap: Record<string, any> = {
    Users,
    UtensilsCrossed,
    Calendar,
    TrendingUp,
};

const colorMap: Record<string, 'blue' | 'emerald' | 'purple' | 'orange'> = {
    'bg-blue-500': 'blue',
    'bg-emerald-500': 'emerald',
    'bg-purple-500': 'purple',
    'bg-orange-500': 'orange',
};

const trendMap: Record<string, 'up' | 'down' | 'neutral'> = {
    positive: 'up',
    negative: 'down',
    neutral: 'neutral',
};

export function Dashboard() {
    const { stats, recentPatients } = usePage<PageProps>().props;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description="Visão geral do seu consultório"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = iconMap[stat.icon] || Users;
                    const color = colorMap[stat.color] || 'emerald';
                    const trend = trendMap[stat.changeType] || 'neutral';
                    
                    return (
                        <StatCard
                            key={stat.name}
                            label={stat.name}
                            value={stat.value}
                            icon={Icon}
                            color={color}
                            trend={{
                                value: stat.change,
                                type: trend,
                            }}
                        />
                    );
                })}
            </div>

            <ContentCard
                showHeader={{ title: 'Últimos Pacientes' }}
            >
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
            </ContentCard>
        </div>
    );
}
