import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(request) {
  const token = cookies().get('jwt')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/logowanie', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profil', '/nauka/:path*'],
};
