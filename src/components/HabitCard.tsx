import React from 'react';
import { Habit } from '../App';

interface HabitCardProps {
  habit: Habit;
  onToggle: () => void;
  onSelect: () => void;
}

const calculateStreaks = (logs: Record<string, boolean>) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  let current = 0;
  let d = new Date();
  while (logs[d.toISOString().split('T')[0]]) {
    current++;
    d.setDate(d.getDate() - 1);
  }

  let maxStreak = 0;
  let temp = 0;
  Object.keys(logs)
    .sort()
    .forEach(date => {
      if (logs[date]) {
        temp++;
        maxStreak = Math.max(maxStreak, temp);
      } else {
        temp = 0;
      }
    });

  return { current, max: maxStreak, completedToday: !!logs[todayStr] };
};

const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle, onSelect }) => {
  const { current, max, completedToday } = calculateStreaks(habit.logs);

  return (
    <div
      onClick={onSelect}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center cursor-pointer"
    >
      <div className="text-5xl mb-3">{habit.icon}</div>
      <div className="text-xl font-semibold mb-2 text-gray-800">{habit.name}</div>
      <div className="mb-4 text-center text-gray-600">
        <div>
          Streak: <span className="font-medium text-gray-800">{current}</span>
        </div>
        <div>
          Max: <span className="font-medium text-gray-800">{max}</span>
        </div>
      </div>
      <button
        onClick={e => {
          e.stopPropagation();
          onToggle();
        }}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 focus:outline-none ${
          completedToday
            ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        }`}
      >
        {completedToday ? 'Completed' : 'Mark Complete'}
      </button>
    </div>
  );
};

export default HabitCard;