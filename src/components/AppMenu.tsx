import React, { useState, useRef } from 'react';
import { Trash2, Laptop, type LucideIcon, RefreshCcwDot, Plus, MoreHorizontal } from 'lucide-react';
import { exportHabitsToFile, importHabitsFromFile } from '../utils/appData';
import useHabits from '../hooks/useHabits';
import useClickOutside from '../hooks/useClickOutside';


interface AppMenuProps {
  setSelectedHabitId: (id: number | null) => void;
}

interface MenuItemProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ label, icon: Icon, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 w-full text-left px-4 py-1 text-gray-800 hover:bg-yellow-400 hover:text-white rounded-lg`}
  >
    <Icon size={16} />
    <span>{label}</span>
  </button>
);

const MenuDivider: React.FC = () => (
  <div className="h-px mx-3 my-2 bg-gray-200" />
);

// New habit floating action button
interface NewHabitButtonProps {
  onClick?: () => void;
}
const NewHabitButton: React.FC<NewHabitButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="p-2 rounded-full transition  hover:bg-yellow-400 hover:text-white"
  >
    <Plus size={20} />
  </button>
);

// More / overflow menu button
interface MoreButtonProps {
  isOpen: boolean;
  toggle: () => void;
}
const MoreButton: React.FC<MoreButtonProps> = ({ isOpen, toggle }) => (
  <button
    onClick={toggle}
    className="p-2 rounded-full transition hover:bg-yellow-400 hover:text-white"
    aria-expanded={isOpen}
    aria-label="More options"
  >
    <MoreHorizontal size={20} />
  </button>
);

const AppMenu: React.FC<AppMenuProps> = ({ setSelectedHabitId }) => {
  const { store: habits, setStore: setHabits } = useHabits();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, closeMenu, { active: isMenuOpen });


  // Clear all habit data
  const handleClearData = () => {
    if (confirm('Clear all habit data? This cannot be undone.')) {
      localStorage.removeItem('habits');
      setHabits({ active: [], inactive: [] });
      setSelectedHabitId(null);
      closeMenu();
    }
  };

  // Export data as JSON file
  const handleExportData = () => {
    try {
      exportHabitsToFile(habits);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  };
  
  // Import data from JSON file
  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const importedHabits = await importHabitsFromFile(file);
        if (confirm('Import this data? This will replace your current habits.')) {
          setHabits(importedHabits);
          setSelectedHabitId(null);
          closeMenu();
        }
      } catch (error) {
        console.error('Import failed:', error);
        alert('Failed to import data. Please check the file format.');
      }
    };
    input.click();
  };

  function handleAddNewHabit(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="absolute top-0 right-0 z-50" ref={menuRef}>
      <div className="flex gap-4 rounded-full shadow-lg bg-white/20 backdrop-blur-md backdrop-saturate-150 border border-white/30">
        <NewHabitButton />
        <MoreButton isOpen={isMenuOpen} toggle={() => setIsMenuOpen(open => !open)} />
      </div>
      {/* Creating new habit */}
      
      {/* Dropdown menu attached to bottom of icon */}
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 p-2 rounded-xl shadow-lg bg-white/60 backdrop-blur-md backdrop-saturate-150 border border-black/10">
          <MenuItem label="Backup data" icon={Laptop} onClick={handleExportData} />
          <MenuItem label="Restore data" icon={RefreshCcwDot} onClick={handleImportData} />
          <MenuDivider />
          <MenuItem label="Clear data" icon={Trash2} onClick={handleClearData} />
        </div>
      )}
    </div>
  );
};

export default AppMenu;
