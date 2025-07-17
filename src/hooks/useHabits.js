import { useHabitsContext } from "../context/HabitsContext";
export {
  setActiveHabitsInStore,
  updateHabitInStore,
  toggleLogInStore,
} from "../context/habitStore";

export default function useHabits() {
  return useHabitsContext();
}
