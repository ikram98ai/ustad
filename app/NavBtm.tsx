'use client'
import Link from "next/link";
import React, { useState } from "react";

const NavBtm = () => {
  const [active, setActive] = useState("explore")
  return (
    <div className="btm-nav text-gray-950">
      <Link onClick={()=>setActive("orders")} href="/orders" className={"mr-5 "+(active==='orders' && "active") }>
        Orders
      </Link>
      <Link onClick={()=>setActive("explore")} href="/explore" className={"mr-5 "+(active==='explore' && "active") }>
        Explore
      </Link>
      <Link onClick={()=>setActive("chats")} href="/chats" className={"mr-5 "+(active==='chats' && "active") }>
        Chats
      </Link>
    </div>
  );
};

export default NavBtm;
