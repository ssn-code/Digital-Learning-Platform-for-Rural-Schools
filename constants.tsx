
import React from 'react';
import { Subject } from './types';
import BookOpenIcon from './components/icons/BookOpenIcon';
import BeakerIcon from './components/icons/BeakerIcon';
import GlobeAltIcon from './components/icons/GlobeAltIcon';
import CalculatorIcon from './components/icons/CalculatorIcon';

export const SUBJECTS: Subject[] = [
  {
    name: 'Mathematics',
    icon: CalculatorIcon,
    color: 'bg-blue-500',
    description: 'Explore numbers, shapes, and problem-solving.',
  },
  {
    name: 'Science',
    icon: BeakerIcon,
    color: 'bg-green-500',
    description: 'Discover the world around us, from atoms to galaxies.',
  },
  {
    name: 'History',
    icon: GlobeAltIcon,
    color: 'bg-amber-500',
    description: 'Learn about the important events and people of the past.',
  },
  {
    name: 'Language Arts',
    icon: BookOpenIcon,
    color: 'bg-red-500',
    description: 'Improve your reading, writing, and communication skills.',
  },
];
