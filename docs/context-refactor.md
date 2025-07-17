# Proposed Refactor: React Context for Habit State

## Current State Management

The application stores habit information in the browser's `localStorage` via the
`useHabits` hook. Each component can call this hook independently. The hook
uses `useLocalStorage` to read and write the `habits` key:

```
useLocalStorage<HabitStore>('habits', { active: DEFAULT_HABITS.map(h => ({ ...h, logs: {} })) })
```

Components such as `App` and `AppMenu` both call `useHabits` separately.
Because `useHabits` maintains its own `useState` inside, multiple instances of
`useHabits` do **not** share state automatically. When one component updates the
habits, other components re-fetch from localStorage only when their hook runs.
This can lead to inconsistent UI until a reload.

## Why Use React Context

A React Context provides a single source of truth for the habit data. By wrapping the application in a provider, every component can consume the same state object without lifting state up or manually syncing between hook instances. Using a context also makes it easy to memoize actions and improves testability.

## Suggested Implementation

1. **Create a `HabitsContext`.**
   - Define a context value that includes the habit list and action methods
     (`setActiveHabits`, `updateHabit`, `toggleLog`).
   - Use `React.createContext` with an initial empty value.
2. **Implement a `HabitsProvider`.**
   - Move the logic from `useHabits` into this provider.
   - Internally use `useReducer` to update state. The reducer can reuse existing helper functions (`setActiveHabitsInStore`, etc.).
   - Persist the state to `localStorage` whenever it changes.
3. **Replace direct calls to `useHabits`.**
   - Wrap `<App />` in `<HabitsProvider>` in `main.jsx`.
   - Replace `useHabits()` calls with `useContext(HabitsContext)` wherever the
     habit data is needed (`App`, `AppMenu`, etc.).
4. **Update tests.**
   - Unit tests for the reducer logic can remain mostly the same.
   - Add a small test to ensure the provider exposes the context values.

## Benefits

- All components share the same state instance.
- Clear separation of actions and state reduces prop drilling.
- Easier to extend (e.g., add new actions or expose derived selectors).
- Still retains localStorage persistence for offline use.

This approach keeps the existing helper functions but centralizes state
management via React Context, avoiding duplication and potential sync issues.

## Task Breakdown

1. **Create context scaffolding**
   - Add `HabitsContext` and `HabitsProvider` in a new `src/context` folder.
   - Move the logic from `useHabits` into the provider using `useReducer`.
2. **Update component tree**
   - Wrap `<App />` with `<HabitsProvider>` in `src/main.jsx`.
   - Replace `useHabits` imports with `useContext(HabitsContext)` in components.
3. **Persist state and actions**
   - Reuse helpers like `setActiveHabitsInStore` for the reducer.
   - Save state to `localStorage` whenever it changes.
4. **Refactor tests**
   - Add tests for the context reducer and provider.
   - Adjust existing hook tests to use the new context where needed.

