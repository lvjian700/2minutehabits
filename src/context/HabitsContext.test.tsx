import { habitsReducer } from './HabitsContext';
import type { HabitStore, Habit } from '../types/Habit';

describe('habitsReducer', () => {
  it('updates active habits', () => {
    const store: HabitStore = { active: [{ id: 1, name: 'a', icon: 'a', priority: 1, logs: {} }] };
    const next: Habit[] = [{ id: 2, name: 'b', icon: 'b', priority: 1, logs: {} }];
    const result = habitsReducer(store, { type: 'setActiveHabits', next });
    expect(result.active[0].id).toBe(2);
  });
});

