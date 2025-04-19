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
      className={`flex items-center p-3 border-l-4 cursor-pointer ${
        isActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-transparent hover:bg-gray-100'
      }`}
      onClick={onSelect}
    >
      <span className="text-2xl mr-2">{habit.icon}</span>
      <span className="text-lg font-medium">{habit.name}</span>
    </div>
  );
};

export default HabitSummary;