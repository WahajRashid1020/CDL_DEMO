import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone, Truck } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/features/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Questions, partnerships or a tricky lane — contact the CDL1000 team in Chicago.",
};

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.contact.address)}`;

export default function ContactPage() {
  const { phone, email, address } = siteConfig.contact;
  const items = [
    { icon: Phone, label: "Phone", value: phone, href: `tel:${phone.replace(/\D/g, "")}` },
    { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    { icon: MapPin, label: "Office", value: address, href: mapsUrl },
    { icon: Clock, label: "Customer success", value: "24/7, every day of the year" },
  ];

  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk freight" description="Questions, partnerships or a tricky lane — we'd love to hear from you. We usually reply within one business day." />
      <section className="container-page grid gap-8 py-14 lg:grid-cols-[1fr_22rem]">
        <ContactForm />
        <aside className="space-y-4">
          {items.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex gap-4 rounded-2xl border bg-card p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
                {href ? (
                  <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="mt-0.5 block font-medium hover:text-brand">
                    {value}
                  </a>
                ) : (
                  <p className="mt-0.5 font-medium">{value}</p>
                )}
              </div>
            </div>
          ))}
          <Link href="/quote" className="flex items-center gap-3 rounded-2xl bg-ink p-5 text-white transition-transform hover:-translate-y-0.5 dark:bg-card">
            <Truck className="size-5 text-highlight" />
            <span className="text-sm">
              <span className="font-semibold">Need a price?</span> Get an instant quote — no call needed.
            </span>
          </Link>
        </aside>
      </section>
    </>
  );
}
