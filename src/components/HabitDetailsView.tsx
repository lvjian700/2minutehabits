import React, { useState, useRef, useEffect } from "react";
import useClickOutside from "../hooks/useClickOutside";

import type { Habit } from "../types/Habit";
import { MoreHorizontal, X } from "lucide-react";
import CalendarView from "./CalendarView";
import EditableText from "./EditableText";
import EmojiPickerPopover from "./EmojiPickerPopover";
import type { EmojiData } from "../types/EmojiData";
import { useHabitsContext } from "../context/HabitsContext";

interface HabitDetailsViewProps {
  habitId: number;
  onClose: () => void;
}

const HabitDetailsView: React.FC<HabitDetailsViewProps> = ({
  habitId,
  onClose,
}) => {
  const { habits, updateHabit, toggleLog } = useHabitsContext();
  const habit = habits.find((h) => h.id === habitId)!;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [editingIcon, setEditingIcon] = useState(false);
  const [habitIcon, setHabitIcon] = useState(habit.icon || "🏆");

  useEffect(() => {
    setHabitIcon(habit.icon || "🏆");
  }, [habit.icon]);

  const emojiIconRef = useRef<HTMLDivElement>(null);

  // Compute completed days from logs
  const completedDays = habit.logs
    ? Object.values(habit.logs).filter(Boolean).length
    : 0;
  const emoji = habitIcon;

  const handleSelectEmoji = (emojiData: EmojiData) => {
    setHabitIcon(emojiData.native);
    setEditingIcon(false);
    updateHabit(habit.id, { icon: emojiData.native });
  };

  return (
    <div className="p-6">
      {/* Header with habit info and close button */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div
            ref={emojiIconRef}
            className="text-5xl mr-4 cursor-pointer"
            onClick={() => setEditingIcon((prev) => !prev)}
          >
            {emoji}
          </div>
          <div>
            <EditableText
              initialValue={habit.name}
              onSave={(newName) => {
                updateHabit(habit.id, { name: newName });
              }}
              textElement="h2"
              textClassName="text-2xl font-bold text-gray-800 cursor-pointer"
              inputClassName="text-2xl font-bold border rounded px-2 py-1 mr-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              ariaLabel={`habit name ${habit.name}`}
            />
            <p className="text-gray-600">
              Completed {completedDays} {completedDays === 1 ? "day" : "days"}
            </p>
          </div>
        </div>
        <div>
          <button
            ref={buttonRef}
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <X size={20} className="text-gray-700" />
          </button>
        </div>
      </div>

      <EmojiPickerPopover
        anchorRef={emojiIconRef}
        isOpen={editingIcon}
        onSelect={handleSelectEmoji}
        onClose={() => setEditingIcon(false)}
      />

      {/* Calendar Component */}
      <CalendarView
        habit={habit}
        onToggle={(date) => toggleLog(habit.id, date)}
      />
    </div>
  );
};

export default HabitDetailsView;
