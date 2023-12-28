"use client";
import { Avatar } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const NavBtm = () => {
  const currentPath = usePathname();
  const { status, data: session } = useSession();
  const links = [
    { label: "Home", href: "/" },
    { label: "Orders", href: "/orders/list" },
    { label: "Profile", href: "/profile" },
  ];
  return (
    <nav className="btm-nav border-t">
      {links.map((link) => (
        <Link
          className={"" + (currentPath === link.href && "active")}
          key={link.href}
          href={link.href}
        >
          {link.href === "/profile" ? (
            <Avatar
              src={session?.user!.image!}
              fallback="?"
              size="2"
              radius="full"
              className="cursor-pointer"
              referrerPolicy="no-referrer"
            />
          ) : (
            link.label
          )}
        </Link>
      ))}
    </nav>
  );
};

export default NavBtm;
