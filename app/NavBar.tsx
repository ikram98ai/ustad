import Link from "next/link";
import React from "react";

function NavBar() {
  return (
    <nav className="flex justify-around bg-slate-600 p-3">
      <Link href="/" className="mr-5">
        Ustad
      </Link>
      <Link href="/profile">Profile</Link>
    </nav>
  );
}

export default NavBar;
