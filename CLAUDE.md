# Day Planner

A clean, minimal day planner web app for scheduling and viewing events across days and weeks.

## Tech Stack

- **Next.js 15** (App Router) with TypeScript
- **Tailwind CSS** for styling
- **React Context + useReducer** for client-side state (in-memory)
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
| `/` | Dashboard showing today's events in a timeline |
| `/day/[date]` | Dynamic day view with prev/next navigation (e.g., `/day/2026-04-06`) |
| `/add` | Form to create a new event (accepts `?date=` query param) |
| `/week` | 7-column weekly overview grid |

## Data Model

```typescript
interface PlannerEvent {
  id: string;          // crypto.randomUUID()
  title: string;
  date: string;        // "YYYY-MM-DD"
  startTime: string;   // "HH:mm"
  endTime: string;     // "HH:mm"
  category: "work" | "personal" | "health" | "other";
  description?: string;
}
```

State is managed via `EventContext` (React Context + useReducer) with `ADD_EVENT` and `DELETE_EVENT` actions. Data lives in memory — refreshing the page resets to seed data.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
├── context/          # EventContext provider
└── lib/              # Types and utility functions
e2e/                  # Playwright end-to-end tests
```

## Security Rules

- Never read, display, or log the contents of `.env`, `.env.*`, or any file likely containing secrets.
- Never commit or stage `.env` files or secret-containing files.
