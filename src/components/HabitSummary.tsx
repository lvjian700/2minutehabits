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
      className={`flex items-center py-1 px-2 sm:py-3 sm:px-4 border-t-4 sm:border-l-4 sm:border-t-0 cursor-pointer rounded-lg transition-colors ${
        isActive
          ? 'border-blue-500 bg-blue-50 text-gray-900'
          : 'border-transparent hover:bg-gray-100 text-gray-700'
      }`}
    >
      <span className="text-xl sm:text-2xl mr-2">{habit.icon}</span>
      <span className="text-sm sm:text-lg font-medium">{habit.name}</span>
    </div>
  );
};

export default HabitSummary;