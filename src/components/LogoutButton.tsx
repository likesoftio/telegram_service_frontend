'use client';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  return (
    <Button
      variant="outline"
      onClick={() => {
        logout();
        router.replace('/login');
      }}
    >
      Выйти
    </Button>
  );
} 