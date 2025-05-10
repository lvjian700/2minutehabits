import React from 'react';
import { Habit } from '../App';

interface HabitSummaryProps {
  habit: Habit;
  isActive: boolean;
  onSelect: () => void;
}

const HabitSummary: React.FC<HabitSummaryProps> = ({ habit, isActive, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`flex items-center
        py-1 px-2 sm:py-3 sm:px-4 gap-2 
        cursor-pointer rounded-lg
        ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100' }`}
    >
      <span className="text-xl sm:text-2xl mr-2">{habit.icon}</span>
      <span className="text-sm sm:text-lg">{habit.name}</span>
    </div>
  );
};

export default HabitSummary;