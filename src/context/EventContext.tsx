"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useMemo,
} from "react";
import { PlannerEvent, EventAction } from "@/lib/types";
import { seedEvents } from "@/lib/utils";

interface EventContextType {
  events: PlannerEvent[];
  dispatch: React.Dispatch<EventAction>;
}

const EventContext = createContext<EventContextType | null>(null);

function eventReducer(
  state: PlannerEvent[],
  action: EventAction
): PlannerEvent[] {
  switch (action.type) {
    case "ADD_EVENT":
      return [...state, action.payload];
    case "DELETE_EVENT":
      return state.filter((e) => e.id !== action.payload.id);
    default:
      return state;
  }
}

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, dispatch] = useReducer(eventReducer, seedEvents);

  const value = useMemo(() => ({ events, dispatch }), [events]);

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) throw new Error("useEvents must be used within EventProvider");
  return context;
}

export function useEventsForDate(date: string) {
  const { events } = useEvents();
  return useMemo(
    () =>
      events
        .filter((e) => e.date === date)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [events, date]
  );
}
