import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('jwt')?.value;

  if (token) {
    return NextResponse.redirect(new URL('/profil', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/'], 
};
