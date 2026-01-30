"use client";

import React from "react";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/graphql";

/**
 * ApolloProvider wrapper to enable Apollo Client throughout the app
 * This provides caching, state management, and request deduplication
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
