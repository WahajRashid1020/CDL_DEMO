import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Container, Headset, Truck } from "lucide-react";
import { getSession, type SessionUser } from "@/lib/auth/session";
import { siteConfig } from "@/config/site";
import { LogoutButton } from "@/features/dashboard/logout-button";
import { RecentQuotes } from "@/features/dashboard/recent-quotes";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}

/** Only these profile fields are shown — the login payload may carry tokens we never render. */
const PROFILE: [key: string, label: string][] = [
  ["email", "Email"],
  ["phone", "Phone"],
  ["phone_number", "Phone"],
  ["company_name", "Company"],
  ["mc_Number", "MC number"],
  ["us_Dot_No", "US DOT"],
];

function nameOf(u: SessionUser) {
  return [u.first_name, u.last_name].filter(Boolean).join(" ") || u.name || u.email || "there";
}

async function Dashboard() {
  const user = await getSession();
  if (!user) redirect("/login?next=/dashboard");

  const profile = PROFILE.filter(([k]) => typeof user[k] === "string" || typeof user[k] === "number").map(
    ([k, label]) => [label, String(user[k])] as const,
  );

  return (
    <section className="container-page py-10 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">Dashboard</p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Welcome back, {nameOf(user).split(" ")[0]}</h1>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <RecentQuotes />

        <aside className="space-y-6">
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="font-heading text-base font-bold">Quick actions</h2>
            <div className="mt-4 grid gap-2">
              <Action href="/quote#truckload" icon={Truck} title="New truckload quote" />
              <Action href="/quote#drayage" icon={Container} title="New drayage quote" />
              <Action href="/contact" icon={Headset} title="Talk to our team" />
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <h2 className="font-heading text-base font-bold">Account</h2>
            <p className="mt-1 font-medium">{nameOf(user)}</p>
            <dl className="mt-4 space-y-2 text-sm">
              {profile.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="truncate font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              Need to update your details? Email{" "}
              <a href={`mailto:${siteConfig.contact.email}`} className="text-brand hover:underline">
                {siteConfig.contact.email}
              </a>
              .
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Action({ href, icon: Icon, title }: { href: string; icon: typeof Truck; title: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors hover:border-brand/50 hover:bg-accent">
      <Icon className="size-4 text-brand" /> {title}
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <section className="container-page py-14">
      <div className="h-10 w-72 animate-pulse rounded-lg bg-muted" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="h-96 animate-pulse rounded-2xl bg-muted" />
        <div className="h-96 animate-pulse rounded-2xl bg-muted" />
      </div>
    </section>
  );
}
