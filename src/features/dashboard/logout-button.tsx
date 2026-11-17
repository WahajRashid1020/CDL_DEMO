"use client";

import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/use-session";

export function LogoutButton() {
  const router = useRouter();
  const logout = useLogout();
  return (
    <Button
      variant="outline"
      className="rounded-full"
      disabled={logout.isPending}
      onClick={() =>
        logout.mutate(undefined, {
          onSettled: () => {
            router.push("/");
            router.refresh();
          },
        })
      }
    >
      {logout.isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />} Log out
    </Button>
  );
}
