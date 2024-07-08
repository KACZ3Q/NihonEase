'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const LearnRandom = dynamic(() => import('@/components/learn/LearnRandom'), {
  ssr: false,
});

const LearnRandomPage = () => (
  <Suspense fallback={<div>Ładowanie...</div>}>
    <LearnRandom />
  </Suspense>
);

export default LearnRandomPage;
