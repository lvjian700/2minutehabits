import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { Habit } from '../types/Habit';
import { getLocalDateString } from '../utils/date';
import { MoreHorizontal, X } from 'lucide-react';

interface HabitDetailsViewProps {
  habit: Habit;
  onToggle: (date: string) => void;
  onClose: () => void;
}

// Dropdown Menu Component
const DropdownMenu: React.FC<{
  buttonRef: React.RefObject<HTMLButtonElement>;
  isOpen: boolean;
  onClose: () => void;
  onCloseModal: () => void;
}> = ({ buttonRef, isOpen, onClose, onCloseModal }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
  }, [isOpen, buttonRef]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && 
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, buttonRef]);
  
  if (!isOpen) return null;
  
  return ReactDOM.createPortal(
    <div 
      ref={menuRef}
      className="fixed py-1 w-36 bg-white rounded-md shadow-lg z-50 border-l border-b border-gray-200"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <button 
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        onClick={() => {
          onClose();
          onCloseModal();
        }}
      >
        <X size={16} className="mr-2" />
        Close
      </button>
      {/* Add more menu items here in the future */}
    </div>,
    document.body
  );
};

const HabitDetailsView: React.FC<HabitDetailsViewProps> = ({ habit, onToggle, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [navButtonsVisible, setNavButtonsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navTimeoutRef = useRef<number | null>(null);
  
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
      cells.push(<div key={day} className="text-center font-medium text-gray-500 py-2">{day}</div>);
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
          className={`p-3 text-center rounded transition-colors text-base h-14 flex items-center justify-center
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
        <div>
          <button 
            ref={buttonRef}
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <MoreHorizontal size={20} className="text-gray-500" />
          </button>
          
          <DropdownMenu 
            buttonRef={buttonRef}
            isOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
            onCloseModal={onClose}
          />
        </div>
      </div>

      {/* Month navigation */}
      <div 
        className="flex justify-between items-center"
        aria-label="Month navigation"
        onMouseEnter={showNavButtons}
        onMouseLeave={hideNavButtons}
      >
        <button
          className={`px-3 py-1 text-gray-700 rounded hover:bg-gray-300 transition-opacity duration-300 ${navButtonsVisible ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          aria-label="Previous month"
        >
          &lt;
        </button>
        <div className="text-lg font-medium text-gray-800 cursor-default">
          {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </div>
        <button
          className={`px-3 py-1 text-gray-700 rounded hover:bg-gray-300 transition-opacity duration-300 ${navButtonsVisible ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          aria-label="Next month"
        >
          &gt;
        </button>
      </div>
      
      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[280px] grid grid-cols-7 gap-3 text-sm my-4">
          {generateCalendar()}
        </div>
      </div>
    </div>
  );
};

export default HabitDetailsView;
