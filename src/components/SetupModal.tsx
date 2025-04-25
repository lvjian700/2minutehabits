import React, { useState } from 'react';

interface Suggestion {
  name: string;
  icon: string;
}

interface SetupModalProps {
  suggestions: Suggestion[];
  maxSelectable: number;
  /** Number of habits to randomly pre-select and randomize count */
  defaultRandomCount: number;
  onSave: (habits: { id: number; name: string; icon: string }[]) => void;
}

const SetupModal: React.FC<SetupModalProps> = ({ suggestions, maxSelectable, defaultRandomCount, onSave }) => {
  // initialize with defaultRandomCount random suggestions
  const [selectedIndices, setSelectedIndices] = useState<number[]>(() => {
    const available = suggestions.map((_, i) => i);
    const picked: number[] = [];
    const count = Math.min(defaultRandomCount, available.length);
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * available.length);
      picked.push(available.splice(idx, 1)[0]);
    }
    return picked;
  });

  const toggleIndex = (idx: number) => {
    setSelectedIndices(prev => {
      if (prev.includes(idx)) {
        return prev.filter(i => i !== idx);
      }
      if (prev.length < maxSelectable) {
        return [...prev, idx];
      }
      return prev;
    });
  };

  const handleSave = () => {
    if (selectedIndices.length === 0) {
      alert(`Please select at least one habit.`);
      return;
    }
    // The order of habits is now the user-selected order
    const newHabits = selectedIndices.map((idx, i) => ({
      id: Date.now() + i,
      name: suggestions[idx].name,
      icon: suggestions[idx].icon,
      // Optionally, you could add order: i here if needed in the future
    }));
    onSave(newHabits);
  };

  const handleRandomize = () => {
    const available = suggestions.map((_, i) => i);
    const picked: number[] = [];
    const count = Math.min(defaultRandomCount, available.length);
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * available.length);
      picked.push(available.splice(idx, 1)[0]);
    }
    setSelectedIndices(picked);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Choose up to {maxSelectable} Habits
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {suggestions.map((s, idx) => {
            const selectedOrder = selectedIndices.indexOf(idx);
            return (
              <div
                key={idx}
                onClick={() => toggleIndex(idx)}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors relative ${
                  selectedOrder !== -1
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl mr-2">{s.icon}</span>
                <span>{s.name}</span>
                {selectedOrder !== -1 && (
                  <span
                    className="ml-auto bg-gray-200 text-gray-700 text-xs font-semibold rounded-full px-2 py-0.5 select-none shadow-sm"
                    style={{
                      minWidth: 20,
                      textAlign: 'center',
                      opacity: 0.95,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {selectedOrder + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleRandomize}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Randomize
          </button>
          <button
            onClick={handleSave}
            disabled={selectedIndices.length === 0}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors focus:outline-none ${
              selectedIndices.length > 0
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Ready to Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupModal;