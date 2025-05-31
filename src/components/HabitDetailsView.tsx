import React, { useState } from 'react';
import type { Habit } from '../types/Habit';
import { getLocalDateString } from '../utils/date';
import { X } from 'lucide-react';

interface HabitDetailsViewProps {
  habit: Habit;
  onToggle: (date: string) => void;
  onClose: () => void;
}

const HabitDetailsView: React.FC<HabitDetailsViewProps> = ({ habit, onToggle, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = getLocalDateString();
  
  // Compute completed days from logs
  const completedDays = habit.logs ? Object.values(habit.logs).filter(Boolean).length : 0;
  const emoji = (habit as any).emoji ?? (habit as any).icon ?? '🏆';

  const generateCalendar = () => {
    const cells: JSX.Element[] = [];
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
      cells.push(<div key={day} className="text-center text-medium text-gray-500">{day}</div>);
    });
    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={'empty-' + i} />);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateStr = getLocalDateString(date);
      const completed = habit.logs[dateStr];
      const isToday = dateStr === todayStr;
      
      // Check if date is in the future
      const isFutureDate = date > new Date();
      
      cells.push(
        <div
          key={dateStr}
          onClick={isFutureDate ? undefined : () => onToggle(dateStr)}
          className={`p-2 text-center rounded transition-colors text-sm 
            ${completed ? 'bg-green-500 text-white' : ''}
            ${isToday ? 'border-2 border-blue-500' : ''}
            ${isFutureDate 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50' 
              : 'cursor-pointer hover:bg-gray-100'}`
          }
        >
          {d}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="p-6">
      {/* Header with habit info and close button */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <div className="text-5xl mr-4">{emoji}</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{habit.name}</h2>
            <p className="text-gray-600">Completed {completedDays} {completedDays === 1 ? 'day' : 'days'}</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={24} className="text-gray-500" />
        </button>
      </div>

      {/* Month navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          className="px-3 py-1 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
        >
          &lt;
        </button>
        <div className="text-lg font-medium text-gray-800">
          {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </div>
        <button
          className="px-3 py-1 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
        >
          &gt;
        </button>
      </div>
      
      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[280px] grid grid-cols-7 gap-1 gap-2 text-xs">
          {generateCalendar()}
        </div>
      </div>
    </div>
  );
};

export default HabitDetailsView;
