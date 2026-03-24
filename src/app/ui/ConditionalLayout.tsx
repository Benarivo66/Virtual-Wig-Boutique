'use client';

import { usePathname } from 'next/navigation';
import Sidenav from './Sidenav/Sidenav';
import UserSidenav from './UserSidenav/UserSidenav';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // 1. Identify public pages that need a clean, full-width layout
    const isPublicPage = pathname === '/login' || pathname === '/register' || pathname === '/';

    // 2. If it's a public page, return just the children (no sidebars, no flex wrappers)
    if (isPublicPage) {
        return <>{children}</>;
    }

    // 3. Handle Admin routes
    if (pathname.startsWith('/admin')) {
        return (
            <div className="flex min-h-screen">
                <Sidenav />
                <main className="flex-1 p-6">{children}</main>
            </div>
        );
    }

    // 4. Default for everything else (User Dashboard, etc.)
    return (
        <div className="flex min-h-screen">
            <UserSidenav />
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
  
}