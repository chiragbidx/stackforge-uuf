"use client";

import { Icon } from "@/components/ui/icon";
import { homeContent } from "@/content/home";

const { sponsors } = homeContent;

export const LayoutSponsorsSection = () => {
  return (
    <section id="sponsors" className="max-w-[75%] mx-auto pb-24 sm:pb-32">
      <h2 className="text-lg md:text-xl text-center mb-6">
        {sponsors.heading}
      </h2>

      <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card/60 p-4">
        <div className="flex w-max gap-12 animate-marquee">
          {sponsors.items.flatMap((item) => [item, item]).map(({ icon, name }, idx) => (
            <div key={`${name}-${idx}`} className="flex items-center text-xl md:text-2xl font-medium text-foreground/85">
              <Icon name={icon} size={32} className="mr-2 text-primary" />
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
