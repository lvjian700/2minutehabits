export interface Habit {
  id: number;
  name: string;
  icon: string;
  priority: number;
  logs: Record<string, boolean>;
}
