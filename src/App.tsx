import React, { useState } from "react";
import HabitsDndGrid from "./components/HabitsDndGrid";
import HabitDetailsView from "./components/HabitDetailsView";
import Modal from "./components/Modal";
import AppMenu from "./components/AppMenu";
import { useBoot } from "./hooks/useBoot";

const App: React.FC = () => {
  // Handle app initialization, service worker updates, and date refresh
  useBoot();

  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);

  return (
    <>
      <div className="min-h-screen p-4">
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-title-lg mb-6 text-color-title text-center">
            2-Minute Habits
          </h1>
          <AppMenu setSelectedHabitId={setSelectedHabitId} />

          {/* Grid view of habits */}
          <HabitsDndGrid onSelect={setSelectedHabitId} />
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
