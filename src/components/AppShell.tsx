'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AuthProvider } from './AuthProvider';
import Sidebar from './ui/Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showSidebar = !pathname.startsWith('/login');
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex">
          {showSidebar && <Sidebar />}
          <main className="flex-1">{children}</main>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
} 