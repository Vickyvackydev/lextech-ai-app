"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, Store } from "@/states/store";
import { queryClient } from "@/config";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PersistGate persistor={persistor}>
      <Provider store={Store}>
        <QueryClientProvider client={queryClient}>
          {/* <SessionProvider></SessionProvider> */}
          {children}
        </QueryClientProvider>
      </Provider>
    </PersistGate>
  );
}
