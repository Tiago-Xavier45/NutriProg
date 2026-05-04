import { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, Users, UtensilsCrossed, BarChart3, PieChart, Filter, Trash2, X } from 'lucide-react';
import { PageHeader, ContentCard } from '@/components/ui';
import { router, usePage } from '@inertiajs/react';

interface SavedReport {
    id: number;
    title: string;
    type: string;
    period: string;
    generatedAt: string;
    size: string;
}

interface ReportsProps {
    initialStats?: { totalPacientes: number; pacientesAtivos: number; totalConsultas: number; totalPlanos: number };
    initialPacientesPorMes?: Array<{ month: string; pacientes: number; consultas: number }>;
    initialPlanosDistribution?: Array<{ name: string; value: number; color: string }>;
    initialSavedReports?: SavedReport[];
    initialCurrentPeriod?: string;
}

const reportTypeIcons: Record<string, any> = {
    pacientes: Users, financeiro: TrendingUp, planos: UtensilsCrossed, consultas: Calendar,
};

const periodOptions = [
    { value: 'semana', label: 'Esta Semana' },
    { value: 'mes',    label: 'Este Mês' },
    { value: 'trimestre', label: 'Último Trimestre' },
    { value: 'ano',    label: 'Este Ano' },
];

const periodLabels: Record<string, string> = {
    semana: 'Esta Semana', mes: 'Este Mês', trimestre: 'Último Trimestre', ano: 'Este Ano',
};

// classes reutilizáveis
const selectClass = "rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30";
const inputClass  = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30";
const labelClass  = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground";

