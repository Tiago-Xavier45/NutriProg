import { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, Users, UtensilsCrossed, BarChart3, PieChart, Filter } from 'lucide-react';
import { PageHeader, ContentCard, StatCard } from '@/components/ui';

interface Report {
    id: number;
    title: string;
    type: 'pacientes' | 'financeiro' | 'planos' | 'consultas';
    period: string;
    generatedAt: string;
    size: string;
}

const mockReports: Report[] = [
    { id: 1, title: 'Evolução de Pacientes', type: 'pacientes', period: 'Março/2024', generatedAt: '01/04/2024', size: '245 KB' },
    { id: 2, title: 'Receita por Período', type: 'financeiro', period: 'Março/2024', generatedAt: '01/04/2024', size: '180 KB' },
    { id: 3, title: 'Planos Mais Utilizados', type: 'planos', period: '1º Trimestre/2024', generatedAt: '01/04/2024', size: '320 KB' },
    { id: 4, title: 'Agenda de Consultas', type: 'consultas', period: 'Março/2024', generatedAt: '01/04/2024', size: '150 KB' },
    { id: 5, title: 'Índice de Adesão aos Planos', type: 'planos', period: 'Fevereiro/2024', generatedAt: '01/03/2024', size: '290 KB' },
    { id: 6, title: 'Novos Pacientes por Mês', type: 'pacientes', period: '1º Trimestre/2024', generatedAt: '01/04/2024', size: '210 KB' },
];

const reportTypeIcons = {
    pacientes: Users,
    financeiro: TrendingUp,
    planos: UtensilsCrossed,
    consultas: Calendar,
};

const reportTypeColors = {
    pacientes: 'bg-blue-100 text-blue-600',
    financeiro: 'bg-emerald-100 text-emerald-600',
    planos: 'bg-purple-100 text-purple-600',
    consultas: 'bg-orange-100 text-orange-600',
};

const monthlyData = [
    { month: 'Jan', pacientes: 45, consultas: 120 },
    { month: 'Fev', pacientes: 52, consultas: 135 },
    { month: 'Mar', pacientes: 48, consultas: 128 },
];

const planDistribution = [
    { name: 'Low Carb', value: 35, color: '#10b981' },
    { name: 'Mediterrânea', value: 25, color: '#3b82f6' },
    { name: 'Vegetariana', value: 20, color: '#8b5cf6' },
    { name: 'Outros', value: 20, color: '#6b7280' },
];

export function Reports() {
    const [reports] = useState<Report[]>(mockReports);
    const [selectedPeriod, setSelectedPeriod] = useState('marco');
    const [selectedType, setSelectedType] = useState<string>('all');

    const filteredReports = selectedType === 'all' 
        ? reports 
        : reports.filter(r => r.type === selectedType);

    const handleDownload = (report: Report) => {
        alert(`Baixando relatório: ${report.title}`);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Relatórios"
                description="Análises e extrações de dados"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Estatísticas Gerais</h2>
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                    <select
                                        value={selectedPeriod}
                                        onChange={(e) => setSelectedPeriod(e.target.value)}
                                        className="text-sm border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        <option value="marco">Março/2024</option>
                                        <option value="fevereiro">Fevereiro/2024</option>
                                        <option value="janeiro">Janeiro/2024</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm text-gray-600">Pacientes</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">127</p>
                                    <p className="text-xs text-emerald-600">+12% vs mês anterior</p>
                                </div>
                                <div className="bg-emerald-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
                                        <span className="text-sm text-gray-600">Planos Ativos</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">89</p>
                                    <p className="text-xs text-emerald-600">+5% vs mês anterior</p>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-5 h-5 text-purple-600" />
                                        <span className="text-sm text-gray-600">Consultas</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">128</p>
                                    <p className="text-xs text-red-500">-3% vs mês anterior</p>
                                </div>
                                <div className="bg-orange-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-5 h-5 text-orange-600" />
                                        <span className="text-sm text-gray-600">Receita</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">R$12.4k</p>
                                    <p className="text-xs text-emerald-600">+18% vs mês anterior</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4" />
                                        Pacientes e Consultas
                                    </h3>
                                    <div className="space-y-3">
                                        {monthlyData.map((data) => (
                                            <div key={data.month} className="flex items-center gap-4">
                                                <span className="w-8 text-sm text-gray-500">{data.month}</span>
                                                <div className="flex-1 flex gap-2">
                                                    <div className="flex-1 bg-blue-500 rounded-full h-6 flex items-center justify-end pr-2" style={{ width: `${data.pacientes}%`, minWidth: '40px' }}>
                                                        <span className="text-xs text-white font-medium">{data.pacientes}</span>
                                                    </div>
                                                    <div className="flex-1 bg-emerald-500 rounded-full h-6 flex items-center justify-end pr-2" style={{ width: `${data.consultas / 2}%`, minWidth: '40px' }}>
                                                        <span className="text-xs text-white font-medium">{data.consultas}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <span className="w-3 h-3 rounded-full bg-blue-500" />
                                            Pacientes
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="w-3 h-3 rounded-full bg-emerald-500" />
                                            Consultas
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                                        <PieChart className="w-4 h-4" />
                                        Distribuição de Planos
                                    </h3>
                                    <div className="space-y-2">
                                        {planDistribution.map((plan) => (
                                            <div key={plan.name} className="flex items-center gap-3">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                                                <span className="flex-1 text-sm text-gray-600">{plan.name}</span>
                                                <span className="text-sm font-medium text-gray-900">{plan.value}%</span>
                                                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full rounded-full" 
                                                        style={{ width: `${plan.value}%`, backgroundColor: plan.color }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                </div>

                <ContentCard showHeader={{ title: 'Relatórios' }}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="text-sm border rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                <option value="all">Todos</option>
                                <option value="pacientes">Pacientes</option>
                                <option value="financeiro">Financeiro</option>
                                <option value="planos">Planos</option>
                                <option value="consultas">Consultas</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            {filteredReports.map((report) => {
                                const Icon = reportTypeIcons[report.type];
                                return (
                                    <div
                                        key={report.id}
                                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className={`p-2 rounded-lg ${reportTypeColors[report.type]}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{report.title}</p>
                                            <p className="text-xs text-gray-500">{report.period}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDownload(report)}
                                            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                            title="Baixar"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors">
                            <FileText className="w-4 h-4" />
                            Gerar Novo Relatório
                        </button>
                    </div>
                </ContentCard>
            </div>
        </div>
    );
}
