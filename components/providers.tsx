"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { RealtimeProvider } from "@upstash/realtime/client";

export const Providers = ({children}: {children: React.ReactNode}) => {
  const [queryStack] = useState(() => new QueryClient());

  return <RealtimeProvider><QueryClientProvider client={queryStack}>{children}</QueryClientProvider></RealtimeProvider>;
};
