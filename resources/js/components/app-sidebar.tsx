import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { ComputerIcon, Notebook, Users } from "lucide-react"; 
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Activity, BookOpen, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';
import { Bell } from "lucide-react";
import { useState, useEffect } from 'react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Usuarios',
        href: '/usuarios',
        icon: Users,
    },
    {
        title: 'Activos',
        href: '/activos',
        icon: ComputerIcon,
    },
    {
        title: 'Incidentes',
        href: '/incidentes',
        icon: Activity,
    },
    {
        title: 'Auditorías',
        href: '/auditorias',
        icon: BookOpen,
    },
    {
        title: 'Alertas',  // Nueva columna de Alertas
        href: '/alertas',
        icon: Bell,  // Icono de la campanita
    }
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const user = auth.user;
    const [hasAlerts, setHasAlerts] = useState(false);

    useEffect(() => {
        const fetchAlerts = async () => {
            const alertas = await fetch('/api/alertas');
            const data = await alertas.json();
            setHasAlerts(data.alertas.length > 0);
        };

        fetchAlerts();
    }, []);

    // Nav principal dinámico
    const mainNavItems: NavItem[] =
        user.rol === 'administrador'
            ? [
                { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
            ]
            : [
                { title: 'Dashboard Usuario', href: '/usuario/dashboard', icon: LayoutGrid },
            ];

    // Nav footer condicional
    const footerNavItems: NavItem[] =
        user.rol === 'administrador'
            ? [
                { title: 'Usuarios', href: '/usuarios', icon: Users },
                { title: 'Activos', href: '/activos', icon: ComputerIcon },
                { title: 'Incidentes', href: '/incidentes', icon: Activity },
                { title: 'Auditorías', href: '/auditorias', icon: BookOpen },
                { title: 'Alertas', href: '/alertas', icon: Bell },
            ]
            : [];

    // Cambiar link del logo según rol
    const logoHref = user.rol === 'administrador' ? '/dashboard' : '/usuario/dashboard';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={logoHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
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
