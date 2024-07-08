'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/context/usercontext';
import { logoutAction } from '@/data/actions/auth';
import { Button } from '@/components/ui/button';
import { getUserFromServer } from '@/data/actions/auth';
import Link from 'next/link';

const Header = () => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logoutAction();
    setUser(null);
    router.push('/logowanie');
  };

  useEffect(() => {
    if (['/', '/logowanie', '/rejestracja'].includes(pathname)) return;

    const fetchUser = async () => {
      const userData = await getUserFromServer();
      if (userData) {
        setUser(userData);
        if (pathname !== '/profil') {
          router.push('/profil');
        }
      }
    };

    if (!user) {
      fetchUser();
    }
  }, [pathname, user, setUser, router]);

  if (!user || ['/', '/logowanie', '/rejestracja'].includes(pathname)) return null;

  return (
    <div className="bg-gray-800 text-white p-4">
      <div className="container flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <p>{user.username}</p>
        </div>
        <div>
          <Link href='/profil'>
          <b>
            NihonEase
          </b>     
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={handleLogout} className="bg-red-500">Wyloguj</Button>
        </div>
      </div>
    </div>
  );
};

export default Header;
