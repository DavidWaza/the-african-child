import type { ApiRole } from "@/lib/api-types";
import type { IconName } from "@/lib/icons";

export interface NavItem {
  label: string;
  href: string;
  icon: IconName;
  /** Match only the exact path (for area home links). */
  exact?: boolean;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

/** Role-dependent navigation. Adding a screen to a portal is one entry here. */
export const NAVIGATION: Record<ApiRole, NavGroup[]> = {
  giver: [
    {
      items: [
        { label: "Overview", href: "/giver", icon: "dashboard", exact: true },
        { label: "My children", href: "/giver/children", icon: "children" },
        { label: "Pledges & giving", href: "/giver/pledges", icon: "pledge" },
      ],
    },
    {
      label: "Programme",
      items: [{ label: "Impact report", href: "/transparency", icon: "transparency" }],
    },
  ],
  admin: [
    {
      items: [{ label: "Overview", href: "/admin", icon: "dashboard", exact: true }],
    },
    {
      label: "Records",
      items: [
        { label: "Children", href: "/admin/children", icon: "children" },
        { label: "Schools", href: "/admin/schools", icon: "school" },
        { label: "Results", href: "/admin/results", icon: "results" },
      ],
    },
    {
      label: "Giving",
      items: [{ label: "Givers & pledges", href: "/admin/givers", icon: "givers" }],
    },
  ],
};

export function isNavActive(item: NavItem, pathname: string) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}
