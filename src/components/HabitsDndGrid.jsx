import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import HabitCard from "./HabitCard";
import { getLocalDateString } from "../utils/date";
import { useHabitsContext } from "../context/HabitsContext";

function SortableHabitCard({ habit, idx, onToggle, onSelect }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: habit.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.85 : 1,
        zIndex: isDragging ? 50 : "auto",
        userSelect: isDragging ? "none" : undefined,
        position: "relative",
      }}
      {...attributes}
      className="group"
    >
      <HabitCard
        habit={habit}
        onToggle={() => onToggle(habit.id)}
        onSelect={() => onSelect(habit.id)}
        order={idx}
        dragHandleProps={{
          ...listeners,
        }}
      />
    </div>
  );
}

const HabitsDndGrid = ({ onSelect }) => {
  const { activeHabits, setActiveHabits, toggleLog } = useHabitsContext();
  const habits = activeHabits;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = habits.findIndex((h) => h.id === active.id);
      const newIndex = habits.findIndex((h) => h.id === over.id);
      setActiveHabits(arrayMove(habits, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={habits.map((h) => h.id)}
        strategy={rectSortingStrategy}
      >
        {/* Use a single column layout on small screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {habits.map((habit, idx) => (
            <SortableHabitCard
              key={habit.id}
              habit={habit}
              idx={idx}
              onToggle={(id) => toggleLog(id, getLocalDateString())}
              onSelect={onSelect}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default HabitsDndGrid;
