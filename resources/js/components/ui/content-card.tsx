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
        <div className={` bg-card text-card-foreground  rounded-xl shadow-sm border border-border overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}>
            {(showSearch || showHeader) && (
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        {showHeader && (
                            <h2 className="text-lg font-semibold text-white-900">{showHeader.title}</h2>
                        )}
                        {showSearch && (
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={showSearch.placeholder || "Buscar..."}
                                    value={showSearch.value}
                                    onChange={(e) => showSearch.onChange(e.target.value)}
                                    className=" w-full pl-10 pr-4 py-2  border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring focus:border-ring "
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
