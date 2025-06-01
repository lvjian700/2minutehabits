import React, { useState, useEffect } from 'react';
import type { Habit } from './types/Habit';
import { getLocalDateString } from './utils/date';
import HabitsDndGrid from './components/HabitsDndGrid';
import useLocalStorage from './hooks/useLocalStorage';
import SetupModal from './components/SetupModal';
import HabitDetailsView from './components/HabitDetailsView';
import Modal from './components/Modal';
import DevMenu from './components/DevMenu';
import { useVisibilityRefresh } from './hooks/useDateRefresh';

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
  
  // Use the visibility refresh hook to handle date changes when tab becomes active
  useVisibilityRefresh();

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
        <div className="relative max-w-4xl mx-auto">
          {/* Grid view of habits */}
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
          
          {/* Modal with habit details */}
          <Modal 
            isOpen={selectedHabitId !== null} 
            onClose={() => setSelectedHabitId(null)}
            aria-label="Habit details"
          >
            {selectedHabitId !== null && (
              <HabitDetailsView
                habit={habits.find(h => h.id === selectedHabitId)!}
                onToggle={date =>
                  toggleLog(selectedHabitId, date)
                }
                onClose={() => setSelectedHabitId(null)}
              />
            )}
          </Modal>
        </div>
      )}
      </div>
      {/* Developer menu */}
      <DevMenu 
        habits={habits} 
        setHabits={setHabits} 
        setSelectedHabitId={setSelectedHabitId} 
      />
    </>
  );
};

export default App;