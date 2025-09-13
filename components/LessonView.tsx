
import React, { useState, useCallback } from 'react';
import { Subject, Lesson } from '../types';
import { generateLesson } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import Quiz from './Quiz';
import Chatbot from './Chatbot';

interface LessonViewProps {
  subject: Subject;
  lesson: Lesson | null;
  onLessonGenerated: (lesson: Lesson) => void;
}

const LessonView: React.FC<LessonViewProps> = ({ subject, lesson, onLessonGenerated }) => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateLesson = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a topic to learn about.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const generated = await generateLesson(subject.name, topic);
      onLessonGenerated(generated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [topic, subject.name, onLessonGenerated]);

  const LessonContent: React.FC<{ lesson: Lesson }> = ({ lesson }) => (
    <div className="space-y-8">
      <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">{lesson.title}</h2>
      
      <div className="p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-sky-700 mb-3">Introduction</h3>
        <p className="text-slate-600 leading-relaxed">{lesson.introduction}</p>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-sky-700 mb-3">Key Concepts</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          {lesson.keyConcepts.map((concept, index) => <li key={index}>{concept}</li>)}
        </ul>
      </div>

      <div className="p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-2xl font-bold text-sky-700 mb-3">Let's Dive Deeper!</h3>
        <div className="text-slate-600 leading-relaxed whitespace-pre-line">{lesson.detailedExplanation}</div>
      </div>
      
       <div className="p-6 bg-amber-100 border-l-4 border-amber-400 rounded-r-lg shadow-md">
        <h3 className="text-2xl font-bold text-amber-800 mb-3">Fun Fact! 💡</h3>
        <p className="text-amber-700 italic">{lesson.funFact}</p>
      </div>
      
      <Quiz questions={lesson.quiz} />
      <Chatbot topic={lesson.title} />
    </div>
  );

  return (
    <div>
      <h2 className="text-center text-4xl font-bold mb-4">
        <span className="text-slate-500">Subject: </span> 
        <span className={`${subject.color.replace('bg-', 'text-')}`}>{subject.name}</span>
      </h2>
      
      {!lesson && (
        <div className="max-w-xl mx-auto mt-8 p-8 bg-white rounded-xl shadow-lg text-center">
          <h3 className="text-2xl font-bold mb-4">What do you want to learn about?</h3>
          <form onSubmit={handleGenerateLesson}>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., 'The Solar System' or 'Fractions'"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="mt-4 w-full px-6 py-3 bg-sky-500 text-white font-bold rounded-lg hover:bg-sky-600 transition-colors disabled:bg-slate-400 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : 'Generate Lesson'}
            </button>
          </form>
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      )}

      {isLoading && !lesson && (
         <div className="text-center mt-8">
            <p className="text-lg text-slate-600">Creating your lesson... This might take a moment!</p>
         </div>
      )}

      {lesson && <LessonContent lesson={lesson} />}
    </div>
  );
};

export default LessonView;
