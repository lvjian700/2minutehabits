import React, { useState } from "react";
import HabitsDndGrid from "./components/HabitsDndGrid";
import HabitDetailsView from "./components/HabitDetailsView";
import Modal from "./components/Modal";
import AppMenu from "./components/AppMenu";
import AboutTheApp from "./components/AboutTheApp";
import { useBoot } from "./hooks/useBoot";

const App = () => {
  // Handle app initialization, service worker updates, and date refresh
  useBoot();

  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [isAboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen p-4">
        <div className="relative max-w-4xl mx-auto">
          <h1 className="text-title-lg mb-6 text-color-title text-center">
            2-Minute Habits
          </h1>
          <AppMenu
            setSelectedHabitId={setSelectedHabitId}
            onAboutClick={() => setAboutOpen(true)}
          />

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
          <Modal
            isOpen={isAboutOpen}
            onClose={() => setAboutOpen(false)}
            aria-label="Habit details"
          >
            <AboutTheApp />
          </Modal>
        </div>
      </div>
    </>
  );
};

export default App;
