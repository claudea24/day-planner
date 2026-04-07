# Day Planner

A weekly planning tool that combines **prioritized tasks** and **scheduled events** into one view — like a mashup of Notion's task lists and Google Calendar's time grid.

**GitHub**: https://github.com/claudea24/day-planner

## Core Concept

There are two types of items:

### Tasks (priority-based, per-week)
Things you need to get done. No fixed time — you decide **what priority** and **which day**.
- **P0** — must complete this week
- **P1** — should complete if time allows
- **P2** — can push to next week

Tasks belong to a specific week. All priorities can be assigned to specific days. Tasks can be dragged between priority sections. Incomplete tasks from a previous week can be copied to the current week.

### Schedule Events (time-based)
Things that happen at a specific time — meetings, calls, appointments. Each has a **date**, **start/end time**, optional **location**, and optional **notes**.

### The Combined Views
- **Day View**: full-screen Google Calendar-style hourly grid with tasks pinned at the top
- **Week View**: full-screen 7-column (Mon–Sun) hourly grid with tasks under day headers
- **Todo List**: Notion-style per-week task list grouped by P0/P1/P2

## Tech Stack

- **Next.js 15** (App Router) with TypeScript
- **Tailwind CSS** for styling
- **React Context + useReducer** for client-side state (in-memory)
- **HTML5 Drag and Drop** for task reordering between priorities
- **Playwright** for end-to-end testing

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
npx playwright test  # run e2e tests
```

## Pages

| Route | Description |
|---|---|
| `/` | **Todo List** — per-week task list grouped by priority (P0/P1/P2). Notion-style inline add/edit. Drag tasks between sections. Navigate between weeks. Copy tasks from previous week. |
| `/day/[date]` | **Day View** — full-screen Google Calendar-style hourly grid (6AM–10PM). Tasks shown as a strip at the top with checkboxes. Click empty time slot to create event. Click event to expand and edit title, time, location, notes inline. Prev/next day + Today button. |
| `/add` | **Add Item** — tabbed form to create either a Task (title, priority, category, optional day, description) or a Schedule Event (title, date, start/end time, location, category, notes). |
| `/week` | **Week View** — full-screen 7-column (Mon–Sun) Google Calendar-style hourly grid. Tasks with checkboxes under day headers. Click empty slot to create event. Click event to expand and edit inline. Prev/next week + Today button. Unassigned P0 banner. |

## Data Model

```typescript
// Priority-based task (no fixed time, belongs to a week)
interface Task {
  id: string;
  type: "task";
  title: string;
  priority: "P0" | "P1" | "P2";
  category: "work" | "personal" | "health" | "other";
  week: string;              // "YYYY-MM-DD" Monday of the week
  assignedDate?: string;     // "YYYY-MM-DD" — set when placed on a day
  description?: string;
  completed: boolean;
}

// Time-based scheduled event
interface ScheduleEvent {
  id: string;
  type: "event";
  title: string;
  date: string;              // "YYYY-MM-DD"
  startTime: string;         // "HH:mm"
  endTime: string;           // "HH:mm"
  category: "work" | "personal" | "health" | "other";
  location?: string;
  notes?: string;
}

