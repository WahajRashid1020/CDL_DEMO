export const siteConfig = {
  name: "CDL1000",
  url: "https://cdl1000.com",
  description:
    "CDL1000 is a technology platform and digital freight marketplace connecting shippers, agents, owner operators and logistics partners.",
  ogImage: "https://storage.googleapis.com/cdl_website_assets/cdl.jpeg",
  contact: {
    phone: "(872) 777-9899",
    email: "Solutions@cdl1000.com",
    address: "212 W Superior, Unit 204, Chicago, IL 60654",
  },
  links: {
    careers: "https://jobs.lever.co/cdl1000",
    linkedin: "https://www.linkedin.com/company/cdl-1000",
    facebook: "https://www.facebook.com/cdl1000/",
    instagram: "https://www.instagram.com/cdl1000/",
  },
} as const;

export type NavItem = { title: string; href: string; description?: string };

export const mainNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Services",
    items: [
      { title: "Truckload", href: "/truckload", description: "Full truckload, dry van and reefer capacity on demand." },
      { title: "Drayage", href: "/drayage", description: "Port and rail container moves with live pricing." },
      { title: "Demurrage as a Service", href: "/daas", description: "Stop paying avoidable port fees." },
    ],
  },
  {
    title: "Solutions",
    items: [
      { title: "Shippers", href: "/shippers", description: "Book, track and pay for loads in one place." },
      { title: "Carriers", href: "/carriers", description: "Find loads and get paid fast." },
      { title: "Agency Program", href: "/agency", description: "Grow your freight business with CDL1000." },
      { title: "Technology", href: "/technology", description: "The platform behind the marketplace." },
    ],
  },
  {
    title: "Company",
    items: [
      { title: "Careers", href: "/careers" },
      { title: "Blog", href: "/blog" },
      { title: "Contact", href: "/contact" },
    ],
  },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  ...mainNav,
  {
    title: "Legal",
    items: [
      { title: "Privacy Policy", href: "/legal/privacy" },
      { title: "Terms & Conditions", href: "/legal/terms" },
      { title: "Code of Ethics", href: "/legal/code-of-ethics" },
    ],
  },
];
