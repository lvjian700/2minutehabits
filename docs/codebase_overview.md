# iHahits Codebase Overview
*File: ivotes/docs/codebase_overview.md*

---

## 1  Project Purpose
**iHahits** (“2-Minute Habits” in the UI) is a lightweight, fully client-side habit-tracking Progressive Web App (PWA).
Core goals:

* Track 4 core daily habits with a single tap
* Persist data offline in `localStorage` – no backend required
* Provide an installable, mobile-first experience via Service Worker + Web Manifest
* Keep the codebase approachable: React, JavaScript, Vite, TailwindCSS only

---

## 2  Tech Stack at a Glance
| Layer                 | Tooling / Library | Notes |
| --------------------- | ----------------- | ----- |
| UI framework          | React 18 + JSX    | Functional components only |
| Routing               | *none*            | Single-screen app |
| State management      | React Context + `useReducer` | Centralized in `src/context` |
| Drag & Drop           | `@dnd-kit`        | Grid re-ordering of habits |
| Styling               | TailwindCSS 3     | Configured in `tailwind.config.cjs` |
| Bundler / Dev server  | Vite              | Config in `vite.config.js` |
| Testing               | Vitest + React-Testing-Library | See `**/*.test.js[x]` |
| PWA                   | Custom service-worker (`service-worker.js`) + manifest |
| Deployment            | GitHub Pages (via `npm run deploy` or GH Actions) |

---

## 3  Directory Layout (top-level)
```
ivotes/
  ├─ dist/            ← Production build output
  ├─ docs/            ← High-level docs (this file, refactor notes, etc.)
  ├─ src/             ← **All application code**
  │   ├─ components/  ← Reusable React components
  │   ├─ context/     ← Global state (React Context + helpers)
  │   ├─ hooks/       ← Custom hooks
  │   ├─ utils/       ← Pure utility modules
  │   ├─ App.jsx      ← Root component after boot logic
  │   └─ main.jsx     ← ReactDOM entry & context provider
  ├─ public assets (icons, manifest, sw)
  ├─ vite/tailwind configs
  └─ tests alongside code
```

---

## 4  Key Modules & Their Responsibilities

### 4.1 `src/context`
* **`HabitsContext.jsx`** – Creates the React Context, exposes the Provider, defines the reducer, and synchronises state to `localStorage`.
* **`habitStore.js`** – Pure helper functions that mutate an immutable `HabitStore` object (`setActiveHabitsInStore`, `updateHabitInStore`, `toggleLogInStore`) and the `DEFAULT_HABITS` seed list.

Design notes
• State shape is intentionally minimal: `{ active: Habit[] }` only.
• Provider persists to `localStorage` on every change for offline support.
• By colocating pure helpers here, the reducer logic stays unit-testable.

### 4.2 `src/components`
High-level components worth knowing:

| Component                  | Responsibility |
| -------------------------- | -------------- |
| `HabitsDndGrid`           | Displays draggable grid of habit cards, wires `@dnd-kit` sensors & DnD context |
| `HabitCard`               | Visual representation of one habit with toggle button & drag handle |
| `HabitDetailsView`        | Slide-in panel that shows per-habit calendar with log back-fill |
| `Modal` (+ sub-dir)       | Accessible dialog wrapper (ARIA labels, focus trap, escape key etc.) |
| `AppMenu`                 | Overflow menu (reset, randomise habits, About, etc.) |
| `AboutTheApp`             | Static markdown rendered inside a modal |

### 4.3 `src/hooks`
| Hook              | Summary |
| ----------------- | ------- |
| `useBoot`         | One-time app boot logic: listen for service-worker updates and force reload on new day |
| `useHabits`       | Thin wrapper that just re-exports `useHabitsContext()` for convenience |
| `useClickOutside` | Generic helper used by popovers/menus |
| `useLocalStorage` | Generic state+localStorage synchronisation (still used in some tests) |

### 4.4 `src/utils`
* `date.js` – Only `getLocalDateString()` right now, but isolated for easier mocking in tests
* `appData.js` – Utilities for demo import/export (not used heavily in production flow)

---

## 5  Data Flow
1. **UI actions** (toggle habit, reorder grid, edit details) **dispatch** reducer actions via context methods.
2. Reducer uses pure helpers to generate a **new immutable state object**.
3. Provider **persists** the new state to `localStorage` (`habits` key) and **re-renders** subscribed components.
4. On first run or if `localStorage` is cleared, `DEFAULT_HABITS` is used.

---

## 6  Styling System
* Tailwind class names co-exist with a small global base layer (`src/index.css`).
* Custom classes (`text-title-lg`, `text-color-title`, `.animate-shake`, etc.) are declared via Tailwind utilities or custom `@layer` rules.

---

## 7  Build, Test & Deploy
### Local development
```
npm install
npm run dev     # Vite dev server at http://localhost:5173
```
### Production build
```
npm run build   # Outputs to /dist, ready for GitHub Pages
```
### Testing
```
npm run test    # Vitest + jsdom + RTL
```
### Deployment options
1. **Manual** – `npm run deploy` pushes `dist` to `gh-pages` branch.
2. **CI** – Any push to `main` triggers the GitHub Actions workflow defined under `.github/workflows/…` (build + Pages deploy).

---

## 8  Extensibility Pointers
* Want **analytics**? Add a new hook that publishes events inside reducer actions.
* Need **cloud sync**? Replace the `localStorage` persistence in `HabitsProvider` with API calls; keep the same context API so components remain unchanged.
* Planning **multi-screen** navigation? Introduce `react-router` but keep context at the top level to retain global state.

---

## 9  Known Trade-offs / TODOs
* Accessibility of drag handles could be improved for keyboard users.
* Service worker currently hard-reloads on update; a toast-style ‘New version available’ UX would be nicer.
* `useLocalStorage` is redundant after context refactor – can be removed.
* Only 4 default habits; adding a dynamic habit catalog would require CRUD UI.

---

## 10  Quick Start for New Contributors
1. **Clone** the repo and install dependencies.
2. Skim this doc plus `src/context/HabitsContext.jsx` – that’s the heart of the state.
3. Use **Vitest watch mode** while developing: `npm run test -- --watch`.
4. Submit PRs against `main`; GitHub Actions will run lint + test + type-check.

Happy hacking! 🚀
