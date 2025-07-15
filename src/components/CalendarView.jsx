import React, { useState, useRef, useEffect } from 'react';

import { getLocalDateString } from '../utils/date';

const CalendarView = ({ habit, onToggle }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [navButtonsVisible, setNavButtonsVisible] = useState(false);
  const navTimeoutRef = useRef(null);
  
  const showNavButtons = () => {
    if (navTimeoutRef.current) {
      window.clearTimeout(navTimeoutRef.current);
      navTimeoutRef.current = null;
    }
    setNavButtonsVisible(true);
  };
  
  const hideNavButtons = () => {
    if (navTimeoutRef.current) {
      window.clearTimeout(navTimeoutRef.current);
    }
    const delay = 3000;
    navTimeoutRef.current = window.setTimeout(() => {
      setNavButtonsVisible(false);
      navTimeoutRef.current = null;
    }, delay);
  };
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (navTimeoutRef.current) {
        window.clearTimeout(navTimeoutRef.current);
      }
    };
  }, []);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const startDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = getLocalDateString();

  const generateCalendar = () => {
    const cells = [];
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
      cells.push(<div key={day} className="text-center font-medium text-gray-500 py-2">{day}</div>);
    });
    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={"empty-" + i} />);
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
          className={`p-2 text-center rounded transition-colors text-sm h-12 flex items-center justify-center
            ${completed ? "bg-green-500 text-white" : "hover:bg-gray-100"}
            ${isToday ? "border-2 border-blue-500" : ""}
            ${
              isFutureDate
                ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }
              `}
        >
          {d}
        </div>,
      );
    }
    return cells;
  };

  return (
    <div className="py-2">
      {/* Month navigation */}
      <div 
        className="flex justify-between items-center"
        aria-label="Month navigation"
        onMouseEnter={showNavButtons}
        onMouseLeave={hideNavButtons}
      >
        <button
          className={`px-3 py-1 text-gray-500 rounded hover:bg-gray-300 transition-opacity duration-300 ${navButtonsVisible ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          aria-label="Previous month"
        >
          &lt;
        </button>
        <div className="text-lg font-medium text-gray-800 cursor-default">
          {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </div>
        <button
          className={`px-3 py-1 text-gray-500 rounded hover:bg-gray-300 transition-opacity duration-300 ${navButtonsVisible ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          aria-label="Next month"
        >
          &gt;
        </button>
      </div>
      {/* Calendar grid: horizontal-scrollable on mobile */}
      <div className="overflow-x-auto">
        <div className="min-w-[280px] grid grid-cols-7 gap-3 text-sm mt-4">
          {generateCalendar()}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
