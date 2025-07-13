import React, { useState } from 'react';
import { getLocalDateString } from './utils/date';
import HabitsDndGrid from './components/HabitsDndGrid';
import { useHabitsContext } from './context/HabitsContext';
import HabitDetailsView from './components/HabitDetailsView';
import Modal from './components/Modal';
import AppMenu from './components/AppMenu';
import { useBoot } from './hooks/useBoot';

const App: React.FC = () => {
  // Handle app initialization, service worker updates, and date refresh
  useBoot();

  const {
    habits,
    activeHabits,
    setActiveHabits,
    toggleLog,
  } = useHabitsContext();
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);

  return (
    <>
      <div className="min-h-screen p-4">
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-title-lg mb-6 text-color-title text-center">2-Minute Habits</h1>
          <AppMenu
            setSelectedHabitId={setSelectedHabitId}
          />
          
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
                    habitId={selectedHabitId}
                    onClose={() => setSelectedHabitId(null)}
                  />
                )}
              </Modal>
        </div>

      </div>
    </>
  );
};

export default App;
