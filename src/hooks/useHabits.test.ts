import { describe, it, expect } from 'vitest';
import type { HabitStore, Habit } from '../types/Habit';
import {
  setActiveHabitsInStore,
  updateHabitInStore,
  toggleLogInStore
} from './useHabits';

describe('useHabits store helpers', () => {
  describe('setActiveHabitsInStore', () => {
    it('sets active habits and reorders priorities', () => {
      const store: HabitStore = {
        active: [
          { id: 1, name: 'a', icon: 'a', priority: 1, logs: {} },
          { id: 2, name: 'b', icon: 'b', priority: 2, logs: {} }
        ]
      };
      const next: Habit[] = [
        { id: 2, name: 'b', icon: 'b', priority: 2, logs: {} },
        { id: 3, name: 'c', icon: 'c', priority: 3, logs: {} }
      ];
      const result = setActiveHabitsInStore(store, next);
      expect(result.active.map(h => h.id)).toEqual([2, 3]);
      expect(result.active.map(h => h.priority)).toEqual([1, 2]);
    });
  });



  describe('updateHabitInStore', () => {
    it('updates habit by id', () => {
      const store: HabitStore = {
        active: [{ id: 1, name: 'a', icon: 'a', priority: 1, logs: {} }]
      };
      const result = updateHabitInStore(store, 1, { name: 'updated' });
      expect(result.active[0].name).toBe('updated');
    });
  });



  describe('toggleLogInStore', () => {
    it('toggles log entry for given date', () => {
      const store: HabitStore = {
        active: [{ id: 1, name: 'a', icon: 'a', priority: 1, logs: {} }]
      };
      const date = '2023-01-01';
      let result = toggleLogInStore(store, 1, date);
      expect(result.active[0].logs[date]).toBe(true);
      result = toggleLogInStore(result, 1, date);
      expect(result.active[0].logs[date]).toBe(false);
    });
  });
});
