"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

type MobileNavProps = {
  fullName: string;
  email: string;
  initials: string;
};

export function MobileNav({ fullName, email, initials }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <div className="flex h-full flex-col">
          <div className="p-5 pb-0">
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded-lg bg-foreground text-background text-sm font-bold">
                P
              </div>
              <span className="font-semibold tracking-tight">Panda Admin</span>
            </div>
          </div>

          <div className="my-4" />

          <div className="flex-1 overflow-y-auto px-3">
            <SidebarNav />
          </div>

          <Separator />
          <div className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-8 border">
                <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-none">{fullName}</p>
                <p className="truncate text-xs text-muted-foreground mt-1">{email}</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
