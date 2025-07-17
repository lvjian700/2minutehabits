export const DEFAULT_HABITS = [
  { id: 1, name: "Fitness", icon: "🏋️", priority: 1 },
  { id: 2, name: "Meditation", icon: "🧘", priority: 2 },
  { id: 3, name: "Wind Down for Sleep", icon: "🌙", priority: 3 },
  { id: 4, name: "No Sugar Drinks", icon: "🥤", priority: 4 },
];

export function setActiveHabitsInStore(prev, next) {
  const previousActive = prev.active;
  const newActive = typeof next === "function" ? next(previousActive) : next;

  const withCorrectPriority = newActive.map((h, idx) => ({
    ...h,
    priority: idx + 1,
  }));

  return {
    active: withCorrectPriority,
  };
}

export function updateHabitInStore(prev, habitId, updates) {
  return {
    active: prev.active.map((h) =>
      h.id === habitId ? { ...h, ...updates } : h,
    ),
  };
}

export function toggleLogInStore(prev, habitId, dateStr) {
  const updateLogs = (habits) =>
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
