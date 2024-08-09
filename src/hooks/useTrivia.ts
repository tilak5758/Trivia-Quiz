import { useState, useEffect } from 'react';
import axios from 'axios';
import { TriviaQuestion, TriviaAPIResponse } from '../types/trivia';

export const useTrivia = () => {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    fetchQuestions();
  }, []);


  const fetchQuestions = async () => {
    setLoading(true); // Start loading before fetching
    setError(null); // Clear previous errors
    try {

      const response = await axios?.get<TriviaAPIResponse>('https://opentdb.com/api.php?amount=10');

      setQuestions(response.data.results);
      setLoading(false)
      setError(null); // Clear error if request is successful
      // Reset delay on success

    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          // Handle rate limit error
          setError('Too many requests. Please try again later.');
        } else {
          // Handle other Axios errors
          setError('Failed to fetch trivia questions. Please try again.');
        }
      } else {
        // Handle unexpected errors
        setError('An unexpected error occurred.');
      }
      setLoading(false); // Set loading to false even if an error occurs

    }

  };


  return { questions, loading, error, };
};