type PlannerItem = Task | ScheduleEvent;
```

### Actions
- `ADD_TASK` — create a new task
- `UPDATE_TASK` — change priority, assigned day, completion status, title, etc.
- `DELETE_TASK` — remove a task
- `COPY_TASKS_FROM_WEEK` — copy incomplete tasks from one week to another
- `ADD_EVENT` — create a new scheduled event
- `UPDATE_EVENT` — edit event title, time, location, or notes
- `DELETE_EVENT` — remove a scheduled event

State is managed via React Context + useReducer. Data lives in memory — refreshing resets to seed data.

## Key Interactions

### Todo List (`/`)
- **Inline add**: type in the "Add a task..." row and press Enter — creates the task and keeps focus for the next one
- **Inline edit**: click a task title to edit it in place
- **Priority cycling**: click the P0/P1/P2 badge to cycle priority
- **Drag and drop**: drag tasks between P0/P1/P2 sections
- **Day assignment**: dropdown to assign any task to a day of its week
- **Per-week navigation**: prev/next week arrows + "This Week" button
- **Copy from last week**: when a week is empty, copy incomplete tasks from the previous week

### Day View (`/day/[date]`)
- **Click empty time slot** to create a new event at that time (snaps to 15-min intervals)
- **Click event to expand** — edit title, time, location, notes inline; expanded event pops to front (z-index 50)
- **Close (X)** collapses the expanded view; **Delete (trash icon)** removes the event — visually distinct to prevent accidental deletion
- **Task checkboxes** at the top to mark tasks complete
- **Back-to-back events** don't overlap — 2px gap between consecutive events
- **Prev/next day** navigation + Today button

### Week View (`/week`)
- **Click empty time slot** in any day column to create a new event (auto-expands for editing)
- **Click event to expand** — edit inline with close (X) / delete (trash) buttons
- **Task checkboxes** under each day header with priority badges
- **CSS grid layout** — header and body columns stay perfectly aligned at any window size
- **Prev/next week** navigation + Today button
- **Unassigned P0 banner** when tasks need day placement

### Add Item (`/add`)
- **Two tabs**: Task and Event
- Task form: title, priority selector (P0/P1/P2), category, optional day, description
- Event form: title, date, start/end time, location, category, notes

## Shared Layout

All pages share a root layout (`layout.tsx`) with:
- **Navbar** — sticky top bar with app name, navigation links (Todo List / Day / Week), and a "+ Add Item" button
- Active route is visually highlighted using `usePathname()`
- `PlannerProvider` wraps all pages so tasks and events are accessible everywhere
- Calendar views (Day, Week) are full-screen; Todo List and Add Item are centered with max-width
- Date-dependent pages use `ClientOnly` wrapper to prevent hydration mismatches
- Base font size is 20px for readability; all sizes use rem units to scale proportionally

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with Navbar + PlannerProvider
│   ├── page.tsx                # Todo List (per-week task management)
│   ├── day/[date]/page.tsx     # Day View (hourly calendar)
│   ├── add/page.tsx            # Add Item (tabbed form)
│   ├── week/page.tsx           # Week View (weekly calendar)
├── components/
│   ├── Navbar.tsx              # Top navigation bar
│   ├── ClientOnly.tsx          # Prevents SSR for date-dependent pages
│   ├── ClientProviders.tsx     # Client-side context wrapper
│   ├── PrioritySection.tsx     # P0/P1/P2 section with drag-drop
│   ├── TaskCard.tsx            # Inline editable task row
│   ├── DayTaskList.tsx         # Compact task checklist for calendar views
│   ├── EventBlock.tsx          # Expandable event with inline editing
│   ├── HourGrid.tsx            # Hourly time grid for day view
│   ├── WeekCalendar.tsx        # Full weekly calendar grid
│   ├── TaskForm.tsx            # Task creation form
│   └── EventForm.tsx           # Event creation form
├── context/
│   └── PlannerContext.tsx       # State management (tasks + events)
└── lib/
    ├── types.ts                # TypeScript interfaces and action types
    └── utils.ts                # Date helpers, formatters, seed data
e2e/
└── add-event.spec.ts           # Playwright e2e tests (5 tests)
```

## Style & Design Preferences

- **Google Calendar-style** for day and week views — full-screen hourly grid, events positioned by time, click empty slot to create
- **Notion-style** for todo list — inline add/edit, type and press Enter to keep adding, drag between sections
- **Larger fonts** — base font size 20px, all sizes use rem so they scale together. No fixed px font sizes
- **Events pop to front** when expanded (z-index 50) so they're always editable, never hidden behind other events
- **Back-to-back events** must not visually overlap — use gap/offset between consecutive events
- **Close (X) vs Delete (trash)** — always visually distinct icons so users don't accidentally delete when trying to close
- **No duplicate buttons** — only one "+ Add Item" in the navbar, not repeated on page toolbars
- **Week always starts Monday** (Mon–Sun), regardless of what day it is today
- **Calendar columns must stay aligned** — use CSS grid with shared `grid-template-columns` for header and body
- **No AI features** unless user has their own API key configured — removed AI polish to keep the app self-contained
- **Scrollable time grids** — both day and week views scroll vertically within the viewport, sticky day headers
- **Per-week todo lists** — tasks belong to a specific week, can navigate between weeks, can copy incomplete tasks from previous week
- **All task priorities assignable to days** — not just P0, any priority can be placed on a specific day
- **Single click to expand/collapse** events — no double-click issues, parent controls expand state when needed
- **Tasks editable everywhere** — checkboxes on weekly and daily views, inline edit on todo list

## Security Rules

- Never read, display, or log the contents of `.env`, `.env.*`, or any file likely containing secrets.
- Never commit or stage `.env` files or secret-containing files.
