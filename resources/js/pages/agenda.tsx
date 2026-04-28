import { Head, usePage } from '@inertiajs/react';
import { Agenda } from '@/components/nutrition';

interface PageProps {
    consultas: Array<{
        id: string;
        patientId: string;
        patientName: string;
        phone: string;
        time: string;
        duration: number;
        type: 'consulta' | 'retorno' | 'avaliacao';
        status: 'confirmado' | 'pendente' | 'cancelado';
        notes: string;
    }>;
    currentMonth: number;
    currentYear: number;
    pacientes: Array<{ id: string; name: string }>;
}

export default function AgendaPage() {
    const { consultas, currentMonth, currentYear, pacientes } =
        usePage<PageProps>().props;

    return (
        <>
            <Head title="Agenda - NutriPro" />
            <Agenda
                initialAppointments={consultas}
                initialMonth={currentMonth}
                initialYear={currentYear}
                pacientes={pacientes}
            />
        </>
    );
}

AgendaPage.layout = (props: { currentTeam?: { slug: string } | null }) => {
    const baseUrl = props.currentTeam ? `/${props.currentTeam.slug}` : '';
    return {
        breadcrumbs: [
            {
                title: 'Agenda',
                href: `${baseUrl}/agenda`,
            },
        ],
    };
};
