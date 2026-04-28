import { Head, usePage } from '@inertiajs/react';
import { MealPlans } from '@/components/nutrition';

interface PageProps {
    planos: Array<{
        id: string;
        patientId: string;
        patientName: string;
        planName: string;
        calories: number;
        objective: string;
        restrictions: string[];
        status: 'ativo' | 'inativo';
        notes: string;
        createdAt: string;
        updatedAt: string;
        meals: Array<{
            id: string;
            name: string;
            time: string;
            foods: Array<{
                id: string;
                name: string;
                portion: string;
                calories: number;
            }>;
        }>;
    }>;
    pacientes: Array<{ id: string; name: string }>;
}

export default function PlanosPage() {
    const { planos, pacientes } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Planos Alimentares - NutriPro" />
            <MealPlans initialPlans={planos} pacientes={pacientes} />
        </>
    );
}

PlanosPage.layout = (props: { currentTeam?: { slug: string } | null }) => {
    const baseUrl = props.currentTeam ? `/${props.currentTeam.slug}` : '';
    return {
        breadcrumbs: [
            {
                title: 'Planos Alimentares',
                href: `${baseUrl}/planos`,
            },
        ],
    };
};
