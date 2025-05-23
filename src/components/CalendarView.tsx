import React, { useState } from 'react';
import type { Habit } from '../types/Habit';
import { getLocalDateString } from '../utils/date';

interface CalendarViewProps {
  habit: Habit;
  onToggle: (date: string) => void;
  onClose: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ habit, onToggle, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = getLocalDateString();

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
    <div>
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
      {/* Calendar grid: horizontal-scrollable on mobile */}
      <div className="overflow-x-auto">
        <div className="min-w-[280px] min-w-full grid grid-cols-7 gap-1 gap-2 text-xs">
          {generateCalendar()}
        </div>
      </div>
      {/* Back to dashboard */}
      <button
        className="mt-4 text-gray-600 hover:text-gray-800 text-sm"
        onClick={onClose}
      >
        &larr; Back to Dashboard
      </button>
    </div>
  );
};

export default CalendarView;