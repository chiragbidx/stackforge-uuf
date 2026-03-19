import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Blocks,
  Cookie,
  Crown,
  Drama,
  Ghost,
  Goal,
  MousePointerClick,
  Newspaper,
  PictureInPicture,
  Puzzle,
  Sparkles,
  Squirrel,
  TabletSmartphone,
  Vegan,
  Wallet,
  ChartLine,
} from "lucide-react";

const ICONS = {
  BadgeCheck,
  Blocks,
  Cookie,
  Crown,
  Drama,
  Ghost,
  Goal,
  MousePointerClick,
  Newspaper,
  PictureInPicture,
  Puzzle,
  Sparkle: Sparkles,
  Squirrel,
  TabletSmartphone,
  Vegan,
  Wallet,
  LineChart: ChartLine,
} satisfies Record<string, LucideIcon>;

export const Icon = ({
  name,
  color,
  size,
  className,
}: {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}) => {
  const LucideIcon = ICONS[name as keyof typeof ICONS];

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon color={color} size={size ?? 20} className={className} />;
};
