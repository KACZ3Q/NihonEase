'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const LearnCategory = dynamic(() => import('@/components/learn/LearnCategory'), {
  ssr: false,
});

const LearnCategoryPage = () => (
  <Suspense fallback={<div>Ładowanie...</div>}>
    <LearnCategory />
  </Suspense>
);

export default LearnCategoryPage;
