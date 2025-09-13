
import React from 'react';
import { Subject } from '../types';
import { SUBJECTS } from '../constants';
import SubjectCard from './SubjectCard';

interface DashboardProps {
  onSelectSubject: (subject: Subject) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectSubject }) => {
  return (
    <div>
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Welcome, Future Leader!</h2>
        <p className="mt-2 text-lg text-slate-600">What amazing things will you learn today?</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUBJECTS.map((subject) => (
          <SubjectCard key={subject.name} subject={subject} onSelect={onSelectSubject} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
