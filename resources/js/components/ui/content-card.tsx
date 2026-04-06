import { Search, type LucideIcon } from 'lucide-react';

interface ContentCardProps {
    children: React.ReactNode;
    className?: string;
    showSearch?: {
        placeholder?: string;
        value: string;
        onChange: (value: string) => void;
    };
    showHeader?: {
        title: string;
        icon?: LucideIcon;
    };
    onClick?: () => void;
}

export function ContentCard({ 
    children, 
    className = '', 
    showSearch,
    showHeader,
    onClick 
}: ContentCardProps) {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}>
            {(showSearch || showHeader) && (
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        {showHeader && (
                            <h2 className="text-lg font-semibold text-gray-900">{showHeader.title}</h2>
                        )}
                        {showSearch && (
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={showSearch.placeholder || "Buscar..."}
                                    value={showSearch.value}
                                    onChange={(e) => showSearch.onChange(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div onClick={onClick}>
                {children}
            </div>
        </div>
    );
}
