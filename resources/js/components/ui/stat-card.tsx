import { type LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string;
    icon: LucideIcon;
    color: 'blue' | 'emerald' | 'purple' | 'orange';
    trend?: {
        value: string;
        type: 'up' | 'down' | 'neutral';
    };
}

const colorMap = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
};

const trendColorMap = {
    up: 'text-emerald-600',
    down: 'text-red-500',
    neutral: 'text-gray-500',
};

export function StatCard({ label, value, icon: Icon, color, trend }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className={`${colorMap[color]} p-3 rounded-lg shadow-sm`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm ${trendColorMap[trend.type]}`}>
                        {trend.type === 'up' && <ArrowUpRight className="w-4 h-4" />}
                        {trend.type === 'down' && <ArrowDownRight className="w-4 h-4" />}
                        {trend.value}
                    </div>
                )}
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-gray-500 text-sm">{label}</p>
        </div>
    );
}
