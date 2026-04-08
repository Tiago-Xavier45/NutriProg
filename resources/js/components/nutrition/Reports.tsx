import { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, Users, UtensilsCrossed, BarChart3, PieChart, Filter } from 'lucide-react';
import { PageHeader, ContentCard } from '@/components/ui';
import { router } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

interface SavedReport {
    id: number;
    title: string;
    type: string;
    period: string;
    generatedAt: string;
    size: string;
}

interface ReportsProps {
    initialStats?: {
        totalPacientes: number;
        pacientesAtivos: number;
        totalConsultas: number;
        totalPlanos: number;
    };
    initialPacientesPorMes?: Array<{ month: string; pacientes: number; consultas: number }>;
    initialPlanosDistribution?: Array<{ name: string; value: number; color: string }>;
    initialSavedReports?: SavedReport[];
    initialCurrentPeriod?: string;
}

const reportTypeIcons: Record<string, any> = {
    pacientes: Users,
    financeiro: TrendingUp,
    planos: UtensilsCrossed,
    consultas: Calendar,
};

const reportTypeColors: Record<string, string> = {
    pacientes: 'bg-blue-100 text-blue-600',
    financeiro: 'bg-emerald-100 text-emerald-600',
    planos: 'bg-purple-100 text-purple-600',
    consultas: 'bg-orange-100 text-orange-600',
};

const periodOptions = [
    { value: 'semana', label: 'Esta Semana' },
    { value: 'mes', label: 'Este Mês' },
    { value: 'trimestre', label: 'Último Trimestre' },
    { value: 'ano', label: 'Este Ano' },
];

const periodLabels: Record<string, string> = {
    semana: 'Esta Semana',
    mes: 'Este Mês',
    trimestre: 'Último Trimestre',
    ano: 'Este Ano',
};

