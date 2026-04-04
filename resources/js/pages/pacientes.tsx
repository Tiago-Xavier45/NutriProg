import { Head } from '@inertiajs/react';
import { pacientes } from '@/routes/cliente';
import { pacientes as nutritionRoutes } from '@/routes/nutrition';

export default function PacientesPage() {
    return (
        <>
            <Head title="Pacientes - NutriPro" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <p className="text-gray-500">Carregando pacientes...</p>
                </div>
            </div>
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
