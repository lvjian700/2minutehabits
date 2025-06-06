import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { Habit } from '../types/Habit';
import { getLocalDateString } from '../utils/date';
import { MoreHorizontal, X } from 'lucide-react';
import CalendarView from './CalendarView';

interface HabitDetailsViewProps {
  habit: Habit;
  onToggle: (date: string) => void;
  onClose: () => void;
  onEditHabit?: (habitId: number, updates: Partial<Habit>) => void;
}

// Simple Emoji Picker
const EMOJIS = [
  '🏋️', '🏃', '🧘', '✍️', '🌙', '📖', '🍭', '🚭', '✅', '💪', '🔥', '🥗', '🛏️', '🧑‍💻', '🎨', '🧹', '🎸', '🚴', '🚶', '🧊', '🥤', '🍎', '🍀', '🌳', '🌞', '🌊', '🌻'
];

// Dropdown Menu Component
const DropdownMenu: React.FC<{
  buttonRef: React.RefObject<HTMLButtonElement>;
  isOpen: boolean;
  onClose: () => void;
  onCloseModal: () => void;
  onEditIcon: () => void;
  onEditName: () => void;
}> = ({ buttonRef, isOpen, onClose, onCloseModal, onEditIcon, onEditName }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  
  // Calculate position when menu opens
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
      // Only show menu after position is calculated
      setTimeout(() => setIsVisible(true), 0);
    } else {
      setIsVisible(false);
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
      className="fixed py-1 w-36 bg-white rounded-md shadow-lg z-50 border-l border-b border-gray-200 transition-opacity duration-150"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <button 
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        onClick={() => {
          onClose();
          onEditIcon();
        }}
      >
        <span role="img" aria-label="Change Icon" className="mr-2">😀</span>
        Change Icon
      </button>
      <button 
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
        onClick={() => {
          onClose();
          onEditName();
        }}
      >
        <span className="mr-2">✏️</span>
        Edit Name
      </button>
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
    </div>,
    document.body
  );
};

const HabitDetailsView: React.FC<HabitDetailsViewProps> = ({ habit, onToggle, onClose, onEditHabit }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [editingIcon, setEditingIcon] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(habit.name);
  const [tempIcon, setTempIcon] = useState(habit.icon || '🏆');

  // Compute completed days from logs
  const completedDays = habit.logs ? Object.values(habit.logs).filter(Boolean).length : 0;
  const emoji = tempIcon;

  const handleSelectEmoji = (e: string) => {
    setTempIcon(e);
    setEditingIcon(false);
    if (onEditHabit) onEditHabit(habit.id, { icon: e });
  };

  const handleNameSave = () => {
    setEditingName(false);
    if (onEditHabit && tempName.trim() && tempName !== habit.name) {
      onEditHabit(habit.id, { name: tempName.trim() });
    }
  };

  return (
    <div className="p-6">
      {/* Header with habit info and close button */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div className="text-5xl mr-4 cursor-pointer" onClick={() => setEditingIcon(true)}>{emoji}</div>
          <div>
            {editingName ? (
              <div className="flex items-center">
                <input
                  className="text-2xl font-bold border rounded px-2 py-1 mr-2"
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={e => { if (e.key === 'Enter') handleNameSave(); }}
                  autoFocus
                />
                <button className="text-sm px-2 py-1 bg-blue-500 text-white rounded" onClick={handleNameSave}>Save</button>
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-gray-800 cursor-pointer" onClick={() => setEditingName(true)}>{tempName}</h2>
            )}
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
            onEditIcon={() => setEditingIcon(true)}
            onEditName={() => setEditingName(true)}
          />
        </div>
      </div>

      {/* Emoji Picker Modal */}
      {editingIcon && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-2 font-bold">Pick an emoji</div>
            <div className="grid grid-cols-8 gap-2 max-w-xs">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  className="text-2xl p-1 hover:bg-gray-200 rounded"
                  onClick={() => handleSelectEmoji(e)}
                >
                  {e}
                </button>
              ))}
            </div>
            <button className="mt-4 px-4 py-2 bg-gray-200 rounded" onClick={() => setEditingIcon(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Calendar Component */}
      <CalendarView 
        habit={{ ...habit, icon: tempIcon, name: tempName }}
        onToggle={onToggle}
        onClose={onClose}
      />
    </div>
  );
};

export default HabitDetailsView;
