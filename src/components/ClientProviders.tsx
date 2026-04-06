"use client";

import { ReactNode } from "react";
import { EventProvider } from "@/context/EventContext";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <EventProvider>{children}</EventProvider>;
}
