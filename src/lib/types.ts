// Priority-based task (no fixed time)
export interface Task {
  id: string;
  type: "task";
  title: string;
  priority: "P0" | "P1" | "P2";
  category: "work" | "personal" | "health" | "other";
  week: string; // "YYYY-MM-DD" Monday of the week this task belongs to
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
  location?: string;
  notes?: string;
}

export type PlannerItem = Task | ScheduleEvent;

export type TaskAction =
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Partial<Task> & { id: string } }
  | { type: "DELETE_TASK"; payload: { id: string } }
  | { type: "COPY_TASKS_FROM_WEEK"; payload: { fromWeek: string; toWeek: string } };

export type EventAction =
  | { type: "ADD_EVENT"; payload: ScheduleEvent }
  | { type: "UPDATE_EVENT"; payload: Partial<ScheduleEvent> & { id: string } }
  | { type: "DELETE_EVENT"; payload: { id: string } };

export type PlannerAction = TaskAction | EventAction;
