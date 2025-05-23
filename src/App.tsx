import React, { useState } from 'react';
import type { Habit } from './types/Habit';
import { getLocalDateString } from './utils/date';
import HabitsDndGrid from './components/HabitsDndGrid';
import useLocalStorage from './hooks/useLocalStorage';
import SetupModal from './components/SetupModal';
import HabitSummary from './components/HabitSummary';
import CalendarView from './components/CalendarView';

// Predefined habit suggestions for onboarding (single-emoji icons)
const SUGGESTIONS = [
  { name: 'Fitness', icon: '🏋️' },
  { name: 'Running', icon: '🏃' },
  { name: 'Meditation', icon: '🧘' },
  { name: 'Writing', icon: '✍️' },
  { name: 'Wind Down for Sleep', icon: '🌙' },
  { name: 'Reading', icon: '📖' },
  { name: 'No Sugar', icon: '🍭' },
  { name: 'No Smoking', icon: '🚭' }
];

const App: React.FC = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habitTrackerData', []);
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);
  const [debugOpen, setDebugOpen] = useState(false);

  const saveHabits = (newHabits: Omit<Habit, 'logs'>[]) => {
    const formatted = newHabits.map(h => ({ ...h, logs: {} }));
    setHabits(formatted);
  };

  const toggleLog = (habitId: number, dateStr: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id === habitId) {
          const updatedLogs = { ...h.logs, [dateStr]: !h.logs[dateStr] };
          return { ...h, logs: updatedLogs };
        }
        return h;
      })
    );
  };
  
  // Clear all habit data for debugging
  const handleClearData = () => {
    if (confirm('Clear all habit data? This cannot be undone.')) {
      localStorage.removeItem('habitTrackerData');
      setHabits([]);
      setSelectedHabitId(null);
      setDebugOpen(false);
    }
  };

  return (
    <>
      <div className="min-h-screen p-4">
      <h1 className="text-title-lg mb-6 text-color-title text-center">2-Minute Habits</h1>
      {habits.length === 0 && (
        <SetupModal
          suggestions={SUGGESTIONS}
          maxSelectable={5}
          defaultRandomCount={3}
          onSave={saveHabits}
        />
      )}
      {habits.length > 0 && (
        <div className="relative max-w-4xl mx-auto flex flex-col sm:flex-row transition-all duration-500">
          {/* Left panel: grid view or summary list on calendar open */}
          <div
            className={`transition-all duration-500 ${
              selectedHabitId ? 'w-full sm:w-1/4' : 'w-full'
            }`}
          >
            {selectedHabitId === null ? (
              <HabitsDndGrid
                habits={habits}
                onReorder={setHabits}
                onToggle={(habitId) =>
                  toggleLog(
                    habitId,
                    getLocalDateString()
                  )
                }
                onSelect={setSelectedHabitId}
              />
            ) : (
              <div className="flex flex-col gap-2 font-medium">
                {habits.map(habit => (
                  <HabitSummary
                    key={habit.id}
                    habit={habit}
                    isActive={habit.id === selectedHabitId}
                    onSelect={() => setSelectedHabitId(habit.id)}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Right panel: calendar view */}
          {selectedHabitId !== null && (
            <div className="transition-all duration-500 w-full bg-white rounded-xl shadow-md p-4 mt-4 sm:mt-0 sm:ml-6">
              <CalendarView
                habit={habits.find(h => h.id === selectedHabitId)!}
                onToggle={date =>
                  toggleLog(selectedHabitId, date)
                }
                onClose={() => setSelectedHabitId(null)}
              />
            </div>
          )}
        </div>
      )}
      </div>
      {/* Debug menu: clear local storage */}
      <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setDebugOpen(open => !open)}
        className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-full shadow-lg transition"
      >
        ⚙️
      </button>
      {debugOpen && (
        <div className="mt-2 bg-white border border-gray-200 rounded shadow-lg">
          <button
            onClick={handleClearData}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            Clear Data
          </button>
        </div>
      )}
      </div>
    </>
  );
};

export default App;