import type { Habit, HabitStore } from "../types/Habit";

// Hardcoded habits that will be initialized on first launch
export const DEFAULT_HABITS: Omit<Habit, "logs">[] = [
  { id: 1, name: "Fitness", icon: "🏋️", priority: 1 },
  { id: 2, name: "Meditation", icon: "🧘", priority: 2 },
  { id: 3, name: "Wind Down for Sleep", icon: "🌙", priority: 3 },
  { id: 4, name: "No Sugar Drinks", icon: "🍵", priority: 4 },
];

export function setActiveHabitsInStore(
  prev: HabitStore,
  next: Habit[] | ((prevActive: Habit[]) => Habit[]),
): HabitStore {
  const previousActive = prev.active;
  const newActive =
    typeof next === "function"
      ? (next as (p: Habit[]) => Habit[])(previousActive)
      : next;

  const withCorrectPriority = newActive.map((h, idx) => ({
    ...h,
    priority: idx + 1,
  }));

  return {
    active: withCorrectPriority,
  };
}

export function updateHabitInStore(
  prev: HabitStore,
  habitId: number,
  updates: Partial<Habit>,
): HabitStore {
  return {
    active: prev.active.map((h) =>
      h.id === habitId ? { ...h, ...updates } : h,
    ),
  };
}

export function toggleLogInStore(
  prev: HabitStore,
  habitId: number,
  dateStr: string,
): HabitStore {
  const updateLogs = (habits: Habit[]) =>
    habits.map((h) => {
      if (h.id !== habitId) return h;
      const currentValue = h.logs[dateStr] || false;
      return {
        ...h,
        logs: { ...h.logs, [dateStr]: !currentValue },
      };
    });

  return {
    active: updateLogs(prev.active),
  };
}
