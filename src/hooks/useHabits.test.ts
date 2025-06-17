import { describe, it, expect } from 'vitest';
import type { HabitStore, Habit } from '../types/Habit';
import {
  setActiveHabitsInStore,
  addNewHabitsToStore,
  updateHabitInStore,
  archiveHabitInStore,
  resumeHabitInStore,
  toggleLogInStore
} from './useHabits';

describe('useHabits store helpers', () => {
  describe('setActiveHabitsInStore', () => {
    it('sets active habits and reorders priorities', () => {
      const store: HabitStore = {
        active: [
          { id: 1, name: 'a', icon: 'a', priority: 1, logs: {} },
          { id: 2, name: 'b', icon: 'b', priority: 2, logs: {} }
        ],
        inactive: []
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

  describe('addNewHabitsToStore', () => {
    it('appends habits with empty logs', () => {
      const store: HabitStore = { active: [], inactive: [] };
      const result = addNewHabitsToStore(store, [
        { id: 1, name: 'test', icon: 't', priority: 1 }
      ]);
      expect(result.active.length).toBe(1);
      expect(result.active[0].logs).toEqual({});
    });
  });

  describe('updateHabitInStore', () => {
    it('updates habit by id in both lists', () => {
      const store: HabitStore = {
        active: [{ id: 1, name: 'a', icon: 'a', priority: 1, logs: {} }],
        inactive: []
      };
      const result = updateHabitInStore(store, 1, { name: 'updated' });
      expect(result.active[0].name).toBe('updated');
    });
  });

  describe('archiveHabitInStore and resumeHabitInStore', () => {
    it('moves habit between active and inactive', () => {
      const store: HabitStore = {
        active: [{ id: 1, name: 'a', icon: 'a', priority: 1, logs: {} }],
        inactive: []
      };
      const archived = archiveHabitInStore(store, 1);
      expect(archived.active).toHaveLength(0);
      expect(archived.inactive[0].archived).toBe(true);
      const resumed = resumeHabitInStore(archived, 1);
      expect(resumed.active).toHaveLength(1);
      expect(resumed.active[0].archived).toBe(false);
      expect(resumed.inactive).toHaveLength(0);
    });
  });

  describe('toggleLogInStore', () => {
    it('toggles log entry for given date', () => {
      const store: HabitStore = {
        active: [{ id: 1, name: 'a', icon: 'a', priority: 1, logs: {} }],
        inactive: []
      };
      const date = '2023-01-01';
      let result = toggleLogInStore(store, 1, date);
      expect(result.active[0].logs[date]).toBe(true);
      result = toggleLogInStore(result, 1, date);
      expect(result.active[0].logs[date]).toBe(false);
    });
  });
});
