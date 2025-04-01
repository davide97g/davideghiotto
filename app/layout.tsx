import "@/app/globals.css";
import type { Metadata } from "next";
import type React from "react";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Davide Ghiotto | Web Developer",
  description:
    "Personal portfolio website of Davide Ghiotto, a web developer specializing in modern web technologies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors closeButton position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
