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
      className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center cursor-pointer"
      onClick={onSelect}
    >
      <div className="text-4xl mb-2">{habit.icon}</div>
      <div className="text-lg font-semibold mb-2">{habit.name}</div>
      <div className="mb-4 text-center">
        <div>Streak: {current}</div>
        <div>Max: {max}</div>
      </div>
      <button
        className={`px-4 py-2 rounded ${
          completedToday ? 'bg-gray-400' : 'bg-green-500'
        } text-white`}
        onClick={e => {
          e.stopPropagation();
          onToggle();
        }}
      >
        {completedToday ? 'Completed' : 'Mark Complete'}
      </button>
    </div>
  );
};

export default HabitCard;