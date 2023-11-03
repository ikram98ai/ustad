"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBtm = () => {
  const currentPath = usePathname();
  return (
    <nav className="btm-nav border-t">
      <Link href="/" className={"" +( (currentPath === "/" || currentPath.startsWith('/gigs')) && "active")}>
        Gigs
      </Link>
      <Link
        href="/orders"
        className={"" + (currentPath.startsWith("/orders") && "active")}
      >
        Orders
      </Link>
      <Link
        href="/chats"
        className={"" + (currentPath.startsWith("/chats") && "active")}
      >
        Chats
      </Link>
      <Link
        href="/profile"
        className={"" + (currentPath.startsWith("/profile") && "active")}
      >
        Profile
      </Link>
    </nav>
  );
};

export default NavBtm;
