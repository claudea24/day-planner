"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useMemo,
} from "react";
import { Task, ScheduleEvent, PlannerAction } from "@/lib/types";
import { seedTasks, seedEvents } from "@/lib/utils";

interface PlannerState {
  tasks: Task[];
  events: ScheduleEvent[];
}

interface PlannerContextType extends PlannerState {
  dispatch: React.Dispatch<PlannerAction>;
}

const PlannerContext = createContext<PlannerContextType | null>(null);

function plannerReducer(
  state: PlannerState,
  action: PlannerAction
): PlannerState {
  switch (action.type) {
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload.id),
      };
    case "ADD_EVENT":
      return { ...state, events: [...state.events, action.payload] };
    case "UPDATE_EVENT":
      return {
        ...state,
        events: state.events.map((e) =>
          e.id === action.payload.id ? { ...e, ...action.payload } : e
        ),
      };
    case "DELETE_EVENT":
      return {
        ...state,
        events: state.events.filter((e) => e.id !== action.payload.id),
      };
    default:
      return state;
  }
}

const initialState: PlannerState = {
  tasks: seedTasks,
  events: seedEvents,
};

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(plannerReducer, initialState);

  const value = useMemo(
    () => ({ ...state, dispatch }),
    [state]
  );

  return (
    <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
  );
}

export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context)
    throw new Error("usePlanner must be used within PlannerProvider");
  return context;
}

export function useTasksByPriority() {
  const { tasks } = usePlanner();
  return useMemo(
    () => ({
      P0: tasks.filter((t) => t.priority === "P0"),
      P1: tasks.filter((t) => t.priority === "P1"),
      P2: tasks.filter((t) => t.priority === "P2"),
    }),
    [tasks]
  );
}

export function useTasksForDate(date: string) {
  const { tasks } = usePlanner();
  return useMemo(
    () => tasks.filter((t) => t.assignedDate === date && t.priority === "P0"),
    [tasks, date]
  );
}

export function useEventsForDate(date: string) {
  const { events } = usePlanner();
  return useMemo(
    () =>
      events
        .filter((e) => e.date === date)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [events, date]
  );
}
