import { usePage } from '@inertiajs/react';
import { Users, UtensilsCrossed, Calendar, TrendingUp } from 'lucide-react';
import { PageHeader, StatCard, ContentCard } from '@/components/ui';

interface PageProps extends Record<string, unknown> {
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

            {/* HEADER */}
            <PageHeader
                title="Dashboard"
                description="Visão geral do seu consultório"
            />

            {/* STATS */}
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

            {/* TABELA */}
            <ContentCard showHeader={{ title: 'Últimos Pacientes' }}>
                <div className="overflow-x-auto">

                    <table className="w-full text-sm">
                        
                        {/* HEADER */}
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Paciente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Plano
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Última Visita
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody className="divide-y divide-border">
                            {recentPatients.map((patient) => (
                                <tr
                                    key={patient.id}
                                    className="transition-colors hover:bg-muted/40"
                                >
                                    {/* PACIENTE */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">

                                            {/* Avatar */}
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                                {patient.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')
                                                    .slice(0, 2)}
                                            </div>

                                            <span className="font-medium text-foreground">
                                                {patient.name}
                                            </span>
                                        </div>
                                    </td>

                                    {/* PLANO */}
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {patient.plan}
                                    </td>

                                    {/* VISITA */}
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {patient.lastVisit || '—'}
                                    </td>

                                    {/* STATUS */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`
                                                rounded-full px-2.5 py-1 text-xs font-medium
                                                ${
                                                    patient.status === 'Ativo'
                                                        ? 'bg-primary/10 text-primary'
                                                        : patient.status === 'Pendente'
                                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                        : 'bg-muted text-muted-foreground'
                                                }
                                            `}
                                        >
                                            {patient.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* EMPTY STATE */}
                    {recentPatients.length === 0 && (
                        <div className="p-8 text-center text-sm text-muted-foreground">
                            Nenhum paciente recente
                        </div>
                    )}
                </div>
            </ContentCard>
        </div>
    );
}