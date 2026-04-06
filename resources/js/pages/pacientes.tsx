import { Head, usePage } from '@inertiajs/react';
import { Patients } from '@/components/nutrition';
import { pacientes } from '@/routes';

interface PageProps {
    clientes: Array<{
        id: number;
        name: string;
        email: string;
        phone: string;
        age: number | null;
        weight: string | null;
        height: string | null;
        plan: string | null;
        status: 'Ativo' | 'Pendente' | 'Inativo';
        last_visit: string | null;
    }>;
    filters?: {
        search: string;
        status: string;
    };
}

export default function PacientesPage() {
    const { clientes, filters } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Pacientes - NutriPro" />
            <Patients 
                initialPatients={clientes.map(c => ({
                    id: c.id,
                    name: c.name,
                    email: c.email || '',
                    phone: c.phone || '',
                    age: c.age || 0,
                    weight: c.weight || '',
                    height: c.height || '',
                    plan: c.plan || '',
                    status: c.status || 'Ativo',
                    lastVisit: c.last_visit 
                        ? new Date(c.last_visit).toLocaleDateString('pt-BR')
                        : 'Nunca',
                }))}
                initialFilters={filters}
            />
        </>
    );
}

PacientesPage.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Pacientes',
            href: props.currentTeam ? pacientes(props.currentTeam.slug) : '/',
        },
    ],
});
