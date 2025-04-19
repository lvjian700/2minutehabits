import React, { useState } from 'react';
import { Habit } from '../App';

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
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(day => {
      cells.push(<div key={day} className="font-bold text-center">{day}</div>);
    });
    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={'empty-'+i} />);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateStr = date.toISOString().split('T')[0];
      const completed = habit.logs[dateStr];
      const isToday = dateStr === todayStr;
      cells.push(
        <div
          key={dateStr}
          className={`p-2 text-center rounded cursor-pointer ${
            completed ? 'bg-green-500 text-white' : ''
          } ${isToday ? 'border-2 border-blue-500' : ''}`}
          onClick={() => onToggle(dateStr)}
        >
          {d}
        </div>
      );
    }
    return cells;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          className="px-2 py-1 bg-blue-500 text-white rounded"
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
        >
          {'<'}
        </button>
        <div className="font-semibold">
          {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </div>
        <button
          className="px-2 py-1 bg-blue-500 text-white rounded"
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
        >
          {'>'}
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">{generateCalendar()}</div>
      <button
        className="mt-4 text-blue-500"
        onClick={() => onClose()}
      >
        Close
      </button>
    </div>
  );
};

export default CalendarView;