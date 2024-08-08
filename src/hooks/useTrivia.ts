import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { TriviaQuestion, TriviaAPIResponse } from '../types/trivia';

export const useTrivia = (amount: number) => {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retryDelay, setRetryDelay] = useState<number>(0);

  const fetchQuestions = async (retries: number = 3, delay: number = 1000) => {
    try {
      const response = await axios.get<TriviaAPIResponse>(
        `https://opentdb.com/api.php?amount=${amount}`
      );
      setQuestions(response.data.results);
      setError(null); // Clear error if request is successful
      setRetryDelay(0); // Reset delay on success
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 429 && retries > 0) {
          // Set delay for user feedback
          setRetryDelay(delay / 1000); // Convert ms to seconds
          // Retry with exponential backoff
          setTimeout(() => fetchQuestions(retries - 1, delay * 2), delay);
        } else {
          // Handle other errors or if no retries left
          console.error("Error fetching trivia questions:", err);
          setError('Failed to load questions. Please try again later.');
        }
      } else {
        // Handle unexpected errors
        console.error("Unexpected error fetching trivia questions:", err);
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [amount]);

  return { questions, loading, error, retryDelay };
};
