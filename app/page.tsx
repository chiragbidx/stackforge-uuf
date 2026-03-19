// Server Component: keep layout/content server-rendered; sections are data-driven.
import { LayoutBenefitsSection } from "../components/home/LayoutBenefitsSection";
import { LayoutContactSection } from "../components/home/LayoutContactSection";
import { LayoutFaqSection } from "../components/home/LayoutFaqSection";
import { LayoutFeatureGridSection } from "../components/home/LayoutFeatureGridSection";
import { LayoutFooterSection } from "../components/home/LayoutFooterSection";
import { LayoutHeroSection } from "../components/home/LayoutHeroSection";
import { LayoutPricingSection } from "../components/home/LayoutPricingSection";
import { LayoutServicesSection } from "../components/home/LayoutServicesSection";
import { LayoutSponsorsSection } from "../components/home/LayoutSponsorsSection";
import { LayoutTeamSection } from "../components/home/LayoutTeamSection";
import { LayoutTestimonialSection } from "../components/home/LayoutTestimonialSection";
import { Navbar as LayoutNavbar } from "@/components/layout/navbar";
import { getAuthSession } from "@/lib/auth/session";

export default async function Home() {
  const session = await getAuthSession();
  // Simple toggles so agents/users can hide sections without touching JSX.
  // Use ONLY_SECTIONS (comma list) to whitelist, or HIDE_SECTIONS to blacklist.
  const only = (process.env.ONLY_SECTIONS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const envHide = (process.env.HIDE_SECTIONS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const defaultHide: string[] = [];
  const whitelist = only.length ? new Set(only) : null;
  const hide = new Set(whitelist ? envHide : [...defaultHide, ...envHide]);
  // Section IDs are the contract for ONLY_SECTIONS / HIDE_SECTIONS env toggles.
  // Keep IDs stable so deploy-time section filtering remains predictable.
  const sections = [
    ["layout-hero", <LayoutHeroSection key="layout-hero" />],
    ["layout-sponsors", <LayoutSponsorsSection key="layout-sponsors" />],
    ["layout-benefits", <LayoutBenefitsSection key="layout-benefits" />],
    ["layout-features", <LayoutFeatureGridSection key="layout-features" />],
    ["layout-services", <LayoutServicesSection key="layout-services" />],
    ["layout-testimonials", <LayoutTestimonialSection key="layout-testimonials" />],
    ["layout-team", <LayoutTeamSection key="layout-team" />],
    ["layout-pricing", <LayoutPricingSection key="layout-pricing" />],
    ["layout-contact", <LayoutContactSection key="layout-contact" />],
    ["layout-faq", <LayoutFaqSection key="layout-faq" />],
    ["layout-footer", <LayoutFooterSection key="layout-footer" />],
  ] as const;
  const visibleSections = sections
    .filter(([id]) => (whitelist ? whitelist.has(id) : true))
    .filter(([id]) => !hide.has(id));

  return (
    <div className="home-dark min-h-screen bg-gradient-to-b from-zinc-50 via-white to-[#ffe6d8] text-zinc-900 transition-colors dark:from-[#120d0b] dark:via-[#16100d] dark:to-[#1f1612] dark:text-[#f7efe8]">
      <LayoutNavbar isLoggedIn={!!session} />
      <main className="flex min-h-screen w-full flex-col gap-12 px-6 py-12 sm:px-10 lg:px-16 lg:max-w-[1600px] lg:mx-auto">
        {visibleSections.map(([, node]) => node)}
      </main>

      {/* lightweight animations defined locally to avoid tailwind config changes */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes fade-slide {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-section {
          animation: fade-slide 0.7s ease both;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float 14s ease-in-out infinite;
        }
        .animate-fade-slide {
          animation: fade-slide 0.6s ease both;
        }
        .animate-marquee {
          width: max-content;
          animation: marquee 24s linear infinite;
        }
        .hover-lift {
          transition: transform 300ms ease, box-shadow 300ms ease;
        }
        .hover-lift:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -24px rgba(251, 114, 50, 0.45);
        }
        .dark .home-dark .hover-lift:hover {
          box-shadow: 0 18px 44px -26px rgba(0, 0, 0, 0.75);
        }
      `}</style>
    </div>
  );
}
