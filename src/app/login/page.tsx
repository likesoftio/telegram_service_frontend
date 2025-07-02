'use client';

declare global {
  interface Window {
    onTelegramAuth: (user: any) => void;
  }
}

import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Встраиваем Telegram Login Widget
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', process.env.NEXT_PUBLIC_TELEGRAM_BOT ?? '');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'true');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    document.getElementById('telegram-login-btn')?.appendChild(script);
  }, []);

  useEffect(() => {
    window.onTelegramAuth = async function(user: any) {
      try {
        const res = await fetch('/api/auth/telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error('Ошибка авторизации');
        const data = await res.json();
        login(data.access_token, data.user);
        router.replace('/dashboard');
      } catch (e) {
        alert('Ошибка авторизации через Telegram');
      }
    };
  }, [login, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Вход через Telegram</h1>
      <div id="telegram-login-btn" />
    </div>
  );
}

// Для TypeScript: объявляем глобальную функцию
// @ts-ignore
if (typeof window !== 'undefined') {
  window.onTelegramAuth = window.onTelegramAuth || (() => {});
} 