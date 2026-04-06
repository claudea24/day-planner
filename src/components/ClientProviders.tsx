"use client";

import { ReactNode } from "react";
import { PlannerProvider } from "@/context/PlannerContext";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <PlannerProvider>{children}</PlannerProvider>;
}
