'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconPlus, IconUser, IconSettings, IconChannel, IconTelegram } from "@/components/ui/usedesk-icons";
import clsx from "clsx";

const nav = [
  { href: '/dashboard', label: 'Дашборд', icon: <IconPlus size={20} /> },
  { href: '/projects', label: 'Проекты', icon: <IconChannel size={20} /> },
  { href: '/moderation', label: 'Модерация', icon: <IconTelegram size={20} /> },
  { href: '/settings/integrations', label: 'Интеграции', icon: <IconSettings size={20} /> },
  { href: '/settings/profile', label: 'Профиль', icon: <IconUser size={20} /> },
  { href: '/settings', label: 'Настройки', icon: <IconSettings size={20} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 min-h-screen bg-muted border-r flex flex-col p-4">
      <div className="text-xl font-bold mb-8">Telegram AI Monitoring</div>
      <nav className="flex flex-col gap-2">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2 rounded hover:bg-accent transition',
              pathname === item.href && 'bg-accent text-primary font-semibold'
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
} 