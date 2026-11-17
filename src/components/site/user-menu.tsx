"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Truck } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { displayName, initials, useLogout, useSession } from "@/features/auth/use-session";

/** "Log in" for visitors, an avatar menu for signed-in users. */
export function UserMenu({ className, loginClassName }: { className?: string; loginClassName?: string }) {
  const { user, loading } = useSession();
  const logout = useLogout();
  const router = useRouter();

  if (loading) return <span className={cn("size-8 animate-pulse rounded-full bg-muted", loginClassName)} />;

  if (!user) {
    return (
      <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }), loginClassName)}>
        Log in
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className={cn(
          "grid size-8 place-items-center rounded-full bg-ink text-xs font-bold text-white ring-2 ring-brand/40 transition hover:ring-brand dark:bg-brand",
          className,
        )}
      >
        {initials(user)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">
            <span className="block text-sm font-semibold text-foreground">{displayName(user)}</span>
            {user.email && <span className="block truncate">{user.email}</span>}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <LayoutDashboard /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/quote")}>
          <Truck /> New quote
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() =>
            logout.mutate(undefined, {
              onSettled: () => {
                router.push("/");
                router.refresh();
              },
            })
          }
        >
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
