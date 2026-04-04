import { Head } from '@inertiajs/react';
import { Agenda } from '@/components/nutrition';

export default function AgendaPage() {
    return (
        <>
            <Head title="Agenda - NutriPro" />
            <Agenda />
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
