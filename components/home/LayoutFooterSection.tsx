import { Separator } from "@/components/ui/separator";
import { ChevronsDownIcon } from "lucide-react";
import Link from "next/link";
import { homeContent } from "@/content/home";

const { footer } = homeContent;

export const LayoutFooterSection = () => {
  return (
    <footer id="footer" className="container py-24 sm:py-32">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <Link href="#" className="flex font-bold items-center">
              <ChevronsDownIcon className="w-9 h-9 mr-2 bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg border border-secondary" />

              <h3 className="text-2xl">{footer.brandName}</h3>
            </Link>
          </div>

          {footer.columns.map((column) => (
            <div key={column.heading} className="flex flex-col gap-2">
              <h3 className="font-bold text-lg">{column.heading}</h3>
              {column.links.map((link) => (
                <div key={link.label}>
                  <Link href={link.href} className="opacity-60 hover:opacity-100">
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>

        <Separator className="my-6" />
        <section className="">
          <h3 className="">
            {footer.copyright}
            <Link
              target="_blank"
              href={footer.attribution.href}
              className="text-primary transition-all border-primary hover:border-b-2 ml-1"
            >
              {footer.attribution.label}
            </Link>
          </h3>
        </section>
      </div>
    </footer>
  );
};
