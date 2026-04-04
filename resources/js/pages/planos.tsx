import { Head } from '@inertiajs/react';
import { MealPlans } from '@/components/nutrition';

export default function PlanosPage() {
    return (
        <>
            <Head title="Planos Alimentares - NutriPro" />
            <MealPlans />
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
