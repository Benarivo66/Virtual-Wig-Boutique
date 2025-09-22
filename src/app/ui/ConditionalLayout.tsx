'use client';

import { usePathname } from 'next/navigation';
import Sidenav from './Sidenav/Sidenav';

interface ConditionalLayoutProps {
    children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const pathname = usePathname();

    // Check if current route is a dashboard route
    const isDashboardRoute = pathname.startsWith('/dashboard');

    if (isDashboardRoute) {
        // Dashboard layout with sidebar
        return (
            <div className="flex min-h-screen">
                <Sidenav />
                <main className="flex-1 p-6">{children}</main>
            </div>
        );
    }

    // Public routes layout without sidebar (full-width)
    return (
        <main className="min-h-screen">
            {children}
        </main>
    );
}