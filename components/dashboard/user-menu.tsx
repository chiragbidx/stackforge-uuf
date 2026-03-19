"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type UserMenuProps = {
  fullName: string;
  email: string;
  initials: string;
  signOutAction: () => Promise<void>;
};

export function UserMenu({
  fullName,
  email,
  initials,
  signOutAction,
}: UserMenuProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          title="Account menu"
        >
          <Avatar className="size-8 border cursor-pointer transition-opacity hover:opacity-80">
            <AvatarFallback className="text-xs font-medium bg-muted">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-0">
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 border">
              <AvatarFallback className="text-sm font-medium bg-muted">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-none">
                {fullName}
              </p>
              <p className="truncate text-xs text-muted-foreground mt-1">
                {email}
              </p>
            </div>
          </div>
        </div>
        <Separator />
        <div className="p-2">
          <form action={signOutAction}>
            <Button
              variant="ghost"
              size="sm"
              type="submit"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
