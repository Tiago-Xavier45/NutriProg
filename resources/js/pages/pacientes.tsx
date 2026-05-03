import { Head, usePage } from '@inertiajs/react';
import { Patients } from '@/components/nutrition';

interface PageProps {
    clientes: Array<{
        id: number;
        name: string;
        email: string;
        phone: string;
        age: number;
        weight: string;
        height: string;
        plan: string;
        status: 'Ativo' | 'Pendente' | 'Inativo';
        last_visit: string;
    }>;
    filters: {
        search: string;
        status: string;
    };
    [key: string]: any;
}

export default function PacientesPage() {
    const { clientes, filters } = usePage<PageProps>().props;

    const patients = clientes.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone || '',
        age: c.age || 0,
        weight: c.weight || '',
        height: c.height || '',
        plan: c.plan || '',
        status: c.status || 'Ativo',
        lastVisit: c.last_visit
            ? new Date(c.last_visit).toLocaleDateString('pt-BR')
            : '-',
    }));

    return (
        <>
            <Head title="Pacientes - NutriPro" />
            <Patients initialPatients={patients} initialFilters={filters} />
        </>
    );
}

PacientesPage.layout = (props: { currentTeam?: { slug: string } | null }) => {
    const baseUrl = props.currentTeam ? `/${props.currentTeam.slug}` : '';
    return {
        breadcrumbs: [
            {
                title: 'Pacientes',
                href: `${baseUrl}/pacientes`,
            },
        ],
    };
};
