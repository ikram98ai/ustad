"use client";

import { themeStore } from "@/app/lib/theme";
import { DropdownMenu } from "@radix-ui/themes";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  FaArrowRightFromBracket,
  FaArrowRightToBracket,
  FaCircleHalfStroke,
  FaGear,
} from "react-icons/fa6";

const MobileSettingsMenu = () => {
  const { data: session } = useSession();
  const theme = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.get,
    themeStore.getServer
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button
          type="button"
          aria-label="Settings"
          className="grid h-10 w-10 place-items-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-ink"
        >
          <FaGear size={17} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item onSelect={themeStore.toggle}>
          <FaCircleHalfStroke size={14} />
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        {session ? (
          <DropdownMenu.Item
            color="red"
            onSelect={() => signOut({ callbackUrl: "/" })}
          >
            <FaArrowRightFromBracket size={14} />
            Log out
          </DropdownMenu.Item>
        ) : (
          <DropdownMenu.Item asChild>
            <Link href="/auth/signin">
              <FaArrowRightToBracket size={14} />
              Sign in
            </Link>
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default MobileSettingsMenu;
