import { useMemo } from 'react';
import type { Habit, HabitStore } from '../types/Habit';
import useLocalStorage from './useLocalStorage';

export function setActiveHabitsInStore(
  prev: HabitStore,
  next: Habit[] | ((prevActive: Habit[]) => Habit[])
): HabitStore {
  const previousActive = prev.active;
  const newActive = (typeof next === 'function'
    ? (next as (p: Habit[]) => Habit[])(previousActive)
    : next
  ).filter(h => !h.archived);

  const withCorrectPriority = newActive.map((h, idx) => ({
    ...h,
    priority: idx + 1
  }));

  return {
    active: withCorrectPriority,
    inactive: prev.inactive
  };
}

export function addNewHabitsToStore(
  prev: HabitStore,
  newHabits: Omit<Habit, 'logs'>[]
): HabitStore {
  const formatted = newHabits.map(h => ({ ...h, logs: {} }));
  return {
    active: [...prev.active, ...formatted],
    inactive: prev.inactive
  };
}

export function updateHabitInStore(
  prev: HabitStore,
  habitId: number,
  updates: Partial<Habit>
): HabitStore {
  return {
    active: prev.active.map(h => (h.id === habitId ? { ...h, ...updates } : h)),
    inactive: prev.inactive.map(h => (h.id === habitId ? { ...h, ...updates } : h))
  };
}

export function archiveHabitInStore(prev: HabitStore, habitId: number): HabitStore {
  const habit = prev.active.find(h => h.id === habitId);
  if (!habit) return prev;

  const habitToArchive = { ...habit, archived: true };
  const remainingActive = prev.active.filter(h => h.id !== habitId);
  const rePrioritised = remainingActive.map((h, i) => ({ ...h, priority: i + 1 }));

  return {
    active: rePrioritised,
    inactive: [...prev.inactive, habitToArchive]
  };
}

export function resumeHabitInStore(prev: HabitStore, habitId: number): HabitStore {
  const habit = prev.inactive.find(h => h.id === habitId);
  if (!habit) return prev;

  const newPriority = prev.active.length + 1;
  const revived = { ...habit, archived: false, priority: newPriority };
  return {
    active: [...prev.active, revived],
    inactive: prev.inactive.filter(h => h.id !== habitId)
  };
}

export function toggleLogInStore(
  prev: HabitStore,
  habitId: number,
  dateStr: string
): HabitStore {
  return {
    active: prev.active.map(h => {
      if (h.id !== habitId) return h;
      if (h.archived) return h;
      const updatedLogs = { ...h.logs, [dateStr]: !h.logs[dateStr] };
      return { ...h, logs: updatedLogs };
    }),
    inactive: prev.inactive
  };
}

export default function useHabits() {
  const [store, setStore] = useLocalStorage<HabitStore>('habits', {
    active: [],
    inactive: []
  });

  const habits = useMemo(() => [...store.active, ...store.inactive], [store]);
  const activeHabits = store.active;
  const archivedHabits = store.inactive;

  const setActiveHabits = (
    next: Habit[] | ((prevActive: Habit[]) => Habit[])
  ) => {
    setStore(prev => setActiveHabitsInStore(prev, next));
  };

  const addNewHabits = (newHabits: Omit<Habit, 'logs'>[]) => {
    setStore(prev => addNewHabitsToStore(prev, newHabits));
  };

  const updateHabit = (habitId: number, updates: Partial<Habit>) => {
    setStore(prev => updateHabitInStore(prev, habitId, updates));
  };

  const archiveHabit = (habitId: number) => {
    setStore(prev => archiveHabitInStore(prev, habitId));
  };

  const resumeHabit = (habitId: number) => {
    setStore(prev => resumeHabitInStore(prev, habitId));
  };

  const toggleLog = (habitId: number, dateStr: string) => {
    setStore(prev => toggleLogInStore(prev, habitId, dateStr));
  };

  return {
    store,
    setStore,
    habits,
    activeHabits,
    archivedHabits,
    setActiveHabits,
    addNewHabits,
    updateHabit,
    archiveHabit,
    resumeHabit,
    toggleLog
  };
}
