
import React from 'react';
import { Subject } from '../types';

interface SubjectCardProps {
  subject: Subject;
  onSelect: (subject: Subject) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(subject)}
      className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center cursor-pointer transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group"
    >
      <div className={`w-20 h-20 rounded-full flex items-center justify-center ${subject.color} mb-4 transition-transform duration-300 group-hover:scale-110`}>
        <subject.icon className="w-12 h-12 text-white" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{subject.name}</h3>
      <p className="text-slate-500">{subject.description}</p>
    </div>
  );
};

export default SubjectCard;
