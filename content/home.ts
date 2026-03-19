// ─── Hero ───────────────────────────────────────────────────────────────────
export type HeroContent = {
  badgeInner: string;
  badgeOuter: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  heroImageLight: string;
  heroImageDark: string;
  heroImageAlt: string;
};

// ─── Sponsors ───────────────────────────────────────────────────────────────
export type SponsorItem = { icon: string; name: string };
export type SponsorsContent = {
  heading: string;
  items: SponsorItem[];
};

// ─── Benefits ───────────────────────────────────────────────────────────────
export type BenefitItem = { icon: string; title: string; description: string };
export type BenefitsContent = {
  eyebrow: string;
  heading: string;
  description: string;
  items: BenefitItem[];
};

// ─── Feature Grid ───────────────────────────────────────────────────────────
export type FeatureItem = { icon: string; title: string; description: string };
export type FeaturesContent = {
  eyebrow: string;
  heading: string;
  subtitle: string;
  items: FeatureItem[];
};

// ─── Services ───────────────────────────────────────────────────────────────
export type ServiceItem = { title: string; description: string; pro: boolean };
export type ServicesContent = {
  eyebrow: string;
  heading: string;
  subtitle: string;
  items: ServiceItem[];
};

// ─── Testimonials ───────────────────────────────────────────────────────────
export type TestimonialItem = {
  image: string;
  name: string;
  role: string;
  comment: string;
  rating: number;
};
export type TestimonialsContent = {
  eyebrow: string;
  heading: string;
  reviews: TestimonialItem[];
};

// ─── Team ───────────────────────────────────────────────────────────────────
export type SocialLink = { name: string; url: string };
export type TeamMember = {
  imageUrl: string;
  firstName: string;
  lastName: string;
  positions: string[];
  socialNetworks: SocialLink[];
};
export type TeamContent = {
  eyebrow: string;
  heading: string;
  members: TeamMember[];
};

// ─── Pricing ────────────────────────────────────────────────────────────────
export type PricingPlan = {
  title: string;
  popular: boolean;
  price: number;
  description: string;
  buttonText: string;
  benefits: string[];
};
export type PricingContent = {
  eyebrow: string;
  heading: string;
  subtitle: string;
  priceSuffix: string;
  plans: PricingPlan[];
};

// ─── Contact ────────────────────────────────────────────────────────────────
export type ContactInfoBlock = { label: string; value: string | string[] };
export type ContactContent = {
  eyebrow: string;
  heading: string;
  description: string;
  mailtoAddress: string;
  info: {
    address: ContactInfoBlock;
    phone: ContactInfoBlock;
    email: ContactInfoBlock;
    hours: ContactInfoBlock;
  };
  formSubjects: string[];
  formSubmitLabel: string;
};

// ─── FAQ ────────────────────────────────────────────────────────────────────
export type FaqItem = { question: string; answer: string };
export type FaqContent = {
  eyebrow: string;
  heading: string;
  items: FaqItem[];
};

// ─── Footer ─────────────────────────────────────────────────────────────────
export type FooterLink = { label: string; href: string };
export type FooterColumn = { heading: string; links: FooterLink[] };
export type FooterContent = {
  brandName: string;
  columns: FooterColumn[];
  copyright: string;
  attribution: { label: string; href: string };
};

// ─── Navbar ─────────────────────────────────────────────────────────────────
export type NavRoute = { href: string; label: string };
export type NavFeature = { title: string; description: string };
export type NavbarContent = {
  brandName: string;
  routes: NavRoute[];
  featureDropdownLabel: string;
  featureImage: { src: string; alt: string };
  features: NavFeature[];
  signInLabel: string;
  signUpLabel: string;
  dashboardLabel: string;
  githubLink: { href: string; ariaLabel: string };
};

// ─── Root ───────────────────────────────────────────────────────────────────
export type HomeContent = {
  hero: HeroContent;
  sponsors: SponsorsContent;
  benefits: BenefitsContent;
  features: FeaturesContent;
  services: ServicesContent;
  testimonials: TestimonialsContent;
  team: TeamContent;
  pricing: PricingContent;
  contact: ContactContent;
  faq: FaqContent;
  footer: FooterContent;
  navbar: NavbarContent;
};

// ─── Defaults ───────────────────────────────────────────────────────────────

