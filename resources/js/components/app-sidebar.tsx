import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Users, UtensilsCrossed, Calendar, FileText } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, planos, agenda, relatorios, pacientes } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const page = usePage();

    const dashboardUrl = page.props.currentTeam
        ? dashboard(page.props.currentTeam.slug)
        : '/';

    const pacientesUrl = page.props.currentTeam
        ? pacientes(page.props.currentTeam.slug)
        : '/';
        
    const planosUrl = page.props.currentTeam
        ? planos(page.props.currentTeam.slug)
        : '/';

    const agendaUrl = page.props.currentTeam
        ? agenda(page.props.currentTeam.slug)
        : '/';

    const relatoriosUrl = page.props.currentTeam
        ? relatorios(page.props.currentTeam.slug)
        : '/';
    
    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboardUrl,
            icon: LayoutGrid,
        },
        {
            title: 'Pacientes',
            href: pacientesUrl,
            icon: Users,
        },
        {
            title: 'Planos Alimentares',
            href: planosUrl,
            icon: UtensilsCrossed,
        },
        {
            title: 'Agenda',
            href: agendaUrl,
            icon: Calendar,
        },
        {
            title: 'Relatórios',
            href: relatoriosUrl,
            icon: FileText,
        },
    ];

    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <TeamSwitcher />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
