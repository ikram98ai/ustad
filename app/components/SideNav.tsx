"use client";
import { Tooltip } from "@radix-ui/themes";
import cn from "classnames";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { themeStore } from "@/app/lib/theme";
import {
  FaAnglesLeft,
  FaAnglesRight,
  FaArrowRightFromBracket,
  FaArrowRightToBracket,
  FaCircleHalfStroke,
  FaClipboardList,
  FaCommentDots,
  FaCompass,
  FaUser,
} from "react-icons/fa6";
import Logo from "./Logo";
import NotificationBadge from "./NotificationBadge";

const SideNav = () => {
  const currentPath = usePathname();
  const { data: session } = useSession();
  const [expanded, setExpanded] = useState(false);
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.get,
    themeStore.getServer
  );

  const toggle = () => setExpanded((prev) => !prev);

  const links = [
    {
      label: "Explore",
      href: "/",
      root: "/",
      icon: <FaCompass size={18} />,
    },
    {
      label: "Orders",
      href: "/orders/list",
      root: "/orders",
      icon: <FaClipboardList size={18} />,
    },
    {
      label: "Chats",
      href: "/chats",
      root: "/chats",
      icon: <FaCommentDots size={18} />,
    },
    {
      label: "Alerts",
      href: "/notifications",
      root: "/notifications",
      icon: <NotificationBadge />,
    },
    {
      label: "Profile",
      href: "/profile",
      root: "/profile",
      icon: <FaUser size={17} />,
    },
  ];

  return (
    <aside
      className={cn(
        "sticky top-0 z-40 hidden h-dvh shrink-0 flex-col border-r border-gray-200 bg-white transition-[width] duration-200 lg:flex",
        expanded ? "w-60" : "w-17"
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center gap-2",
          expanded ? "px-4" : "justify-center"
        )}
      >
        {/* The logo doubles as the sidebar toggle: hovering swaps it for a
            collapse/expand hint, like most modern desktop apps. */}
        <Tooltip
          content={expanded ? "Collapse sidebar" : "Expand sidebar"}
          side="right"
        >
          <button
            type="button"
            onClick={toggle}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            className="group relative grid h-10 w-10 shrink-0 place-items-center rounded-xl transition hover:bg-gray-100"
          >
            <span className="transition-opacity duration-150 group-hover:opacity-0">
              <Logo size={28} />
            </span>
            <span className="absolute inset-0 grid place-items-center text-gray-600 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              {expanded ? (
                <FaAnglesLeft size={15} />
              ) : (
                <FaAnglesRight size={15} />
              )}
            </span>
          </button>
        </Tooltip>
        {expanded && (
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-brand"
          >
            Ustad
          </Link>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
        {links.map((link) => {
          const isActive =
            link.root === "/"
              ? currentPath === "/"
              : currentPath.startsWith(link.root);
          return (
            <Link
              key={link.href}
              href={link.href}
              title={link.label}
              className={cn(
                "flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition",
                expanded ? "px-3" : "justify-center",
                isActive
                  ? "bg-ink text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-ink"
              )}
            >
              <span className="grid w-5 shrink-0 place-items-center">
                {link.icon}
              </span>
              {expanded && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-1 border-t border-gray-100 px-3 py-3">
        <button
          type="button"
          onClick={themeStore.toggle}
          title={theme === "dark" ? "Light mode" : "Dark mode"}
          className={cn(
            "flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-ink",
            expanded ? "px-3" : "justify-center"
          )}
        >
          <span className="grid w-5 shrink-0 place-items-center">
            <FaCircleHalfStroke size={16} />
          </span>
          {expanded && (
            <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          )}
        </button>

        {session ? (
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            title="Log out"
            className={cn(
              "flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10",
              expanded ? "px-3" : "justify-center"
            )}
          >
            <span className="grid w-5 shrink-0 place-items-center">
              <FaArrowRightFromBracket size={16} />
            </span>
            {expanded && <span>Log out</span>}
          </button>
        ) : (
          <Link
            href="/auth/signin"
            title="Sign in"
            className={cn(
              "flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-ink",
              expanded ? "px-3" : "justify-center"
            )}
          >
            <span className="grid w-5 shrink-0 place-items-center">
              <FaArrowRightToBracket size={16} />
            </span>
            {expanded && <span>Sign in</span>}
          </Link>
        )}
      </div>
    </aside>
  );
};

export default SideNav;
