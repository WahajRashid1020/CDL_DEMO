/** Placeholder copy for routes not built yet. Taken from the current cdl1000.com headings. */
export const pages = {
  shippers: {
    eyebrow: "For shippers",
    title: "Move freight without the phone tag",
    description: "Instant quotes, live tracking and simple payment for every load you book.",
    next: ["Lifting the load: why shippers switch", "Live load tracking", "Service catalogue"],
  },
  carriers: {
    eyebrow: "For carriers",
    title: "The power is in your hands",
    description: "Find loads that fit your lanes and get paid fast — hassle-free payments, with crypto on the way.",
    next: ["Hassle-free fast payments", "Crypto payments (coming soon)", "Carrier sign-up"],
  },
  truckload: {
    eyebrow: "Services",
    title: "Truckload, priced in seconds",
    description: "Dry van, reefer and flatbed capacity with transparent, instant pricing.",
    next: ["Service details", "Equipment types", "Instant truckload quote"],
  },
  drayage: {
    eyebrow: "Services",
    title: "Drayage from port to door",
    description: "Container moves with chassis, hazmat and return-trip pricing built in.",
    next: ["Service details", "Container & chassis options", "Instant drayage quote"],
  },
  daas: {
    eyebrow: "Services",
    title: "Demurrage as a service",
    description: "Stop paying avoidable port fees. We watch your containers so you don't have to.",
    next: ["What the service includes", "How it works", "Talk to us"],
  },
  agency: {
    eyebrow: "Agency program",
    title: "Grow your freight business with CDL1000",
    description: "Our technology, your relationships. Join the agency program.",
    next: ["Program details", "Benefits", "Apply"],
  },
  technology: {
    eyebrow: "Technology",
    title: "The platform behind the marketplace",
    description: "Matching, pricing and payments built for modern logistics.",
    next: ["Batch pricing", "Ruby — our pricing engine", "Integrations"],
  },
  careers: {
    eyebrow: "Careers",
    title: "Build the future of freight",
    description: "We're hiring people who want to fix logistics with great software.",
    next: ["Benefits", "Open roles (Lever)", "Life at CDL1000"],
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk freight",
    description: "Questions, partnerships or a tricky lane — we'd love to hear from you.",
    next: ["Contact form", "Phone & email", "Office location"],
  },
  apply: {
    eyebrow: "Apply",
    title: "Apply now",
    description: "Tell us about yourself and we'll get back to you.",
    next: ["Application form"],
  },
  blog: {
    eyebrow: "Blog",
    title: "Ideas by the truckload",
    description: "News, insights and updates from the CDL1000 team.",
    next: ["Featured post", "All posts", "Categories"],
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    description: "How CDL1000 collects, uses and protects your information.",
    next: ["Full policy text (ported from the current site)"],
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms & Conditions",
    description: "The terms that govern use of the CDL1000 platform.",
    next: ["Full terms text (ported from the current site)"],
  },
  ethics: {
    eyebrow: "Legal",
    title: "Code of Ethics",
    description: "The standards we hold ourselves to.",
    next: ["Full code text (ported from the current site)"],
  },
  quote: {
    eyebrow: "Instant quote",
    title: "Get a price in under a minute",
    description: "Truckload or drayage — enter your lane and see live pricing on the map.",
    next: ["Truckload / drayage wizard", "Live route map", "Promo code & checkout"],
  },
} as const;

export type PageSlug = keyof typeof pages;
