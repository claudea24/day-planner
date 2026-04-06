// Priority-based task (no fixed time)
export interface Task {
  id: string;
  type: "task";
  title: string;
  priority: "P0" | "P1" | "P2";
  category: "work" | "personal" | "health" | "other";
  assignedDate?: string; // "YYYY-MM-DD" — set when placed on a day
  description?: string;
  completed: boolean;
}

// Time-based scheduled event
export interface ScheduleEvent {
  id: string;
  type: "event";
  title: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  category: "work" | "personal" | "health" | "other";
  notes?: string;
  notesSummary?: string; // AI-generated summary
}

export type PlannerItem = Task | ScheduleEvent;

export type TaskAction =
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Partial<Task> & { id: string } }
  | { type: "DELETE_TASK"; payload: { id: string } };

export type EventAction =
  | { type: "ADD_EVENT"; payload: ScheduleEvent }
  | { type: "UPDATE_EVENT"; payload: Partial<ScheduleEvent> & { id: string } }
  | { type: "DELETE_EVENT"; payload: { id: string } };

export type PlannerAction = TaskAction | EventAction;
