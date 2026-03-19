// Empty landing page starter — copy this file to create new landing pages.
// Only the shared Navbar (auth-aware) and Footer are rendered.
// Add your own sections in the <main> area below.
import { Navbar as LayoutNavbar } from "@/components/layout/navbar";
import { LayoutFooterSection } from "@/components/home/LayoutFooterSection";
import { getAuthSession } from "@/lib/auth/session";

export default async function BlankLandingPage() {
  const session = await getAuthSession();

  return (
    <div className="home-dark min-h-screen bg-gradient-to-b from-zinc-50 via-white to-[#ffe6d8] text-zinc-900 transition-colors dark:from-[#120d0b] dark:via-[#16100d] dark:to-[#1f1612] dark:text-[#f7efe8]">
      <LayoutNavbar isLoggedIn={!!session} />

      <main className="flex min-h-[70vh] w-full flex-col gap-12 px-6 py-12 sm:px-10 lg:px-16 lg:max-w-[1600px] lg:mx-auto">
        {/*
         * ────────────────────────────────────────────────────────────
         *  ADD YOUR LANDING PAGE SECTIONS HERE
         * ────────────────────────────────────────────────────────────
         *
         *  This is a blank starter page with only the Navbar and Footer.
         *  Use it as a template for building new landing pages.
         *
         *  HOW TO ADD CONTENT:
         *
         *  1. Import an existing section from components/home/:
         *
         *     import { LayoutHeroSection } from "@/components/home/LayoutHeroSection";
         *     import { LayoutBenefitsSection } from "@/components/home/LayoutBenefitsSection";
         *     import { LayoutFeatureGridSection } from "@/components/home/LayoutFeatureGridSection";
         *     import { LayoutServicesSection } from "@/components/home/LayoutServicesSection";
         *     import { LayoutTestimonialSection } from "@/components/home/LayoutTestimonialSection";
         *     import { LayoutTeamSection } from "@/components/home/LayoutTeamSection";
         *     import { LayoutPricingSection } from "@/components/home/LayoutPricingSection";
         *     import { LayoutContactSection } from "@/components/home/LayoutContactSection";
         *     import { LayoutFaqSection } from "@/components/home/LayoutFaqSection";
         *     import { LayoutSponsorsSection } from "@/components/home/LayoutSponsorsSection";
         *
         *     Then place them inside this <main> block:
         *
         *     <LayoutHeroSection />
         *     <LayoutBenefitsSection />
         *     <LayoutPricingSection />
         *
         *  2. Create a new custom section:
         *
         *     a. Create a file at components/home/LayoutYourSection.tsx
         *     b. Export a named component, e.g. export const LayoutYourSection = () => { ... }
         *     c. Import and drop it in here.
         *
         *  3. Or just write JSX directly in this <main> block for one-off pages.
         *
         * ────────────────────────────────────────────────────────────
         */}

        <LayoutFooterSection />
      </main>
    </div>
  );
}
