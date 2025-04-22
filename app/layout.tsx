import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Metadata } from "next";
import NextQueryProvider from "@/lib/tanstack-query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notes App",
  description: "A simple notes app with authentication and CRUD operations",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} gradient-bg min-h-screen`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <NextQueryProvider>
              {children}
              <Toaster />
              <ReactQueryDevtools initialIsOpen={false} />
            </NextQueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
