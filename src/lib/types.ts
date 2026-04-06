export interface PlannerEvent {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  category: "work" | "personal" | "health" | "other";
  description?: string;
}

export type EventAction =
  | { type: "ADD_EVENT"; payload: PlannerEvent }
  | { type: "DELETE_EVENT"; payload: { id: string } };
