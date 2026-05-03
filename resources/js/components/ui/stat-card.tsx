import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    color?: 'blue' | 'emerald' | 'purple' | 'orange';
    trend?: {
        value: string;
        type: 'up' | 'down' | 'neutral';
    };
}

const colorVariants = {
    blue: 'bg-blue-500/10 text-blue-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    purple: 'bg-purple-500/10 text-purple-500',
    orange: 'bg-orange-500/10 text-orange-500',
};

export function StatCard({
    label,
    value,
    icon: Icon,
    color = 'emerald',
    trend,
}: StatCardProps) {
    return (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md">

            {/* TOP */}
            <div className="flex items-start justify-between">

                {/* ICON */}
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorVariants[color]}`}>
                    <Icon className="h-5 w-5" />
                </div>

                {/* TREND */}
                {trend && (
                    <div
                        className={`
                            flex items-center gap-1 text-xs font-medium
                            ${
                                trend.type === 'up'
                                    ? 'text-emerald-500'
                                    : trend.type === 'down'
                                    ? 'text-red-500'
                                    : 'text-muted-foreground'
                            }
                        `}
                    >
                        {trend.type === 'up' && <ArrowUpRight className="h-3.5 w-3.5" />}
                        {trend.type === 'down' && <ArrowDownRight className="h-3.5 w-3.5" />}
                        {trend.type === 'neutral' && <Minus className="h-3.5 w-3.5" />}
                        {trend.value}
                    </div>
                )}
            </div>

            {/* VALUE */}
            <div className="mt-4 text-2xl font-semibold text-foreground">
                {value}
            </div>

            {/* LABEL */}
            <div className="text-sm text-muted-foreground">
                {label}
            </div>
        </div>
    );
}