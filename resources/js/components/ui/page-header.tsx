import { type LucideIcon } from 'lucide-react';
import { Plus } from 'lucide-react';

interface PageHeaderProps {
    title: string;
    description?: string;
    count?: string;
    action?: {
        label: string;
        icon?: LucideIcon;
        onClick: () => void;
    };
}

export function PageHeader({ title, description, count, action }: PageHeaderProps) {
    const ActionIcon = action?.icon || Plus;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 px-6">
            <div>
                <h1 className="text-2xl font-bold text-white-900">{title}</h1>
                <div className="flex items-center gap-2 mt-1">
                    {count && (
                        <p className="text-sm text-white-500">{count}</p>
                    )}
                    {description && (
                        <>
                            {count && <span className="text-white-300">•</span>}
                            <p className="text-sm text-white-500">{description}</p>
                        </>
                    )}
                </div>
            </div>
            {action && (
                <button
                    onClick={action.onClick}
                    className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                >
                    <ActionIcon className="w-5 h-5" />
                    {action.label}
                </button>
            )}
        </div>
    );
}
