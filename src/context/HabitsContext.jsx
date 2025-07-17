import React, { createContext, useContext, useEffect, useReducer } from 'react';
import {
  DEFAULT_HABITS,
  setActiveHabitsInStore,
  updateHabitInStore,
  toggleLogInStore,
} from './habitStore';


const HabitsContext = createContext(undefined);



function initStore() {
  try {
    const item = localStorage.getItem('habits');
    if (item) return JSON.parse(item);
  } catch (err) {
    console.warn(err);
  }
  return { active: DEFAULT_HABITS.map((h) => ({ ...h, logs: {} })) };
}

export function habitsReducer(state, action) {
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

export const HabitsProvider = ({ children }) => {
  const [store, dispatch] = useReducer(habitsReducer, undefined, initStore);

  useEffect(() => {
    try {
      localStorage.setItem('habits', JSON.stringify(store));
    } catch (err) {
      console.warn(err);
    }
  }, [store]);

  const value = {
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

