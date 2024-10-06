"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

// Define a custom ThemeProviderProps that includes children as read-only
interface CustomThemeProviderProps extends Readonly<ThemeProviderProps> {
  readonly children: React.ReactNode; // Explicitly define the children prop as read-only
}

export function ThemeProvider({
  children,
  ...props
}: CustomThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
