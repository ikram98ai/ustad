export type Theme = "light" | "dark";

// The `dark` class on <html> is the source of truth; it is set before
// hydration by the inline script in app/layout.tsx. This store lets React
// components read and toggle it via useSyncExternalStore.
const listeners = new Set<() => void>();

export const themeStore = {
  subscribe(callback: () => void) {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  },
  get(): Theme {
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  },
  getServer(): Theme {
    return "light";
  },
  toggle() {
    const next: Theme = themeStore.get() === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("ustad-theme", next);
    listeners.forEach((listener) => listener());
  },
};
