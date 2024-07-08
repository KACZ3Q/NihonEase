'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRandomLearnItems } from '@/data/services/learn';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/usercontext';

const LearnRandom = () => {
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [answers, setAnswers] = useState([]);
  const router = useRouter();
  const amount = 5;
  const searchParams = new URLSearchParams(window.location.search);
  const direction = searchParams.get('direction') || 'plToJp';
  const { user, setUser } = useUser();

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getRandomLearnItems({ amount });
      if (data.words && data.words.length > 0) {
        setItems(data.words);
        setCurrentItem(data.words[0]);
      } else {
        setItems([]);
        setCurrentItem(null);
      }
    };

    fetchItems();
  }, [amount]);

  const handleNext = (e) => {
    e.preventDefault();
    if (!currentItem) return;
    if (!userAnswer.trim()) {
      setFeedback('Proszę wpisać odpowiedź');
      return;
    }
    const isCorrect = checkAnswer(userAnswer, currentItem);
    setFeedback(isCorrect ? 'Poprawnie!' : 'Niepoprawnie');

    setAnswers([...answers, { id: currentItem.wordID, answer: userAnswer }]);

    if (isCorrect) setCorrectAnswers(correctAnswers + 1);
    else setIncorrectAnswers(incorrectAnswers + 1);

    setTimeout(() => {
      const nextIndex = items.indexOf(currentItem) + 1;
      if (nextIndex < items.length) {
        setCurrentItem(items[nextIndex]);
        setUserAnswer('');
        setFeedback('');
      } else {
        setFeedback('Zakończyłeś ćwiczenia!');
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

  const handleRetry = async () => {
    const data = await getRandomLearnItems({ amount });
    setItems(data.words);
    setCurrentItem(data.words[0]);
    setUserAnswer('');
    setFeedback('');
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setAnswers([]);
  };

  if (!currentItem) return <p>Ładowanie...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {feedback === 'Zakończyłeś ćwiczenia!' ? (
        <Card className="w-full max-w-2xl mb-4 p-4 text-center">
          <h2 className="text-xl font-bold">Podsumowanie</h2>
          <p>Poprawne odpowiedzi: {correctAnswers}</p>
          <p>Niepoprawne odpowiedzi: {incorrectAnswers}</p>
          <div className='space-x-2 space-y-2'>
            <Button onClick={handleRetry}>Losuj kolejne słówka</Button>
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
              />
              <Button type="submit" className="mt-4">Dalej</Button>
            </form>
            {feedback && <p className="mt-4">{feedback}</p>}
          </Card>
        </>
      )}
    </div>
  );
};

export default LearnRandom;
