"use client";

import { ThemeProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { useEffect, useState } from "react";

export function ThemeProviderWrapper({
  children,
  ...props
}: ThemeProviderProps) {
  // return <NextThemesProvider {...props}>{children}</NextThemesProvider>;

  // See: https://github.com/vercel/next.js/discussions/22388#discussioncomment-6609801
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient ? <ThemeProvider {...props}>{children}</ThemeProvider> : <></>}
    </>
  );
}
