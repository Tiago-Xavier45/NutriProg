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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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

            <ContentCard showHeader={{ title: 'Últimos Pacientes' }}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Paciente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Plano
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Última Visita
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentPatients.map((patient) => (
                                <tr
                                    key={patient.id}
                                    className="transition-colors hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                                                <span className="text-sm font-medium text-emerald-700">
                                                    {patient.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')}
                                                </span>
                                            </div>
                                            <span className="ml-3 text-sm font-medium text-gray-900">
                                                {patient.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600">
                                        {patient.plan}
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                        {patient.lastVisit}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                patient.status === 'Ativo'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                        >
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
