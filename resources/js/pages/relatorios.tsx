import { Head, usePage } from '@inertiajs/react';
import { Reports } from '@/components/nutrition';

interface PageProps {
    stats: {
        totalPacientes: number;
        pacientesAtivos: number;
        totalConsultas: number;
        totalPlanos: number;
    };
    pacientesPorMes: Array<{
        month: string;
        pacientes: number;
        consultas: number;
    }>;
    planosDistribution: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    savedReports: Array<{
        id: number;
        title: string;
        type: string;
        period: string;
        generatedAt: string;
        size: string;
    }>;
    currentPeriod: string;
}

export default function RelatoriosPage() {
    const {
        stats,
        pacientesPorMes,
        planosDistribution,
        savedReports,
        currentPeriod,
    } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Relatórios - NutriPro" />
            <Reports
                initialStats={stats}
                initialPacientesPorMes={pacientesPorMes}
                initialPlanosDistribution={planosDistribution}
                initialSavedReports={savedReports}
                initialCurrentPeriod={currentPeriod}
            />
        </>
    );
}

RelatoriosPage.layout = (props: { currentTeam?: { slug: string } | null }) => {
    const baseUrl = props.currentTeam ? `/${props.currentTeam.slug}` : '';
    return {
        breadcrumbs: [
            {
                title: 'Relatórios',
                href: `${baseUrl}/relatorios`,
            },
        ],
    };
};
