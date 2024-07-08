'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Categories = dynamic(() => import('@/components/learn/Categories'), {
  ssr: false,
});

const CategoriesPage = () => (
  <Suspense fallback={<div>Ładowanie...</div>}>
    <Categories />
  </Suspense>
);

export default CategoriesPage;
