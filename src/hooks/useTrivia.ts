import { useState } from 'react';
import axios from 'axios';
import { TriviaQuestion, TriviaAPIResponse } from '../types/trivia';

export const useTrivia = () => {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // Set loading to false initially
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<TriviaAPIResponse>('https://opentdb.com/api.php?amount=10');
      setQuestions(response.data.results);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          setError('Too many requests. Please try again later.');
        } else {
          setError('Failed to fetch trivia questions. Please try again.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { questions, loading, error, fetchQuestions };
};
