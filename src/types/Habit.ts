export interface Habit {
  id: number;
  name: string;
  icon: string;
  priority: number;
  logs: Record<string, boolean>;
}

/**
 * Wrapper object stored in localStorage under the key `habits`.
 * Stores the list of active habits.
 */
export interface HabitStore {
  active: Habit[];
}