// Cards de stat — tokens adaptados
const statCards = [
    { key: 'pacientes',  icon: Users,           label: 'Pacientes',    accent: 'text-blue-500 dark:text-blue-400',   bg: 'bg-blue-50 dark:bg-blue-900/20'   },
    { key: 'planos',     icon: UtensilsCrossed, label: 'Planos Ativos',accent: 'text-primary',                        bg: 'bg-primary/10'                      },
    { key: 'consultas',  icon: Calendar,        label: 'Consultas',    accent: 'text-purple-500 dark:text-purple-400',bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { key: 'taxa',       icon: TrendingUp,      label: 'Taxa',         accent: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20'   },
];

const reportTypeBadge: Record<string, string> = {
    pacientes:  'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    financeiro: 'bg-primary/10 text-primary',
    planos:     'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    consultas:  'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
};

export function Reports({
    initialStats = { totalPacientes: 0, pacientesAtivos: 0, totalConsultas: 0, totalPlanos: 0 },
    initialPacientesPorMes = [],
    initialPlanosDistribution = [],
    initialSavedReports = [],
    initialCurrentPeriod = 'mes',
}: ReportsProps) {
    const [selectedPeriod, setSelectedPeriod] = useState(initialCurrentPeriod);
    const [selectedType, setSelectedType] = useState('all');
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [newReport, setNewReport] = useState({ titulo: '', tipo: 'pacientes', periodo: periodLabels[initialCurrentPeriod] || 'Este Mês' });

    const page = usePage();
    const baseUrl = page.props.currentTeam ? `/${page.props.currentTeam.slug}` : '';

    const filteredReports = selectedType === 'all'
        ? initialSavedReports
        : initialSavedReports.filter((r) => r.type === selectedType);

    const handlePeriodChange = (period: string) => {
        setSelectedPeriod(period);
        router.get(`${baseUrl}/relatorios`, { period }, { preserveState: true });
    };

    const handleSaveReport = () => {
        if (!newReport.titulo) return;
        router.post(`${baseUrl}/relatorios`, {
            titulo: newReport.titulo, tipo: newReport.tipo,
            periodo: periodLabels[selectedPeriod] || 'Este Mês',
            dados: { stats: initialStats, pacientesPorMes: initialPacientesPorMes, planosDistribution: initialPlanosDistribution },
        }, { onSuccess: () => { setShowSaveModal(false); setNewReport({ titulo: '', tipo: 'pacientes', periodo: '' }); window.location.reload(); } });
    };

    const handleDeleteReport = (id: number) => {
        if (confirm('Excluir este relatório?')) {
            router.post(`${baseUrl}/relatorios/${id}`, { _method: 'DELETE' }, { onSuccess: () => window.location.reload() });
        }
    };

    const maxPacientes = Math.max(...initialPacientesPorMes.map((d) => d.pacientes), 1);
    const maxConsultas  = Math.max(...initialPacientesPorMes.map((d) => d.consultas), 1);
    const taxa = initialStats.totalPacientes > 0
        ? Math.round((initialStats.pacientesAtivos / initialStats.totalPacientes) * 100)
        : 0;

    return (
        <div className="space-y-6">
            <PageHeader title="Relatórios" description="Análises e extrações de dados" />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Painel principal */}
                <div className="lg:col-span-2">
                    <ContentCard>
                        <div className="p-6">
                            {/* Header */}
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-base font-semibold text-foreground">Estatísticas Gerais</h2>
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <select
                                        value={selectedPeriod}
                                        onChange={(e) => handlePeriodChange(e.target.value)}
                                        className={selectClass}
                                    >
                                        {periodOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Stat cards */}
                            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                                {/* Pacientes */}
                                <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Users className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                        <span className="text-xs text-muted-foreground">Pacientes</span>
                                    </div>
                                    <p className="text-2xl font-bold text-foreground">{initialStats.totalPacientes}</p>
                                    <p className="text-xs text-primary">{initialStats.pacientesAtivos} ativos</p>
                                </div>
                                {/* Planos */}
                                <div className="rounded-xl bg-primary/10 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <UtensilsCrossed className="h-4 w-4 text-primary" />
                                        <span className="text-xs text-muted-foreground">Planos Ativos</span>
                                    </div>
                                    <p className="text-2xl font-bold text-foreground">{initialStats.totalPlanos}</p>
                                    <p className="text-xs text-muted-foreground">planos criados</p>
                                </div>
                                {/* Consultas */}
                                <div className="rounded-xl bg-purple-50 dark:bg-purple-900/20 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                                        <span className="text-xs text-muted-foreground">Consultas</span>
                                    </div>
                                    <p className="text-2xl font-bold text-foreground">{initialStats.totalConsultas}</p>
                                    <p className="text-xs text-muted-foreground">no período</p>
                                </div>
                                {/* Taxa */}
                                <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                                        <span className="text-xs text-muted-foreground">Taxa</span>
                                    </div>
                                    <p className="text-2xl font-bold text-foreground">{taxa}%</p>
                                    <p className="text-xs text-primary">de adesão</p>
                                </div>
                            </div>

                            {/* Gráficos */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Barras */}
                                <div>
                                    <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <BarChart3 className="h-4 w-4 text-muted-foreground" /> Pacientes e Consultas
                                    </h3>
                                    <div className="space-y-3">
                                        {initialPacientesPorMes.map((data) => (
                                            <div key={data.month} className="flex items-center gap-3">
                                                <span className="w-8 text-xs text-muted-foreground">{data.month}</span>
                                                <div className="flex flex-1 flex-col gap-1">
                                                    <div className="flex h-5 items-center rounded-full bg-blue-500 dark:bg-blue-600 pr-2 justify-end"
                                                        style={{ width: `${Math.max((data.pacientes / maxPacientes) * 100, 12)}%`, minWidth: '40px' }}>
                                                        <span className="text-xs font-medium text-white">{data.pacientes}</span>
                                                    </div>
                                                    <div className="flex h-5 items-center rounded-full bg-primary pr-2 justify-end"
                                                        style={{ width: `${Math.max((data.consultas / maxConsultas) * 100, 12)}%`, minWidth: '40px' }}>
                                                        <span className="text-xs font-medium text-primary-foreground">{data.consultas}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 dark:bg-blue-600" /> Pacientes
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Consultas
                                        </span>
                                    </div>
                                </div>

                                {/* Distribuição */}
                                <div>
                                    <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
                                        <PieChart className="h-4 w-4 text-muted-foreground" /> Distribuição de Planos
                                    </h3>
                                    {initialPlanosDistribution.length > 0 ? (
                                        <div className="space-y-3">
                                            {initialPlanosDistribution.map((plan) => (
                                                <div key={plan.name} className="flex items-center gap-3">
                                                    <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: plan.color }} />
                                                    <span className="flex-1 text-sm text-foreground">{plan.name}</span>
                                                    <span className="text-sm font-medium text-foreground">{plan.value}%</span>
                                                    <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                                                        <div className="h-full rounded-full transition-all" style={{ width: `${plan.value}%`, backgroundColor: plan.color }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Nenhum plano cadastrado</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ContentCard>
                </div>

                {/* Relatórios salvos */}
                <ContentCard>
                    <div className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-base font-semibold text-foreground">Relatórios Salvos</h2>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className={selectClass}
                            >
                                <option value="all">Todos</option>
                                <option value="pacientes">Pacientes</option>
                                <option value="financeiro">Financeiro</option>
                                <option value="planos">Planos</option>
                                <option value="consultas">Consultas</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            {filteredReports.length > 0 ? (
                                filteredReports.map((report) => {
                                    const Icon = reportTypeIcons[report.type] || FileText;
                                    return (
                                        <div key={report.id} className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 transition hover:bg-muted/60">
                                            <div className={`rounded-md p-2 ${reportTypeBadge[report.type] || 'bg-muted text-muted-foreground'}`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-foreground">{report.title}</p>
                                                <p className="text-xs text-muted-foreground">{report.period} · {report.generatedAt}</p>
                                            </div>
                                            <button
                                                onClick={() => alert(`Baixando: ${report.title}`)}
                                                className="rounded-md p-1.5 text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                                                title="Baixar"
                                            >
                                                <Download className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteReport(report.id)}
                                                className="rounded-md p-1.5 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                                                title="Excluir"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="py-6 text-center text-sm text-muted-foreground">Nenhum relatório salvo</p>
                            )}
                        </div>

                        <button
                            onClick={() => setShowSaveModal(true)}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border px-4 py-2.5 text-sm text-muted-foreground transition hover:border-primary hover:text-primary"
                        >
                            <FileText className="h-4 w-4" /> Salvar Relatório Atual
                        </button>
                    </div>
                </ContentCard>
            </div>

            {/* Modal salvar relatório */}
            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl border border-border bg-card text-card-foreground shadow-xl">
                        <div className="flex items-center justify-between border-b border-border px-6 py-5">
                            <div>
                                <h2 className="text-base font-semibold text-foreground">Salvar Relatório</h2>
                                <p className="mt-0.5 text-xs text-muted-foreground">Salve as estatísticas atuais para referência futura</p>
                            </div>
                            <button onClick={() => setShowSaveModal(false)} className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4 p-6">
                            <div>
                                <label className={labelClass}>Título</label>
                                <input
                                    type="text"
                                    value={newReport.titulo}
                                    onChange={(e) => setNewReport({ ...newReport, titulo: e.target.value })}
                                    placeholder="Ex: Relatório Mensal Abril"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Tipo</label>
                                <select
                                    value={newReport.tipo}
                                    onChange={(e) => setNewReport({ ...newReport, tipo: e.target.value })}
                                    className={`${inputClass}`}
                                >
                                    <option value="pacientes">Pacientes</option>
                                    <option value="financeiro">Financeiro</option>
                                    <option value="planos">Planos</option>
                                    <option value="consultas">Consultas</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Período</label>
                                <input
                                    type="text"
                                    value={periodLabels[selectedPeriod] || 'Este Mês'}
                                    disabled
                                    className={`${inputClass} opacity-60 cursor-not-allowed`}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 border-t border-border px-6 py-5">
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="flex-1 rounded-md border border-border bg-transparent px-4 py-2 text-sm text-foreground transition hover:bg-muted"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveReport}
                                disabled={!newReport.titulo}
                                className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
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