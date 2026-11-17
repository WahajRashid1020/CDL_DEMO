"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { cn } from "cn";
import { mainNav } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";
import { useSession } from "@/features/auth/use-session";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSession();
  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled ? "border-b bg-background/75 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {mainNav.map((group) => (
            <li key={group.title} className="group relative">
              <button className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {group.title}
                <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
              </button>
              <div className="invisible absolute left-1/2 top-full w-80 -translate-x-1/2 translate-y-2 pt-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                <div className="rounded-xl border bg-popover p-2 shadow-xl">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-accent"
                    >
                      <span className="text-sm font-semibold">{item.title}</span>
                      {item.description && (
                        <span className="mt-0.5 block text-xs text-muted-foreground">{item.description}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <UserMenu className="mx-1" loginClassName="hidden sm:inline-flex" />
          <Link
            href="/quote"
            className={cn(buttonVariants({ size: "lg" }), "rounded-full px-4 shadow-lg shadow-brand/25")}
          >
            Get a quote
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "lg:hidden")}
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto p-6">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Logo />
              <div className="mt-8 space-y-6">
                {mainNav.map((group) => (
                  <div key={group.title}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.title}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <Link href={item.href} onClick={closeMobile} className="block rounded-md py-1.5 font-medium hover:text-brand">
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Link
                  href={user ? "/dashboard" : "/login"}
                  onClick={closeMobile}
                  className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                >
                  {user ? "Dashboard" : "Log in"}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
