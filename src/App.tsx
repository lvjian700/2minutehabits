import React, { useState } from 'react';
import { getLocalDateString } from './utils/date';
import HabitsDndGrid from './components/HabitsDndGrid';
import useHabits from './hooks/useHabits';
import SetupModal from './components/SetupModal';
import HabitDetailsView from './components/HabitDetailsView';
import Modal from './components/Modal';
import AppMenu from './components/AppMenu';
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
  // Use the visibility refresh hook to handle date changes when tab becomes active
  useVisibilityRefresh();

  const {
    habits,
    activeHabits,
    archivedHabits,
    setActiveHabits,
    addNewHabits,
    updateHabit,
    archiveHabit,
    resumeHabit,
    toggleLog,
  } = useHabits();
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);

  return (
    <>
      <div className="min-h-screen p-4">
      <h1 className="text-title-lg mb-6 text-color-title text-center">2-Minute Habits</h1>
      {habits.length === 0 && (
        <SetupModal
          suggestions={SUGGESTIONS}
          maxSelectable={5}
          defaultRandomCount={3}
          onSave={addNewHabits}
        />
      )}
      {habits.length > 0 && (
        <div className="relative max-w-4xl mx-auto">
          {/* Grid view of habits */}
          <HabitsDndGrid
            habits={activeHabits}
            onReorder={newActive => {
              // Maintain order only within active habits
              const newOrderIds = newActive.map(h => h.id);
              const reordered = [...habits].sort((a,b)=>{
                const ai = newOrderIds.indexOf(a.id);
                const bi = newOrderIds.indexOf(b.id);
                if(ai===-1) return 1; // archived stay at bottom
                if(bi===-1) return -1;
                return ai - bi;
              });
              setActiveHabits(reordered);
            }}
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
                onEditHabit={updateHabit}
                onArchive={archiveHabit}
              />
            )}
          </Modal>
        </div>
      )}
      {archivedHabits.length > 0 && (
        <div className="relative max-w-4xl mx-auto mt-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Archived Habits</h2>
          <div className="space-y-3">
            {archivedHabits.map(h => {
              const completedDays = h.logs ? Object.values(h.logs).filter(Boolean).length : 0;
              return (
                <div key={h.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{h.icon}</span>
                    <div>
                      <p className="font-medium text-gray-800">{h.name}</p>
                      <p className="text-sm text-gray-600">Completed Days: {completedDays}</p>
                    </div>
                  </div>
                  <button
                    className="px-3 py-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    onClick={() => resumeHabit(h.id)}
                  >
                    Resume
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      </div>
      {/* App menu */}
      <AppMenu
        setSelectedHabitId={setSelectedHabitId}
      />
    </>
  );
};

export default App;