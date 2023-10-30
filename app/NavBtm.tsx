"use client";
import Link from "next/link";
import React, { useState } from "react";

const NavBtm = () => {
  const [active, setActive] = useState("");
  return (
    <nav className="btm-nav">
      <Link
        onClick={() => setActive("")}
        href="/"
        className={"" + (active === "" && "active")}
      >
        Explore
      </Link>
      <Link
        onClick={() => setActive("orders")}
        href="/orders"
        className={"" + (active === "orders" && "active")}
      >
        Orders
      </Link>
      <Link
        onClick={() => setActive("chats")}
        href="/chats"
        className={"" + (active === "chats" && "active")}
      >
        Chats
      </Link>
      <Link
        onClick={() => setActive("profile")}
        href="/profile"
        className={"" + (active === "profile" && "active")}
      >
        Profile
      </Link>
    </nav>
  );
};

export default NavBtm;
