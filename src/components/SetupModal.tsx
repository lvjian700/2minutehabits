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
    const newHabits = selectedIndices.map((idx, i) => ({
      id: Date.now() + i,
      name: suggestions[idx].name,
      icon: suggestions[idx].icon
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Select up to {maxSelectable} Habits</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {suggestions.map((s, idx) => (
            <div
              key={idx}
              className={`flex items-center p-2 border rounded cursor-pointer ${
                selectedIndices.includes(idx)
                  ? 'border-blue-500 bg-blue-100'
                  : 'border-gray-300'
              }`}
              onClick={() => toggleIndex(idx)}
            >
              <span className="text-2xl mr-2">{s.icon}</span>
              <span>{s.name}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between">
        <button
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={handleRandomize}
        >
          Randomize
        </button>
        <button
          className={`px-4 py-2 rounded text-white ${
            selectedIndices.length > 0
              ? 'bg-blue-500'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={handleSave}
          disabled={selectedIndices.length === 0}
        >
          Ready to Start
        </button>
        </div>
      </div>
    </div>
  );
};

export default SetupModal;