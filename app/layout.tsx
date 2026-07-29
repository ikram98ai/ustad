import "@radix-ui/themes/styles.css";
import "./theme-config.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import NavBtm from "./NavBtm";
import Logo from "./components/Logo";
import { Container, Theme } from "@radix-ui/themes";
import AuthProvider from "./auth/Provider";
import QueryClientProvider from "./QueryClientProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Ustad", template: "%s | Ustad" },
  description:
    "Ustad connects you with skilled local pros — browse gigs, chat with ustads, and track your orders.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider>
          <AuthProvider>
            <Theme accentColor="gray" grayColor="slate" radius="large">
              <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
                <Container>
                  <div className="flex h-14 items-center justify-between px-4">
                    <Link href="/" className="flex w-fit items-center gap-2">
                      <Logo size={32} />
                      <span className="text-xl font-bold tracking-tight text-brand">
                        Ustad
                      </span>
                    </Link>
                    <Link
                      href="/gigs/new"
                      className="hidden rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-soft sm:inline-flex"
                    >
                      Become an Ustad
                    </Link>
                  </div>
                </Container>
              </header>
              <main className="px-4 pt-4 pb-24">
                <Container>{children}</Container>
              </main>
              <Suspense>
                <NavBtm />
              </Suspense>
              <Toaster position="top-center" />
            </Theme>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
