
import React, { useState } from 'react';
import { Subject, Lesson } from './types';
import Dashboard from './components/Dashboard';
import LessonView from './components/LessonView';

const App: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [generatedLesson, setGeneratedLesson] = useState<Lesson | null>(null);

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setGeneratedLesson(null); // Reset lesson when new subject is selected
  };

  const handleBackToDashboard = () => {
    setSelectedSubject(null);
    setGeneratedLesson(null);
  };
  
  const handleLessonGenerated = (lesson: Lesson) => {
    setGeneratedLesson(lesson);
  };

  return (
    <div className="min-h-screen bg-sky-50 font-sans text-slate-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-sky-600 tracking-tight">
            Rural Ed-Connect
          </h1>
          {selectedSubject && (
            <button
              onClick={handleBackToDashboard}
              className="px-4 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
            >
              Back to Subjects
            </button>
          )}
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {!selectedSubject ? (
          <Dashboard onSelectSubject={handleSelectSubject} />
        ) : (
          <LessonView 
            subject={selectedSubject} 
            onLessonGenerated={handleLessonGenerated}
            lesson={generatedLesson}
          />
        )}
      </main>
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Rural Ed-Connect. Empowering Future Minds.</p>
      </footer>
    </div>
  );
};

export default App;
