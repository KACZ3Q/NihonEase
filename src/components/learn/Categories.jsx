'use client';

import { useEffect, useState } from 'react';
import { getAllLearnItems } from '@/data/services/learn';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const direction = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('direction') || 'plToJp' : 'plToJp';

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllLearnItems();
      setCategories(data.words);
    };

    fetchCategories();
  }, []);

  const uniqueCategories = [...new Map(categories.map(item => [item.category.categoryId, item.category])).values()];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {uniqueCategories.map((category) => (
          <Card key={category.categoryId} className="mb-4 p-4">
            <h2 className="text-xl font-bold">{category.categoryPolishName}</h2>
            <Link href={`/nauka/kategorie/${category.categoryId}?direction=${direction}`}>
              <div className="mt-2 inline-block text-blue-500 underline cursor-pointer">Rozpocznij naukę</div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Categories;