export function Reports({ 
    initialStats = { totalPacientes: 0, pacientesAtivos: 0, totalConsultas: 0, totalPlanos: 0 },
    initialPacientesPorMes = [],
    initialPlanosDistribution = [],
    initialSavedReports = [],
    initialCurrentPeriod = 'mes'
}: ReportsProps) {
    const [selectedPeriod, setSelectedPeriod] = useState(initialCurrentPeriod);
    const [selectedType, setSelectedType] = useState<string>('all');
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [newReport, setNewReport] = useState({
        titulo: '',
        tipo: 'pacientes',
        periodo: periodLabels[initialCurrentPeriod] || 'Este Mês',
    });

    const page = usePage();
    const baseUrl = page.props.currentTeam ? `/${page.props.currentTeam.slug}` : '';

    const filteredReports = selectedType === 'all' 
        ? initialSavedReports 
        : initialSavedReports.filter(r => r.type === selectedType);

    const handlePeriodChange = (period: string) => {
        setSelectedPeriod(period);
        router.get(`${baseUrl}/relatorios`, { period }, { preserveState: true });
    };

    const handleSaveReport = () => {
        if (!newReport.titulo) return;
        
        router.post(`${baseUrl}/relatorios`, {
            titulo: newReport.titulo,
            tipo: newReport.tipo,
            periodo: periodLabels[selectedPeriod] || 'Este Mês',
            dados: {
                stats: initialStats,
                pacientesPorMes: initialPacientesPorMes,
                planosDistribution: initialPlanosDistribution,
            },
        }, {
            onSuccess: () => {
                setShowSaveModal(false);
                setNewReport({ titulo: '', tipo: 'pacientes', periodo: periodLabels[selectedPeriod] || 'Este Mês' });
                window.location.reload();
            },
        });
    };

    const handleDeleteReport = (id: number) => {
        if (confirm('Excluir este relatório?')) {
            router.post(`${baseUrl}/relatorios/${id}`, {
                _method: 'DELETE',
            }, {
                onSuccess: () => window.location.reload(),
            });
        }
    };

    const handleDownload = (report: SavedReport) => {
        alert(`Baixando relatório: ${report.title}`);
    };

    const maxPacientes = Math.max(...initialPacientesPorMes.map(d => d.pacientes), 1);
    const maxConsultas = Math.max(...initialPacientesPorMes.map(d => d.consultas), 1);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Relatórios"
                description="Análises e extrações de dados"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ContentCard>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Estatísticas Gerais</h2>
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                    <select
                                        value={selectedPeriod}
                                        onChange={(e) => handlePeriodChange(e.target.value)}
                                        className="text-sm border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        {periodOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm text-gray-600">Pacientes</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{initialStats.totalPacientes}</p>
                                    <p className="text-xs text-emerald-600">{initialStats.pacientesAtivos} ativos</p>
                                </div>
                                <div className="bg-emerald-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
                                        <span className="text-sm text-gray-600">Planos Ativos</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{initialStats.totalPlanos}</p>
                                    <p className="text-xs text-gray-500">planos creados</p>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-5 h-5 text-purple-600" />
                                        <span className="text-sm text-gray-600">Consultas</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{initialStats.totalConsultas}</p>
                                    <p className="text-xs text-gray-500">no período</p>
                                </div>
                                <div className="bg-orange-50 rounded-xl p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-5 h-5 text-orange-600" />
                                        <span className="text-sm text-gray-600">Taxa</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {initialStats.totalPacientes > 0 
                                            ? Math.round((initialStats.pacientesAtivos / initialStats.totalPacientes) * 100)
                                            : 0}%
                                    </p>
                                    <p className="text-xs text-emerald-600">de adesão</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4" />
                                        Pacientes e Consultas
                                    </h3>
                                    <div className="space-y-3">
                                        {initialPacientesPorMes.map((data) => (
                                            <div key={data.month} className="flex items-center gap-4">
                                                <span className="w-8 text-sm text-gray-500">{data.month}</span>
                                                <div className="flex-1 flex gap-2">
                                                    <div className="flex-1 bg-blue-500 rounded-full h-6 flex items-center justify-end pr-2" style={{ width: `${(data.pacientes / maxPacientes) * 100}%`, minWidth: '40px' }}>
                                                        <span className="text-xs text-white font-medium">{data.pacientes}</span>
                                                    </div>
                                                    <div className="flex-1 bg-emerald-500 rounded-full h-6 flex items-center justify-end pr-2" style={{ width: `${(data.consultas / maxConsultas) * 100}%`, minWidth: '40px' }}>
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
                                    {initialPlanosDistribution.length > 0 ? (
                                        <div className="space-y-2">
                                            {initialPlanosDistribution.map((plan) => (
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
                                    ) : (
                                        <p className="text-sm text-gray-500">Nenhum plano cadastrado</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ContentCard>
                </div>

                <ContentCard>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Relatórios Salvos</h2>
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
                            {filteredReports.length > 0 ? (
                                filteredReports.map((report) => {
                                    const Icon = reportTypeIcons[report.type] || FileText;
                                    return (
                                        <div
                                            key={report.id}
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className={`p-2 rounded-lg ${reportTypeColors[report.type] || 'bg-gray-100 text-gray-600'}`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{report.title}</p>
                                                <p className="text-xs text-gray-500">{report.period} • {report.generatedAt}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDownload(report)}
                                                className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                title="Baixar"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteReport(report.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Excluir"
                                            >
                                                <FileText className="w-4 h-4" />
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">Nenhum relatório salvo</p>
                            )}
                        </div>

                        <button 
                            onClick={() => setShowSaveModal(true)}
                            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                        >
                            <FileText className="w-4 h-4" />
                            Salvar Relatório Atual
                        </button>
                    </div>
                </ContentCard>
            </div>

            {showSaveModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="p-6 border-b">
                            <h2 className="text-xl font-semibold">Salvar Relatório</h2>
                            <p className="text-sm text-gray-500">Salve as estatísticas atuais para referência futura</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                <input
                                    type="text"
                                    value={newReport.titulo}
                                    onChange={(e) => setNewReport({...newReport, titulo: e.target.value})}
                                    placeholder="Ex: Relatório Mensal Abril"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                <select
                                    value={newReport.tipo}
                                    onChange={(e) => setNewReport({...newReport, tipo: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    <option value="pacientes">Pacientes</option>
                                    <option value="financeiro">Financeiro</option>
                                    <option value="planos">Planos</option>
                                    <option value="consultas">Consultas</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
                                <input
                                    type="text"
                                    value={periodLabels[selectedPeriod] || 'Este Mês'}
                                    disabled
                                    className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 p-6 border-t">
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveReport}
                                disabled={!newReport.titulo}
                                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
