import { Compass, Crosshair, Radio, Settings2, type LucideIcon } from "lucide-react";

export type NavItem = { label: string; href: string; icon: LucideIcon; code: string };
export const navigation: NavItem[] = [
  { label: "Mission", href: "/", icon: Crosshair, code: "01" },
  { label: "Explore", href: "/explorer", icon: Compass, code: "02" },
  { label: "ISS", href: "/iss", icon: Radio, code: "03" },
  { label: "Settings", href: "/settings", icon: Settings2, code: "04" },
];
