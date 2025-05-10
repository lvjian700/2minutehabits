import React, { useState } from 'react';
import { Habit } from '../App';
import { GripVertical } from 'lucide-react';
import classNames from 'classnames';
// Fallback Card, CardContent, Button, Badge implementations
const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={classNames('rounded-2xl shadow-md bg-white relative overflow-hidden border border-gray-200 group transition-all', className)} {...props}>{children}</div>
);
const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={classNames('p-6 flex flex-col', className)} {...props}>{children}</div>
);
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }> = ({ className, children, variant, ...props }) => (
  <button className={classNames('px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 focus:outline-none',
    variant === 'secondary' ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : '',
    variant === 'ghost' ? 'bg-transparent hover:bg-gray-200 text-gray-700' : '',
    variant === 'link' ? 'underline text-blue-600 hover:text-blue-800 bg-transparent px-0 py-0' : '',
    className)} {...props}>{children}</button>
);
const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, children, ...props }) => (
  <span className={classNames('px-2 py-0.5 rounded-full text-xs font-semibold', className)} {...props}>{children}</span>
);

const priorityColors = [
  'bg-red-100 text-red-800',
  'bg-orange-100 text-orange-800',
  'bg-yellow-100 text-yellow-800',
  'bg-blue-100 text-blue-800',
];

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
  const todayStr = new Date().toISOString().split('T')[0];

  const generateCalendar = () => {
    const cells: JSX.Element[] = [];
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
      cells.push(<div key={day} className="font-bold text-center">{day}</div>);
    });
    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={'empty-' + i} />);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateStr = date.toISOString().split('T')[0];
      const completed = habit.logs[dateStr];
      const isToday = dateStr === todayStr;
      cells.push(
        <div
          key={dateStr}
          onClick={() => onToggle(dateStr)}
          className={`p-1 sm:p-2 text-center rounded cursor-pointer transition-colors ${completed ? 'bg-green-500 text-white' : 'hover:bg-gray-100'
            } ${isToday ? 'border-2 border-blue-500' : ''}`}
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
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
        >
          &lt;
        </button>
        <div className="text-lg font-medium text-gray-800">
          {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </div>
        <button
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
        >
          &gt;
        </button>
      </div>
      {/* Calendar grid: horizontal-scrollable on mobile */}
      <div className="overflow-x-auto">
        <div className="min-w-[280px] sm:min-w-full grid grid-cols-7 gap-1 sm:gap-2 text-xs sm:text-sm">
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