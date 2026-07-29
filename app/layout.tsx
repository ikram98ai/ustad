import "@radix-ui/themes/styles.css";
import "./theme-config.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import NavBtm from "./NavBtm";
import Logo from "./components/Logo";
import MobileSettingsMenu from "./components/MobileSettingsMenu";
import SideNav from "./components/SideNav";
import { Theme } from "@radix-ui/themes";
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
  // Applies the stored (or system) theme before first paint to avoid a flash.
  const themeInit = `try{var t=localStorage.getItem("ustad-theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className={inter.className}>
        <QueryClientProvider>
          <AuthProvider>
            <Theme accentColor="gray" grayColor="slate" radius="large">
              <div className="flex h-dvh">
                <Suspense>
                  <SideNav />
                </Suspense>
                <div className="flex min-w-0 flex-1 flex-col">
                  <header className="z-40 shrink-0 border-b border-gray-200 bg-white lg:hidden">
                    <div className="flex h-14 items-center justify-between px-4">
                      <Link href="/" className="flex w-fit items-center gap-2">
                        <Logo size={32} />
                        <span className="text-xl font-bold tracking-tight text-brand">
                          Ustad
                        </span>
                      </Link>
                      <div className="flex items-center gap-1.5">
                        <Link
                          href="/gigs/new"
                          className="hidden rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-soft sm:inline-flex"
                        >
                          Become an Ustad
                        </Link>
                        <MobileSettingsMenu />
                      </div>
                    </div>
                  </header>
                  <main className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-24 lg:px-6 lg:pb-6">
                    {children}
                  </main>
                </div>
              </div>
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
