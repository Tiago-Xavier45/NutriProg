import { Head } from '@inertiajs/react';
import { Dashboard } from '@/components/nutrition';
import { dashboard } from '@/routes';

export default function DashboardPage() {
    return (
        <>
            <Head title="Dashboard - NutriPro" />
            <Dashboard />
        </>
    );
}

DashboardPage.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: props.currentTeam ? dashboard(props.currentTeam.slug) : '/',
        },
    ],
});
