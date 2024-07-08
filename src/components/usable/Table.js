'use client';

import React, { useEffect, useState } from 'react';
import { getAllLearnItems } from '@/data/services/learn';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TranslationTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllLearnItems();
      if (result.words) {
        setData(result.words);
        const uniqueCategories = [...new Set(result.words.map(word => word.category.categoryPolishName))];
        setCategories(uniqueCategories);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const filteredData = selectedCategory === 'all'
    ? data
    : data.filter(word => word.category.categoryPolishName === selectedCategory);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Słownik</h2>
        <Select onValueChange={handleCategoryChange} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Wybierz kategorię" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie</SelectItem>
            {categories.map((category, index) => (
              <SelectItem key={index} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table className="min-w-full bg-white">
        <TableHeader>
          <TableRow>
            <TableCell className="px-4 py-2 text-lg"> <b>Japoński</b></TableCell>
            <TableCell className="px-4 py-2 text-lg"><b>Romaji</b></TableCell>
            <TableCell className="px-4 py-2 text-lg"><b>Polski</b></TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((word) => (
            <TableRow key={word.wordID}>
              <TableCell className="border px-4 py-2">
                {Array.isArray(word.japaneseWord) ? word.japaneseWord.join(', ') : word.japaneseWord}
              </TableCell>
              <TableCell className="border px-4 py-2">
                {Array.isArray(word.romaji) ? word.romaji.join(', ') : word.romaji}
              </TableCell>
              <TableCell className="border px-4 py-2">
                {word.polishWord}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TranslationTable;
