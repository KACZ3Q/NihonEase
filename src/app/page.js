import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">NihonEase</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Link href="/logowanie">
              <Button className="w-full text-white">Logowanie</Button>
            </Link>
            <Link href="/rejestracja">
              <Button className="w-full text-white">Rejestracja</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
