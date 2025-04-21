import React, { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import SetupModal from './components/SetupModal';
import HabitCard from './components/HabitCard';
import HabitSummary from './components/HabitSummary';
import CalendarView from './components/CalendarView';

export interface Habit {
  id: number;
  name: string;
  icon: string;
  logs: Record<string, boolean>;
}

// Predefined habit suggestions for onboarding
// Predefined habit suggestions for onboarding (single-emoji icons)
const SUGGESTIONS = [
  { name: 'Fitness', icon: '🏋️' },
  { name: 'Running', icon: '🏃' },
  { name: 'Meditation', icon: '🧘' },
  { name: 'Writing', icon: '✍️' },
  { name: 'Prioritize Sleep', icon: '😴' },
  { name: 'Reading', icon: '📖' },
  // Use a single sugar icon for the 'No Sugar' habit
  { name: 'No Sugar', icon: '🍭' },
  { name: 'No Smoking', icon: '🚭' }
];

const App: React.FC = () => {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habitTrackerData', []);
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);

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
    <div className="min-h-screen p-4">
      <h1 className="text-3xl text-center font-semibold mb-6 text-gray-900">Habit Tracker</h1>
      {habits.length === 0 && (
        <SetupModal
          suggestions={SUGGESTIONS}
          maxSelectable={5}
          defaultRandomCount={3}
          onSave={saveHabits}
        />
      )}
      {habits.length > 0 && (
        <div className="relative max-w-4xl mx-auto flex transition-all duration-500">
          {/* Left panel: grid view or summary list on calendar open */}
          <div
            className={`transition-all duration-500 ${
              selectedHabitId ? 'w-full sm:w-1/4' : 'w-full'
            }`}
          >
            {selectedHabitId === null ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {habits.map(habit => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onToggle={() =>
                      toggleLog(
                        habit.id,
                        new Date().toISOString().split('T')[0]
                      )
                    }
                    onSelect={() => setSelectedHabitId(habit.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col space-y-2 p-2 bg-gray-50 rounded">
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
            <div className="transition-all duration-500 w-full sm:w-3/4 bg-white shadow-lg p-4 ml-4">
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
  );
};

export default App;