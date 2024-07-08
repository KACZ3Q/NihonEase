'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getLearnItemsByCategory } from '@/data/services/learn';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/usercontext';
import Link from 'next/link';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';

const LearnCategory = () => {
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, setUser } = useUser();
  const router = useRouter();
  const { id: categoryId } = useParams();

  const direction = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('direction') || 'plToJp' : 'plToJp';

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getLearnItemsByCategory(categoryId);
      if (data.words && data.words.length > 0) {
        setItems(data.words);
        setCurrentItem(data.words[0]);
      } else {
        setItems([]);
        setCurrentItem(null);
      }
    };

    fetchItems();
  }, [categoryId]);

  const handleNext = async (e) => {
    e.preventDefault();
    if (!currentItem || isSubmitting) return;
    setIsSubmitting(true);
    if (!userAnswer.trim()) {
      setFeedback('Proszę wpisać odpowiedź');
      setIsSubmitting(false);
      return;
    }
    const isCorrect = checkAnswer(userAnswer, currentItem);
    setFeedback(isCorrect ? 'Poprawnie!' : 'Niepoprawnie');

    setAnswers([...answers, { id: currentItem.wordID, question: getQuestion(currentItem), answer: userAnswer, correctAnswer: getCorrectAnswer(currentItem), isCorrect }]);

    if (isCorrect) setCorrectAnswers(correctAnswers + 1);
    else setIncorrectAnswers(incorrectAnswers + 1);

    setTimeout(() => {
      const nextIndex = items.indexOf(currentItem) + 1;
      if (nextIndex < items.length) {
        setCurrentItem(items[nextIndex]);
        setUserAnswer('');
        setFeedback('');
        setIsSubmitting(false);
      } else {
        setFeedback('Zakończyłeś ćwiczenia!');
        setIsSubmitting(false);
      }
    }, 1000);
  };

  const checkAnswer = (answer, item) => {
    if (direction === 'jpToPl') {
      return item.polishWord.toLowerCase() === answer.trim().toLowerCase();
    } else {
      const correctAnswers = Array.isArray(item.romaji) ? item.romaji : [item.romaji];
      const possibleAnswers = correctAnswers.concat(Array.isArray(item.japaneseWord) ? item.japaneseWord : [item.japaneseWord]);
      return possibleAnswers.includes(answer.trim().toLowerCase());
    }
  };

  const getCorrectAnswer = (item) => {
    if (direction === 'jpToPl') {
      return item.polishWord;
    } else {
      return Array.isArray(item.romaji) ? item.romaji.join(', ') : item.romaji;
    }
  };

  const getQuestion = (item) => {
    if (direction === 'jpToPl') {
      return Array.isArray(item.japaneseWord) ? item.japaneseWord.join(', ') : item.japaneseWord;
    } else {
      return item.polishWord;
    }
  };

  if (!currentItem) return <p>Ładowanie...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {feedback === 'Zakończyłeś ćwiczenia!' ? (
        <Card className="w-full max-w-2xl mb-4 p-4 text-center">
          <h2 className="text-xl font-bold">Podsumowanie</h2>
          <p>Poprawne odpowiedzi: {correctAnswers}</p>
          <p>Niepoprawne odpowiedzi: {incorrectAnswers}</p>
          <Table className="w-full mt-4">
            <TableHeader>
              <TableRow>
                <TableCell>Pytanie</TableCell>
                <TableCell>Twoja odpowiedź</TableCell>
                <TableCell>Poprawna odpowiedź</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {answers.map((answer, index) => (
                <TableRow key={index}>
                  <TableCell>{answer.question}</TableCell>
                  <TableCell className={answer.isCorrect ? 'text-green-500' : 'text-red-500'}>{answer.answer}</TableCell>
                  <TableCell>{answer.correctAnswer}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className='m-2'>
            <div className="mb-2">
              <Link href='/profil'>
                <Button className="w-full">Powrót do profilu</Button>
              </Link>
            </div>
            {parseInt(categoryId, 10) < 8 && (
              <div>
                <Link href={`/nauka/kategorie/${parseInt(categoryId, 10) + 1}?direction=${direction}`}>
                  <Button className="w-full">Przejdź do kolejnej kategorii</Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      ) : (
        <>
          <Card className="w-full max-w-2xl mb-4 p-4">
            {direction === 'jpToPl' ? (
              <h2 className="text-4xl font-bold">{Array.isArray(currentItem.japaneseWord) ? currentItem.japaneseWord.join(', ') : currentItem.japaneseWord}</h2>
            ) : (
              <h2 className="text-4xl font-bold">{currentItem.polishWord}</h2>
            )}
          </Card>
          <Card className="w-full max-w-2xl mb-4 p-4">
            <form onSubmit={handleNext}>
              <Input 
                type="text" 
                placeholder={direction === 'jpToPl' ? 'Twoja odpowiedź po polsku' : 'Twoja odpowiedź w romaji'} 
                value={userAnswer} 
                onChange={(e) => setUserAnswer(e.target.value)} 
                disabled={isSubmitting}
              />
              <Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>Dalej</Button>
            </form>
            {feedback && <p className="mt-4">{feedback}</p>}
          </Card>
        </>
      )}
    </div>
  );
};

export default LearnCategory;
