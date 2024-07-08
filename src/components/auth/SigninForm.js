'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/usercontext';
import { loginUserAction, getUser } from '@/data/actions/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const INITIAL_STATE = {
  zodErrors: null,
  message: null,
};

export default function SigninForm() {
  const [formState, setFormState] = useState(INITIAL_STATE);
  const router = useRouter();
  const { setUser } = useUser();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newState = await loginUserAction(formState, formData);
    setFormState(newState);
    if (!newState.zodErrors && !newState.message) {
      const userData = await getUser();  // Fetch user data after login
      setUser(userData);
      router.push('/profil');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <form onSubmit={handleFormSubmit}>
          <Card>
            <CardHeader className="space-y-1 items-center">
              <CardTitle className="text-3xl font-bold">Zaloguj się</CardTitle>
              <CardDescription>Wprowadź swoje dane, aby zalogować się na swoje konto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Login</Label>
                <Input id="username" name="username" type="text" placeholder="login" />
                {formState.zodErrors?.username && <p className="text-red-500">{formState.zodErrors.username}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Hasło</Label>
                <Input id="password" name="password" type="password" placeholder="hasło" />
                {formState.zodErrors?.password && <p className="text-red-500">{formState.zodErrors.password}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full" type="submit">Zaloguj</Button>
              {formState.message && <p className="text-red-500 mt-4">{formState.message}</p>}
            </CardFooter>
          </Card>
          <div className="mt-4 text-center text-sm">
            Nie masz konta?
            <Link className="underline ml-2" href="/rejestracja">
              Zarejestruj się
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
