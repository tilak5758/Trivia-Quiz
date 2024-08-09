import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrivia } from '../hooks/useTrivia';
import '../styles/Trivia.css';

const Trivia: React.FC = () => {
  const [startQuiz, setStartQuiz] = useState<boolean>(false);
  const { questions, loading, error, fetchQuestions } = useTrivia();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const navigate = useNavigate();

  const handleStartClick = async () => {
    setStartQuiz(true);
    await fetchQuestions(); // Fetch questions only when the quiz starts
  };

  if (!startQuiz) {
    return (
      <div className="container">
        <h1>Welcome to the Trivia Quiz!</h1>
        <button className="start-button" onClick={handleStartClick}>
          Start Quiz
        </button>
      </div>
    );
  }

  if (loading) return <p className='loading'>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Handle case where there are no questions or the index is out of bounds
  if (questions.length === 0 || currentQuestionIndex >= questions.length) {
    return <p>No questions available.</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer].sort();

  const handleAnswerClick = (answer: string) => {
    if (!isAnswered) {
      setSelectedAnswer(answer);
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === currentQuestion.correct_answer) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setIsAnswered(false);
      setSelectedAnswer(null);
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      navigate('/results', { state: { totalQuestions: 10, correctAnswers: correctAnswersCount } });
    }
  };

  return (
    <div className="container">
      <div className="question-header">
        <h2 className="question-number">
          Question {currentQuestionIndex + 1} of 10
        </h2>
        <h2 className="question">{currentQuestion.question}</h2>
      </div>
      <div className="answers">
        {allAnswers.map((answer, index) => {
          let className = 'answer-button';
          if (isAnswered) {
            if (answer === currentQuestion.correct_answer) {
              className += ' correct';
            } else if (answer === selectedAnswer) {
              className += ' incorrect';
            }
          } else if (selectedAnswer === answer) {
            className += ' selected';
          }

          return (
            <button
              key={index}
              className={className}
              onClick={() => handleAnswerClick(answer)}
              disabled={isAnswered}
            >
              {answer}
            </button>
          );
        })}
      </div>
      <button
        className="submit-button"
        onClick={handleAnswerSubmit}
        disabled={!selectedAnswer || isAnswered}
      >
        Submit
      </button>

      {isAnswered && (
        <div className="feedback">
          {selectedAnswer === currentQuestion.correct_answer ? (
            <p className="correct">Correct!</p>
          ) : (
            <p className="wrong">Wrong! The correct answer is {currentQuestion.correct_answer}.</p>
          )}
          <button className="next-button" onClick={handleNextQuestion}>
            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish Quiz'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Trivia;
