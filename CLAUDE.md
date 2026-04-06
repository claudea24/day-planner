# Day Planner

A weekly planning tool that combines **prioritized tasks** and **scheduled events** into one view. Plan what matters, schedule what's fixed, and see your full day at a glance.

**GitHub**: https://github.com/claudea24/day-planner

## Project Requirements

- [ ] At least 4 distinct pages / routes — `/`, `/day/[date]`, `/add`, `/week`
- [ ] A form that adds data — `/add` with tabbed form (Task or Event), client-side state in memory
- [ ] A dynamic route — `/day/[date]` for per-day views
- [ ] A shared layout with navigation — persistent top Navbar with links to all pages, active route highlighting
- [ ] Styled with Tailwind — polished, presentable UI
- [ ] A CLAUDE.md that describes project, pages, and data model — this file
- [ ] Playwright MCP configured — e2e tests verifying at least one interaction
- [ ] Deployed to Vercel with a live URL — *(URL TBD after deployment)*
- [ ] Code pushed to a public GitHub repo — https://github.com/claudea24/day-planner
- [ ] Multiple git commits showing iteration process

## Core Concept

There are two types of items:

### Tasks (priority-based)
Things you need to get done. No fixed time — you decide **what priority** and **which day**.
- **P0** — must complete this week
- **P1** — should complete if time allows
- **P2** — can push to next week

P0 tasks get assigned to specific days. P1/P2 stay in the backlog until promoted.

### Schedule Events (time-based)
Things that happen at a specific time — meetings, calls, appointments. Each has a **date**, **start/end time**, and optional **notes**. Notes can be summarized using AI.

### The Combined Day View
When you look at a specific day, you see **both** — your scheduled events as a timeline and your P0 tasks as a to-do list. This is your single source of truth for "what does my day look like?"

## Tech Stack

- **Next.js 15** (App Router) with TypeScript
- **Tailwind CSS** for styling
- **React Context + useReducer** for client-side state (in-memory)
- **Playwright** for end-to-end testing
- **Claude API** for AI-powered note summarization

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
npx playwright test  # run e2e tests
```

## Pages

| Route | Description |
|---|---|
| `/` | **Weekly Inbox** — all tasks grouped by priority (P0 / P1 / P2). Add tasks, cycle priorities, assign P0s to days. The main planning surface. |
| `/day/[date]` | **Day View** — combined view for a single day. Top section: scheduled events as a timeline. Bottom section: P0 tasks assigned to that day as a checklist. This is your "what does today look like?" page. |
| `/add` | **Add Item** — tabbed form to create either a Task (title, priority, category, optional day, description) or a Schedule Event (title, date, start/end time, category, notes). |
| `/week` | **Week Board** — Mon–Fri columns. Each column shows that day's scheduled events and P0 tasks together. Unassigned P0 tasks shown at top as needing placement. |

## Data Model

```typescript
// Priority-based task (no fixed time)
interface Task {
  id: string;
  type: "task";
  title: string;
  priority: "P0" | "P1" | "P2";
  category: "work" | "personal" | "health" | "other";
  assignedDate?: string;       // "YYYY-MM-DD" — set when placed on a day
  description?: string;
  completed: boolean;
}

// Time-based scheduled event
interface ScheduleEvent {
  id: string;
  type: "event";
  title: string;
  date: string;                // "YYYY-MM-DD"
  startTime: string;           // "HH:mm"
  endTime: string;             // "HH:mm"
  category: "work" | "personal" | "health" | "other";
  notes?: string;              // free-form notes
  notesSummary?: string;       // AI-generated summary of notes
}

// Union type used throughout the app
type PlannerItem = Task | ScheduleEvent;
```

### Actions
- `ADD_TASK` — create a new task
- `UPDATE_TASK` — change priority, assigned day, completion status, etc.
- `DELETE_TASK` — remove a task
- `ADD_EVENT` — create a new scheduled event
- `UPDATE_EVENT` — edit event details or update AI summary
- `DELETE_EVENT` — remove a scheduled event

State is managed via React Context + useReducer. Data lives in memory — refreshing resets to seed data.

## Key Interactions

- **Weekly Inbox** (`/`): click a priority badge to cycle P0 → P1 → P2. Assign P0 tasks to days via dropdown.
- **Day View** (`/day/[date]`): see scheduled events (timeline) + P0 tasks (checklist) together. Check off tasks as done. View/expand notes on events.
- **Week Board** (`/week`): see the full week at a glance with both events and tasks per day.
- **Add Item** (`/add`): tabbed form — "Task" tab for priority items, "Event" tab for scheduled items.
- **AI Summarize**: on any event with notes, click "Summarize" to generate a short AI summary via Claude API.

## Shared Layout

All pages share a root layout (`layout.tsx`) with:
- **Navbar** — sticky top bar with app name, links to Today / Week, and a "+ Add Item" button
- Active route is visually highlighted using `usePathname()`
- `PlannerProvider` wraps all pages so tasks and events are accessible everywhere
- Content area is centered (`max-w-4xl`) with consistent padding

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
├── context/          # PlannerContext provider (tasks + events)
└── lib/              # Types and utility functions
e2e/                  # Playwright end-to-end tests
```

## Security Rules

- Never read, display, or log the contents of `.env`, `.env.*`, or any file likely containing secrets.
- Never commit or stage `.env` files or secret-containing files.