export const defaultHomeContent: HomeContent = {
  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    badgeInner: "Launch",
    badgeOuter: "Panda SaaS starter is ready",
    titleBefore: "Build your next",
    titleHighlight: "SaaS",
    titleAfter: "app in days, not weeks",
    subtitle:
      "Panda gives you authentication, billing-ready patterns, team flows, and polished UI foundations so you can ship faster with confidence.",
    primaryCta: { label: "Start Building", href: "#pricing" },
    secondaryCta: { label: "Explore features", href: "#features" },
    heroImageLight: "/hero-image-light.jpeg",
    heroImageDark: "/hero-image-dark.jpeg",
    heroImageAlt: "Panda dashboard preview",
  },

  // ── Sponsors ─────────────────────────────────────────────────────────────
  sponsors: {
    heading: "Built with trusted tools",
    items: [
      { icon: "Crown", name: "Vercel" },
      { icon: "Vegan", name: "Stripe" },
      { icon: "Ghost", name: "OpenAI" },
      { icon: "Puzzle", name: "Supabase" },
      { icon: "Squirrel", name: "Clerk" },
      { icon: "Cookie", name: "Resend" },
      { icon: "Drama", name: "Sentry" },
    ],
  },

  // ── Benefits ─────────────────────────────────────────────────────────────
  benefits: {
    eyebrow: "Why Panda",
    heading: "A practical SaaS app builder starter",
    description:
      "Built for teams that want production-ready foundations with room to customize, not a rigid template you outgrow in a week.",
    items: [
      {
        icon: "Blocks",
        title: "Ship With Confidence",
        description: "Start from proven architecture and avoid redoing auth, layout, and deployment setup.",
      },
      {
        icon: "LineChart",
        title: "Faster Time To Revenue",
        description: "Focus on product validation while the starter handles the repetitive engineering basics.",
      },
      {
        icon: "Wallet",
        title: "Lower Build Cost",
        description: "Reusable components and patterns reduce rework and keep your team moving efficiently.",
      },
      {
        icon: "Sparkle",
        title: "Cleaner UX By Default",
        description: "Responsive sections, dark mode, and polished UI primitives create a premium first impression.",
      },
    ],
  },

  // ── Features ─────────────────────────────────────────────────────────────
  features: {
    eyebrow: "Features",
    heading: "What you get out of the box",
    subtitle:
      "Panda combines developer speed and production-grade UX so you can spend your time shipping features instead of rebuilding starter infrastructure.",
    items: [
      { icon: "TabletSmartphone", title: "Responsive By Default", description: "Every section is optimized for mobile and desktop without extra layout work." },
      { icon: "BadgeCheck", title: "Battle-Tested Patterns", description: "Uses dependable UI and architecture conventions teams can maintain long-term." },
      { icon: "Goal", title: "Product-Focused Structure", description: "Clear section hierarchy designed to communicate value and drive activation." },
      { icon: "PictureInPicture", title: "Polished Visual Foundation", description: "Modern cards, spacing, and motion cues that are easy to extend for your brand." },
      { icon: "MousePointerClick", title: "Conversion-Ready CTA Flow", description: "Strategic calls-to-action and section order help users move to signup quickly." },
      { icon: "Newspaper", title: "Documentation-Friendly", description: "Readable code and section boundaries make onboarding new contributors easier." },
    ],
  },

  // ── Services ─────────────────────────────────────────────────────────────
  services: {
    eyebrow: "Services",
    heading: "Core starter capabilities",
    subtitle:
      "A pragmatic baseline for SaaS products that need to move quickly without sacrificing quality.",
    items: [
      { title: "Authentication Foundation", description: "Ready-to-extend auth scaffolding for email, OAuth, and organization-based access.", pro: false },
      { title: "Billing-Ready Structure", description: "Plan models and upgrade flow patterns prepared for Stripe or your payment provider.", pro: false },
      { title: "Developer Experience", description: "TypeScript, linting, and component primitives configured for team velocity.", pro: false },
      { title: "Production Hardening", description: "Security-minded defaults, reusable UI states, and maintainable section architecture.", pro: true },
    ],
  },

  // ── Testimonials ─────────────────────────────────────────────────────────
  testimonials: {
    eyebrow: "Testimonials",
    heading: "Teams shipping with Panda",
    reviews: [
      { image: "/demo-img.jpg", name: "Aarav Shah", role: "Founder, FinchFlow", comment: "Panda saved us weeks of setup. We launched our first paying plan in less than a sprint.", rating: 5.0 },
      { image: "/demo-img.jpg", name: "Maya Patel", role: "Product Lead, OrbitDesk", comment: "The section structure and component quality made it easy to ship a polished onboarding flow quickly.", rating: 4.8 },
      { image: "/demo-img.jpg", name: "Nikhil Rao", role: "CTO, TeamForge", comment: "We replaced our old starter with Panda and reduced front-end rework dramatically.", rating: 4.9 },
      { image: "/demo-img.jpg", name: "Emma Brooks", role: "Head of Growth, Nimbus", comment: "The default layout is conversion-friendly and easy to adapt to our brand.", rating: 5.0 },
      { image: "/demo-img.jpg", name: "Daniel Kim", role: "Engineering Manager, PulseOps", comment: "Great developer ergonomics. New engineers onboarded fast and started shipping immediately.", rating: 5.0 },
      { image: "/demo-img.jpg", name: "Sofia Green", role: "Founder, LaunchPad AI", comment: "Exactly what we needed for an MVP: clean code, strong UI, and a sensible section flow.", rating: 4.9 },
    ],
  },

  // ── Team ─────────────────────────────────────────────────────────────────
  team: {
    eyebrow: "Team",
    heading: "Meet the Panda team",
    members: [
      {
        imageUrl: "/team1.jpg",
        firstName: "Leo",
        lastName: "Miranda",
        positions: ["Lead Engineer", "Starter Architecture"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/leopoldo-miranda/" },
          { name: "Github", url: "https://github.com/leoMirandaa" },
          { name: "X", url: "https://x.com/leo_mirand4" },
        ],
      },
      {
        imageUrl: "/team2.jpg",
        firstName: "Elizabeth",
        lastName: "Moore",
        positions: ["Product Designer"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/leopoldo-miranda/" },
          { name: "X", url: "https://x.com/leo_mirand4" },
        ],
      },
      {
        imageUrl: "/team3.jpg",
        firstName: "David",
        lastName: "Diaz",
        positions: ["Platform Engineer", "AI Integrations"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/leopoldo-miranda/" },
          { name: "Github", url: "https://github.com/leoMirandaa" },
        ],
      },
      {
        imageUrl: "/team1.jpg",
        firstName: "Sarah",
        lastName: "Robinson",
        positions: ["Cloud Engineer", "Kubernetes"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/leopoldo-miranda/" },
          { name: "Github", url: "https://github.com/leoMirandaa" },
          { name: "X", url: "https://x.com/leo_mirand4" },
        ],
      },
      {
        imageUrl: "/team2.jpg",
        firstName: "Michael",
        lastName: "Holland",
        positions: ["DevOps Engineer", "CI/CD"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/leopoldo-miranda/" },
        ],
      },
      {
        imageUrl: "/team3.jpg",
        firstName: "Zoe",
        lastName: "Garcia",
        positions: ["Frontend Engineer", "Design Systems"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/leopoldo-miranda/" },
          { name: "Github", url: "https://github.com/leoMirandaa" },
        ],
      },
      {
        imageUrl: "/team1.jpg",
        firstName: "Evan",
        lastName: "James",
        positions: ["Backend Engineer"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/leopoldo-miranda/" },
          { name: "Github", url: "https://github.com/leoMirandaa" },
          { name: "X", url: "https://x.com/leo_mirand4" },
        ],
      },
      {
        imageUrl: "/team2.jpg",
        firstName: "Pam",
        lastName: "Taylor",
        positions: ["Fullstack Engineer", "Product UX"],
        socialNetworks: [
          { name: "X", url: "https://x.com/leo_mirand4" },
        ],
      },
    ],
  },

  // ── Pricing ──────────────────────────────────────────────────────────────
  pricing: {
    eyebrow: "Pricing",
    heading: "Pricing for every stage",
    subtitle: "Start lean, then scale to enterprise-grade workflows as your product grows.",
    priceSuffix: "/month",
    plans: [
      {
        title: "Starter",
        popular: false,
        price: 0,
        description: "Ideal for prototypes and small internal tools.",
        buttonText: "Start for free",
        benefits: ["Up to 3 teammates", "Basic auth patterns", "Core landing sections", "Community support", "Deploy-ready setup"],
      },
      {
        title: "Growth",
        popular: true,
        price: 49,
        description: "Best for product teams shipping customer-facing SaaS.",
        buttonText: "Start trial",
        benefits: ["Unlimited teammates", "Advanced section set", "Billing-ready models", "Priority support", "Team workflows"],
      },
      {
        title: "Enterprise",
        popular: false,
        price: 199,
        description: "For teams requiring compliance, support SLAs, and custom rollout.",
        buttonText: "Contact sales",
        benefits: ["Security review support", "SSO/SAML integration path", "Dedicated onboarding", "Phone and email support", "Architecture advisory"],
      },
    ],
  },

  // ── Contact ──────────────────────────────────────────────────────────────
  contact: {
    eyebrow: "Contact",
    heading: "Talk to the Panda team",
    description:
      "Need help customizing the starter, planning architecture, or accelerating launch? Share your goals and timeline.",
    mailtoAddress: "hello@panda.dev",
    info: {
      address: { label: "Find us", value: "Remote-first • San Francisco, CA" },
      phone: { label: "Call us", value: "+1 (415) 555-0199" },
      email: { label: "Email us", value: "hello@panda.dev" },
      hours: { label: "Visit us", value: ["Monday - Friday", "9AM - 6PM PT"] },
    },
    formSubjects: ["Starter Demo", "Architecture Review", "Design System", "Billing Integration", "Enterprise Plan"],
    formSubmitLabel: "Send inquiry",
  },

  // ── FAQ ──────────────────────────────────────────────────────────────────
  faq: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { question: "Is Panda free to start with?", answer: "Yes. You can start with the core template and customize it for your product." },
      { question: "Can I use this for a production SaaS app?", answer: "Yes. The starter is designed for production-minded teams with scalable structure and reusable UI patterns." },
      { question: "Does it support dark mode and responsive design?", answer: "Yes. The template includes theme support and responsive layouts across major sections." },
      { question: "Can I plug in my own auth and billing provider?", answer: "Yes. The structure is provider-agnostic and easy to adapt for your stack." },
      { question: "How quickly can I launch with Panda?", answer: "Most teams can ship an MVP in days by reusing existing sections and starter patterns." },
    ],
  },

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    brandName: "Panda",
    columns: [
      {
        heading: "Contact",
        links: [
          { label: "hello@panda.dev", href: "mailto:hello@panda.dev" },
          { label: "Github", href: "#" },
          { label: "Twitter", href: "https://x.com" },
          { label: "Discord", href: "https://discord.com" },
        ],
      },
      {
        heading: "Product",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "Contact", href: "#contact" },
        ],
      },
      {
        heading: "Help",
        links: [
          { label: "Contact Us", href: "#contact" },
          { label: "FAQ", href: "#faq" },
          { label: "Docs", href: "https://nextjs.org/docs" },
        ],
      },
      {
        heading: "Socials",
        links: [
          { label: "GitHub", href: "https://github.com" },
          { label: "Discord", href: "https://discord.com" },
          { label: "X", href: "https://x.com" },
        ],
      },
    ],
    copyright: "\u00a9 2026 Panda SaaS App Builder Starter.",
    attribution: { label: "Built on Next.js", href: "https://nextjs.org" },
  },

  // ── Navbar ───────────────────────────────────────────────────────────────
  navbar: {
    brandName: "Panda",
    routes: [
      { href: "/#testimonials", label: "Testimonials" },
      { href: "/#team", label: "Team" },
      { href: "/#contact", label: "Contact" },
      { href: "/#faq", label: "FAQ" },
    ],
    featureDropdownLabel: "Features",
    featureImage: { src: "/demo-img.jpg", alt: "Panda preview" },
    features: [
      { title: "Auth, Billing, Teams", description: "Production-ready flows for sign-in, subscriptions, and organizations." },
      { title: "UI + Design System", description: "Shadcn-based components with consistent theming and dark mode support." },
      { title: "Deploy Fast", description: "Sane defaults for Next.js, TypeScript, and Vercel-first deployment." },
    ],
    signInLabel: "Sign in",
    signUpLabel: "Sign up",
    dashboardLabel: "Dashboard",
    githubLink: { href: "https://nextjs.org/docs", ariaLabel: "View on GitHub" },
  },
};

export const homeContent: HomeContent = defaultHomeContent;

// Keep this function export for backward compatibility with older imports.
// Primary consumers should import `homeContent` directly.
export function getHomeContent(): HomeContent {
  return homeContent;
}
