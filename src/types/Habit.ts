export interface Habit {
  id: number;
  name: string;
  icon: string;
  priority: number;
  logs: Record<string, boolean>;
  /** Indicates if the habit is archived (no longer shown in active list). */
  archived?: boolean;
}

/**
 * Wrapper object stored in localStorage under the key `habits` after v0.1.
 * Keeps active and inactive (archived) habits separate while preserving legacy
 * array-only compatibility.
 */
export interface HabitStore {
  active: Habit[];
  inactive: Habit[];
}
