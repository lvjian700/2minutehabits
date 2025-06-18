import React, { useState, useEffect, useRef } from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import { exportHabitsToFile, importHabitsFromFile } from '../utils/appData';
import useHabits from '../hooks/useHabits';


interface AppMenuProps {
  setSelectedHabitId: (id: number | null) => void;
}

const AppMenu: React.FC<AppMenuProps> = ({ setSelectedHabitId }) => {
  const { store: habits, setStore: setHabits } = useHabits();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);


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

  return (
    <div className="absolute top-0 right-0 z-50" ref={menuRef}>
      {isMenuOpen && (
        <div className="mt-2 bg-white border border-gray-200 rounded shadow-lg">
          <button
            onClick={handleExportData}
            className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100 border-b border-gray-200"
          >
            Export Data
          </button>
          <button
            onClick={handleImportData}
            className="block w-full text-left px-4 py-2 text-green-600 hover:bg-gray-100 border-b border-gray-200"
          >
            Import Data
          </button>
          <button
            onClick={handleClearData}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            Clear Data
          </button>
        </div>
      )}
      <button
        onClick={() => setIsMenuOpen(open => !open)}
        className="p-2 rounded-full shadow-lg transition bg-white/20 hover:bg-white/30 backdrop-blur-md backdrop-saturate-150 border border-white/30"
      >
        <MenuIcon size={20} />
      </button>
    </div>
  );
};

export default AppMenu;
