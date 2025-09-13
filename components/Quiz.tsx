
import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
}

const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    if (option === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  const getButtonClass = (option: string) => {
    if (!isAnswered) {
      return "bg-white hover:bg-sky-100 border-slate-300";
    }
    if (option === currentQuestion.correctAnswer) {
      return "bg-green-200 border-green-400 text-green-800 font-bold";
    }
    if (option === selectedAnswer) {
      return "bg-red-200 border-red-400 text-red-800 font-bold";
    }
    return "bg-slate-100 border-slate-300 text-slate-500";
  };
  
  if (showResults) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg text-center">
        <h3 className="text-2xl font-bold text-sky-700 mb-4">Quiz Complete!</h3>
        <p className="text-xl text-slate-700 mb-2">You scored:</p>
        <p className="text-5xl font-extrabold text-sky-600 mb-6">{score} / {questions.length}</p>
        <button
          onClick={handleRestartQuiz}
          className="px-6 py-3 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold text-sky-700 mb-4">Check Your Knowledge!</h3>
      <div className="mb-4">
        <p className="text-slate-500 text-sm">Question {currentQuestionIndex + 1} of {questions.length}</p>
        <p className="text-lg text-slate-800 font-semibold mt-1">{currentQuestion.question}</p>
      </div>
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            disabled={isAnswered}
            className={`w-full text-left p-4 border rounded-lg transition-colors duration-200 ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>
      {isAnswered && (
        <div className="mt-4 p-4 rounded-lg bg-slate-50">
           <p className="text-slate-700">{currentQuestion.explanation}</p>
           <button
            onClick={handleNextQuestion}
            className="mt-4 w-full px-6 py-3 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition-colors"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Show Results'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
