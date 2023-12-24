import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { ThemeProviderWrapper } from "./components/providers/theme-provider-wrapper";
import "./globals.css";
import { cn } from "./lib/utils";

const fontSans = FontSans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Murdr Club",
  description: "A party game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProviderWrapper
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main>{children}</main>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
