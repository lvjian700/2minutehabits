import React, { useState, useEffect, useRef } from 'react';
import { getLocalDateString } from '../utils/date';
import type { Habit } from '../types/Habit';

interface DevMenuProps {
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
  setSelectedHabitId: (id: number | null) => void;
}

const DevMenu: React.FC<DevMenuProps> = ({ habits, setHabits, setSelectedHabitId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);


  // Clear all habit data
  const handleClearData = () => {
    if (confirm('Clear all habit data? This cannot be undone.')) {
      localStorage.removeItem('habitTrackerData');
      setHabits([]);
      setSelectedHabitId(null);
      setIsOpen(false);
    }
  };
  
  // Current app version
  const APP_VERSION = '0.0.1';
  
  // Export data as JSON file
  const handleExportData = () => {
    try {
      // Include version number with the data
      const exportData = {
        version: APP_VERSION,
        habits: habits
      };
      const data = JSON.stringify(exportData, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `habit-tracker-backup-${getLocalDateString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target?.result as string);
          
          // Handle both versioned and legacy data formats
          let habitsData;
          
          if (importedData.version && Array.isArray(importedData.habits)) {
            // New format with version
            habitsData = importedData.habits;
            console.log(`Importing data from version ${importedData.version}`);
          } else if (Array.isArray(importedData)) {
            // Legacy format (just an array)
            habitsData = importedData;
            console.log('Importing legacy data format');
          } else {
            throw new Error('Invalid data format');
          }
          
          // Confirm before overwriting
          if (confirm('Import this data? This will replace your current habits.')) {
            setHabits(habitsData);
            setSelectedHabitId(null);
            setIsOpen(false);
          }
        } catch (error) {
          console.error('Import failed:', error);
          alert('Failed to import data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="fixed bottom-4 left-4 z-50" ref={menuRef}>
      {isOpen && (
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
        onClick={() => setIsOpen(open => !open)}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full shadow-lg transition"
      >
        ⚙️
      </button>
    </div>
  );
};

export default DevMenu;
