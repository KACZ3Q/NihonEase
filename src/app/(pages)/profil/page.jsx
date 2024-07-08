'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/data/actions/auth';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUser();
      if (!userData) {
        setError('No user data found');
        router.push('/');
      } else {
        setUser(userData);
      }
    };

    fetchUserData();
  }, [router]);

  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md mb-4 p-4 text-center">
        <h2 className="text-xl font-bold">Nauka losowa</h2>
        <Link href="/nauka/losowa?direction=plToJp">
          <div className="inline-block w-full text-center py-2 bg-blue-500 text-white rounded cursor-pointer mt-2">Polski - Japoński</div>
        </Link>
        <Link href="/nauka/losowa?direction=jpToPl">
          <div className="inline-block w-full text-center py-2 bg-blue-500 text-white rounded cursor-pointer mt-2">Japoński - Polski</div>
        </Link>
      </Card>
      <Card className="w-full max-w-md mb-4 p-4 text-center">
        <h2 className="text-xl font-bold">Nauka z wybranej kategorii</h2>
        <Link href="/nauka/kategorie?direction=plToJp">
          <div className="inline-block w-full text-center py-2 bg-blue-500 text-white rounded cursor-pointer mt-2">Polski - Japoński</div>
        </Link>
        <Link href="/nauka/kategorie?direction=jpToPl">
          <div className="inline-block w-full text-center py-2 bg-blue-500 text-white rounded cursor-pointer mt-2">Japoński - Polski</div>
        </Link>
      </Card>
      <Card className="w-full max-w-md mb-4 p-4 text-center">
        <h2 className="text-xl font-bold">Słownik</h2>
        <Link href="/nauka/slownik">
          <div className="inline-block w-full text-center py-2 bg-green-500 text-white rounded cursor-pointer mt-2">Przejdź do słownika</div>
        </Link>
      </Card>
    </div>
  );
};

export default Profile;
