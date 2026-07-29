"use client";
import { Avatar } from "@radix-ui/themes";
import cn from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaClipboardList, FaCommentDots, FaCompass } from "react-icons/fa6";
import NotificationBadge from "./components/NotificationBadge";

const NavBtm = () => {
  const currentPath = usePathname();
  const { data: session } = useSession();

  const links = [
    {
      label: "Explore",
      href: "/",
      root: "/",
      icon: <FaCompass size={19} />,
    },
    {
      label: "Orders",
      href: "/orders/list",
      root: "/orders",
      icon: <FaClipboardList size={19} />,
    },
    {
      label: "Chats",
      href: "/chats",
      root: "/chats",
      icon: <FaCommentDots size={19} />,
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
      icon: (
        <Avatar
          src={session?.user?.image ?? undefined}
          fallback="?"
          size="1"
          radius="full"
          referrerPolicy="no-referrer"
        />
      ),
    },
  ];

  return (
    <nav className="dock z-40 border-t border-gray-200 bg-white/95 backdrop-blur">
      {links.map((link) => {
        const isActive =
          link.root === "/"
            ? currentPath === "/"
            : currentPath.startsWith(link.root);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(isActive && "dock-active")}
          >
            {link.icon}
            <span className="dock-label">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default NavBtm;
