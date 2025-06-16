import React, { useState } from 'react';
import type { Habit, HabitStore } from './types/Habit';
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
  // Use the visibility refresh hook to handle date changes when tab becomes active
  useVisibilityRefresh();

  // Store now contains separate arrays for active and inactive (archived) habits
  const [store, setStore] = useLocalStorage<HabitStore>('habits', {
    active: [],
    inactive: []
  });

  const habits: Habit[] = [...store.active, ...store.inactive];
  const activeHabits = store.active;
  const archivedHabits = store.inactive;
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);

  /**
   * Update the ordering / contents of the ACTIVE habits list only.
   * - `next` can be either a new array of `Habit`s or a callback that
   *   receives the previous `active` array and returns the new one.
   * - Ensures all returned habits are **not** archived.
   * - Re-indexes `priority` so they are sequential starting from 1.
   * - Leaves the `inactive` list untouched.
   */
  const setActiveHabits = (
    next: Habit[] | ((prevActive: Habit[]) => Habit[])
  ) => {
    setStore(prev => {
      const previousActive = prev.active;
      const newActive = (typeof next === 'function'
        ? (next as (p: Habit[]) => Habit[])(previousActive)
        : next
      ).filter(h => !h.archived);

      // Ensure priorities are continuous starting at 1
      const withCorrectPriority = newActive.map((h, idx) => ({
        ...h,
        priority: idx + 1
      }));

      return {
        active: withCorrectPriority,
        inactive: prev.inactive
      };
    });
  };

  const addNewHabits = (newHabits: Omit<Habit, 'logs'>[]) => {
    const formatted = newHabits.map(h => ({ ...h, logs: {} }));
    setStore(prev => ({
      active: [...prev.active, ...formatted],
      inactive: prev.inactive
    }));
  };

  const updateHabit = (habitId: number, updates: Partial<Habit>) => {
    setStore(prev => ({
      active: prev.active.map(h => (h.id === habitId ? { ...h, ...updates } : h)),
      inactive: prev.inactive.map(h => (h.id === habitId ? { ...h, ...updates } : h))
    }));
  };

  const archiveHabit = (habitId: number) => {
    setStore(prev => {
      // Find the habit in the active list
      const habit = prev.active.find(h => h.id === habitId);
      if(habit == null) return prev;

      const habitToArchive = { ...habit, archived: true };

      // Remove from active list
      const remainingActive = prev.active.filter(h => h.id !== habitId);

      // Re-assign priority so they are sequential starting from 1
      const rePrioritised = remainingActive.map((h, i) => ({ ...h, priority: i + 1 }));

      return {
        active: rePrioritised,
        inactive: [...prev.inactive, habitToArchive]
      };
    });
  };

  const toggleLog = (habitId: number, dateStr: string) => {
    setStore(prev => ({
      active: prev.active.map(h => {
        if (h.id !== habitId) return h;
        if (h.archived) return h; // shouldn't happen in active, but guard
        const updatedLogs = { ...h.logs, [dateStr]: !h.logs[dateStr] };
        return { ...h, logs: updatedLogs };
      }),
      inactive: prev.inactive
    }));
  };

  // Resume an archived habit
  const resumeHabit = (habitId: number) => {
    setStore(prev => {
      // find the habit in inactive list
      const habit = prev.inactive.find(h => h.id === habitId);
      if (!habit) return prev; // nothing to do

      const newPriority = prev.active.length + 1;
      const revived = { ...habit, archived: false, priority: newPriority };
      return {
        active: [...prev.active, revived],
        inactive: prev.inactive.filter(h => h.id !== habitId)
      };
    });
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
      {/* Developer menu */}
      <DevMenu 
        habits={store} 
        setHabits={setStore} 
        setSelectedHabitId={setSelectedHabitId} 
      />
    </>
  );
};

export default App;