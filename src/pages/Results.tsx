import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Results.css';

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalQuestions = 0, correctAnswers = 0 } = location.state as { totalQuestions: number; correctAnswers: number };
  const incorrectAnswers = totalQuestions - correctAnswers;

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className='container'>
      <h1>Quiz Results</h1>
      <p>Total Questions Served: {totalQuestions}</p>
      <p>Total Correct Answers: {correctAnswers}</p>
      <p>Total Incorrect Answers: {incorrectAnswers}</p>
      <button onClick={handleBackToHome}>Back to Home</button>
    </div>
  );
};

export default Results;
