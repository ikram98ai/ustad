"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBtm = () => {
  const pathname = usePathname();
  return (
    <nav className="btm-nav">
      <Link href="/" className={"" + (pathname === "/" && "active")}>
        Gigs
      </Link>
      <Link
        href="/orders"
        className={"" + (pathname === "/orders" && "active")}
      >
        Orders
      </Link>
      <Link href="/chats" className={"" + (pathname === "/chats" && "active")}>
        Chats
      </Link>
      <Link
        href="/profile"
        className={"" + (pathname === "/profile" && "active")}
      >
        Profile
      </Link>
    </nav>
  );
};

export default NavBtm;
