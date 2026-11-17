import Link from "next/link";
import { footerNav, siteConfig } from "@/config/site";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-card/50">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="max-w-xs space-y-4">
          <Logo />
          <p className="text-sm text-muted-foreground">{siteConfig.description}</p>
          <div className="space-y-1 text-sm">
            <a href={`tel:${siteConfig.contact.phone}`} className="block hover:text-brand">
              {siteConfig.contact.phone}
            </a>
            <a href={`mailto:${siteConfig.contact.email}`} className="block hover:text-brand">
              {siteConfig.contact.email}
            </a>
          </div>
        </div>

        {footerNav.map((group) => (
          <div key={group.title}>
            <p className="text-sm font-semibold">{group.title}</p>
            <ul className="mt-3 space-y-2">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {siteConfig.name}, Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href={siteConfig.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-foreground">LinkedIn</a>
            <a href={siteConfig.links.facebook} target="_blank" rel="noreferrer" className="hover:text-foreground">Facebook</a>
            <a href={siteConfig.links.instagram} target="_blank" rel="noreferrer" className="hover:text-foreground">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
