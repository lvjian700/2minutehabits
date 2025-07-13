import React, { createContext, useContext, useEffect, useReducer } from 'react';
import type { Habit, HabitStore } from '../types/Habit';
import {
  DEFAULT_HABITS,
  setActiveHabitsInStore,
  updateHabitInStore,
  toggleLogInStore,
} from './habitStore';

interface HabitsContextValue {
  store: HabitStore;
  habits: Habit[];
  activeHabits: Habit[];
  setActiveHabits: (next: Habit[] | ((prev: Habit[]) => Habit[])) => void;
  updateHabit: (id: number, updates: Partial<Habit>) => void;
  toggleLog: (id: number, date: string) => void;
  replaceStore: (next: HabitStore) => void;
}

const HabitsContext = createContext<HabitsContextValue | undefined>(undefined);

type Action =
  | { type: 'setActiveHabits'; next: Habit[] | ((prev: Habit[]) => Habit[]) }
  | { type: 'updateHabit'; id: number; updates: Partial<Habit> }
  | { type: 'toggleLog'; id: number; date: string }
  | { type: 'replace'; store: HabitStore };

function initStore(): HabitStore {
  try {
    const item = localStorage.getItem('habits');
    if (item) return JSON.parse(item) as HabitStore;
  } catch (err) {
    console.warn(err);
  }
  return { active: DEFAULT_HABITS.map((h) => ({ ...h, logs: {} })) };
}

export function habitsReducer(state: HabitStore, action: Action): HabitStore {
  switch (action.type) {
    case 'setActiveHabits':
      return setActiveHabitsInStore(state, action.next);
    case 'updateHabit':
      return updateHabitInStore(state, action.id, action.updates);
    case 'toggleLog':
      return toggleLogInStore(state, action.id, action.date);
    case 'replace':
      return action.store;
    default:
      return state;
  }
}

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [store, dispatch] = useReducer(habitsReducer, undefined, initStore);

  useEffect(() => {
    try {
      localStorage.setItem('habits', JSON.stringify(store));
    } catch (err) {
      console.warn(err);
    }
  }, [store]);

  const value: HabitsContextValue = {
    store,
    habits: store.active,
    activeHabits: store.active,
    setActiveHabits: (next) => dispatch({ type: 'setActiveHabits', next }),
    updateHabit: (id, updates) => dispatch({ type: 'updateHabit', id, updates }),
    toggleLog: (id, date) => dispatch({ type: 'toggleLog', id, date }),
    replaceStore: (next) => dispatch({ type: 'replace', store: next }),
  };

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
};

export function useHabitsContext() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error('useHabitsContext must be used within HabitsProvider');
  return ctx;
}

export default HabitsContext;

