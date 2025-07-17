import { habitsReducer } from './HabitsContext';

describe('habitsReducer', () => {
  it('updates active habits', () => {
    const store = { active: [{ id: 1, name: 'a', icon: 'a', priority: 1, logs: {} }] };
    const next = [{ id: 2, name: 'b', icon: 'b', priority: 1, logs: {} }];
    const result = habitsReducer(store, { type: 'setActiveHabits', next });
    expect(result.active[0].id).toBe(2);
  });
});

