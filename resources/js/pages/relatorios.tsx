import { Head } from '@inertiajs/react';
import { Reports } from '@/components/nutrition';

export default function RelatoriosPage() {
    return (
        <>
            <Head title="Relatórios - NutriPro" />
            <Reports />
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
