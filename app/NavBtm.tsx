"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBtm = () => {
  const pathname = usePathname();
  console.log(pathname)
  return (
    <nav className="btm-nav">
      <Link href="/" className={"" +( (pathname === "/" || pathname.startsWith('/gigs')) && "active")}>
        Gigs
      </Link>
      <Link
        href="/orders"
        className={"" + (pathname.startsWith("/orders") && "active")}
      >
        Orders
      </Link>
      <Link
        href="/chats"
        className={"" + (pathname.startsWith("/chats") && "active")}
      >
        Chats
      </Link>
      <Link
        href="/profile"
        className={"" + (pathname.startsWith("/profile") && "active")}
      >
        Profile
      </Link>
    </nav>
  );
};

export default NavBtm;
