'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/data/actions/auth';
import React from 'react';
import SigninForm from '@/components/auth/SigninForm';

const LoginPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      const user = await getUser();
      if (user) {
        setIsLoggedIn(true);
        router.push('/profil');
      }
    };

    checkUserStatus();
  }, [router]);

  return (
    <>
      {!isLoggedIn && <SigninForm />}
    </>
  );
};

export default LoginPage;
