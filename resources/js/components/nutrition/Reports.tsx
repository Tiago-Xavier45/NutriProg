import { useState } from 'react';
import {
    FileText,
    Download,
    Calendar,
    TrendingUp,
    Users,
    UtensilsCrossed,
    BarChart3,
    PieChart,
    Filter,
} from 'lucide-react';
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
    initialPacientesPorMes?: Array<{
        month: string;
        pacientes: number;
        consultas: number;
    }>;
    initialPlanosDistribution?: Array<{
        name: string;
        value: number;
        color: string;
    }>;
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
    initialStats = {
        totalPacientes: 0,
        pacientesAtivos: 0,
        totalConsultas: 0,
        totalPlanos: 0,
    },
    initialPacientesPorMes = [],
    initialPlanosDistribution = [],
    initialSavedReports = [],
    initialCurrentPeriod = 'mes',
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
    const baseUrl = page.props.currentTeam
        ? `/${page.props.currentTeam.slug}`
        : '';

    const filteredReports =
        selectedType === 'all'
            ? initialSavedReports
            : initialSavedReports.filter((r) => r.type === selectedType);

    const handlePeriodChange = (period: string) => {
        setSelectedPeriod(period);
        router.get(
            `${baseUrl}/relatorios`,
            { period },
            { preserveState: true },
        );
    };

    const handleSaveReport = () => {
        if (!newReport.titulo) return;

        router.post(
            `${baseUrl}/relatorios`,
            {
                titulo: newReport.titulo,
                tipo: newReport.tipo,
                periodo: periodLabels[selectedPeriod] || 'Este Mês',
                dados: {
                    stats: initialStats,
                    pacientesPorMes: initialPacientesPorMes,
                    planosDistribution: initialPlanosDistribution,
                },
            },
            {
                onSuccess: () => {
                    setShowSaveModal(false);
                    setNewReport({
                        titulo: '',
                        tipo: 'pacientes',
                        periodo: periodLabels[selectedPeriod] || 'Este Mês',
                    });
                    window.location.reload();
                },
            },
        );
    };

    const handleDeleteReport = (id: number) => {
        if (confirm('Excluir este relatório?')) {
            router.post(
                `${baseUrl}/relatorios/${id}`,
                {
                    _method: 'DELETE',
                },
                {
                    onSuccess: () => window.location.reload(),
                },
            );
        }
    };

    const handleDownload = (report: SavedReport) => {
        alert(`Baixando relatório: ${report.title}`);
    };

    const maxPacientes = Math.max(
        ...initialPacientesPorMes.map((d) => d.pacientes),
        1,
    );
    const maxConsultas = Math.max(
        ...initialPacientesPorMes.map((d) => d.consultas),
        1,
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Relatórios"
                description="Análises e extrações de dados"
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <ContentCard>
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Estatísticas Gerais
                                </h2>
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-gray-400" />
                                    <select
                                        value={selectedPeriod}
                                        onChange={(e) =>
                                            handlePeriodChange(e.target.value)
                                        }
                                        className="rounded-lg border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        {periodOptions.map((opt) => (
                                            <option
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                                <div className="rounded-xl bg-blue-50 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Users className="h-5 w-5 text-blue-600" />
                                        <span className="text-sm text-gray-600">
                                            Pacientes
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {initialStats.totalPacientes}
                                    </p>
                                    <p className="text-xs text-emerald-600">
                                        {initialStats.pacientesAtivos} ativos
                                    </p>
                                </div>
                                <div className="rounded-xl bg-emerald-50 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <UtensilsCrossed className="h-5 w-5 text-emerald-600" />
                                        <span className="text-sm text-gray-600">
                                            Planos Ativos
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {initialStats.totalPlanos}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        planos creados
                                    </p>
                                </div>
                                <div className="rounded-xl bg-purple-50 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-purple-600" />
                                        <span className="text-sm text-gray-600">
                                            Consultas
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {initialStats.totalConsultas}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        no período
                                    </p>
                                </div>
                                <div className="rounded-xl bg-orange-50 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-orange-600" />
                                        <span className="text-sm text-gray-600">
                                            Taxa
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {initialStats.totalPacientes > 0
                                            ? Math.round(
                                                  (initialStats.pacientesAtivos /
                                                      initialStats.totalPacientes) *
                                                      100,
                                              )
                                            : 0}
                                        %
                                    </p>
                                    <p className="text-xs text-emerald-600">
                                        de adesão
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <BarChart3 className="h-4 w-4" />
                                        Pacientes e Consultas
                                    </h3>
                                    <div className="space-y-3">
                                        {initialPacientesPorMes.map((data) => (
                                            <div
                                                key={data.month}
                                                className="flex items-center gap-4"
                                            >
                                                <span className="w-8 text-sm text-gray-500">
                                                    {data.month}
                                                </span>
                                                <div className="flex flex-1 gap-2">
                                                    <div
                                                        className="flex h-6 flex-1 items-center justify-end rounded-full bg-blue-500 pr-2"
                                                        style={{
                                                            width: `${(data.pacientes / maxPacientes) * 100}%`,
                                                            minWidth: '40px',
                                                        }}
                                                    >
                                                        <span className="text-xs font-medium text-white">
                                                            {data.pacientes}
                                                        </span>
                                                    </div>
                                                    <div
                                                        className="flex h-6 flex-1 items-center justify-end rounded-full bg-emerald-500 pr-2"
                                                        style={{
                                                            width: `${(data.consultas / maxConsultas) * 100}%`,
                                                            minWidth: '40px',
                                                        }}
                                                    >
                                                        <span className="text-xs font-medium text-white">
                                                            {data.consultas}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <span className="h-3 w-3 rounded-full bg-blue-500" />
                                            Pacientes
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="h-3 w-3 rounded-full bg-emerald-500" />
                                            Consultas
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <PieChart className="h-4 w-4" />
                                        Distribuição de Planos
                                    </h3>
                                    {initialPlanosDistribution.length > 0 ? (
                                        <div className="space-y-2">
                                            {initialPlanosDistribution.map(
                                                (plan) => (
                                                    <div
                                                        key={plan.name}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <div
                                                            className="h-3 w-3 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    plan.color,
                                                            }}
                                                        />
                                                        <span className="flex-1 text-sm text-gray-600">
                                                            {plan.name}
                                                        </span>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {plan.value}%
                                                        </span>
                                                        <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-100">
                                                            <div
                                                                className="h-full rounded-full"
                                                                style={{
                                                                    width: `${plan.value}%`,
                                                                    backgroundColor:
                                                                        plan.color,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            Nenhum plano cadastrado
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </ContentCard>
                </div>

                <ContentCard>
                    <div className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Relatórios Salvos
                            </h2>
                            <select
                                value={selectedType}
                                onChange={(e) =>
                                    setSelectedType(e.target.value)
                                }
                                className="rounded-lg border px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
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
                                    const Icon =
                                        reportTypeIcons[report.type] ||
                                        FileText;
                                    return (
                                        <div
                                            key={report.id}
                                            className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                                        >
                                            <div
                                                className={`rounded-lg p-2 ${reportTypeColors[report.type] || 'bg-gray-100 text-gray-600'}`}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-gray-900">
                                                    {report.title}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {report.period} •{' '}
                                                    {report.generatedAt}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleDownload(report)
                                                }
                                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                                                title="Baixar"
                                            >
                                                <Download className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteReport(
                                                        report.id,
                                                    )
                                                }
                                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                                title="Excluir"
                                            >
                                                <FileText className="h-4 w-4" />
                                            </button>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="py-4 text-center text-sm text-gray-500">
                                    Nenhum relatório salvo
                                </p>
                            )}
                        </div>

                        <button
                            onClick={() => setShowSaveModal(true)}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-2 text-gray-500 transition-colors hover:border-emerald-500 hover:text-emerald-600"
                        >
                            <FileText className="h-4 w-4" />
                            Salvar Relatório Atual
                        </button>
                    </div>
                </ContentCard>
            </div>

            {showSaveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white">
                        <div className="border-b p-6">
                            <h2 className="text-xl font-semibold">
                                Salvar Relatório
                            </h2>
                            <p className="text-sm text-gray-500">
                                Salve as estatísticas atuais para referência
                                futura
                            </p>
                        </div>
                        <div className="space-y-4 p-6">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Título
                                </label>
                                <input
                                    type="text"
                                    value={newReport.titulo}
                                    onChange={(e) =>
                                        setNewReport({
                                            ...newReport,
                                            titulo: e.target.value,
                                        })
                                    }
                                    placeholder="Ex: Relatório Mensal Abril"
                                    className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Tipo
                                </label>
                                <select
                                    value={newReport.tipo}
                                    onChange={(e) =>
                                        setNewReport({
                                            ...newReport,
                                            tipo: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="pacientes">Pacientes</option>
                                    <option value="financeiro">
                                        Financeiro
                                    </option>
                                    <option value="planos">Planos</option>
                                    <option value="consultas">Consultas</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Período
                                </label>
                                <input
                                    type="text"
                                    value={
                                        periodLabels[selectedPeriod] ||
                                        'Este Mês'
                                    }
                                    disabled
                                    className="w-full rounded-lg border bg-gray-50 px-4 py-2 text-gray-500"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 border-t p-6">
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="flex-1 rounded-lg border px-4 py-2 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveReport}
                                disabled={!newReport.titulo}
                                className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
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
