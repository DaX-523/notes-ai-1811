"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from "react";

const NextQueryProvider = ({ children }: { children: React.ReactNode }) => {
  // Create a new QueryClient instance for each session
  // This prevents sharing state between requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Don't retry on error by default
            retry: false,
            // Disable refetching on window focus by default
            refetchOnWindowFocus: false,
            // Ensure data is properly serialized
            structuralSharing: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default NextQueryProvider;
