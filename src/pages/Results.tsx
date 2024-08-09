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
    <div className='results-container'>
      <h1 className='results-header'>Quiz Results</h1>
      <p className='results-summary'>Total Questions Served: {totalQuestions}</p>
      <p className='results-summary'>Total Correct Answers: {correctAnswers}</p>
      <p className='results-summary'>Total Incorrect Answers: {incorrectAnswers}</p>
      <button className='back-button' onClick={handleBackToHome}>Restart Game</button>
    </div>
  );
};

export default Results;
