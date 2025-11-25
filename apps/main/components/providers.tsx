"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SubscriptionProvider } from "./subscription-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <SubscriptionProvider>
        {children}
      </SubscriptionProvider>
    </NextThemesProvider>
  )
}
