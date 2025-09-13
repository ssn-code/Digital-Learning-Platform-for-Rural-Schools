
import React from 'react';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface Lesson {
  title: string;
  introduction: string;
  keyConcepts: string[];
  detailedExplanation: string;
  funFact: string;
  quiz: QuizQuestion[];
}

export interface Subject {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  description: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}
