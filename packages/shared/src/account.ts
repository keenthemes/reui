import type { LicenseType } from "./index";

export interface AccountRoute {
  href: string;
  label: string;
  icon: string;
}

export const ACCOUNT_ROUTES: Record<string, AccountRoute> = {
  profile: { href: "/account", label: "Profile", icon: "user" },
  licenses: { href: "/account/licenses", label: "Licenses", icon: "key" },
  mcp: { href: "/account/mcp", label: "MCP access", icon: "plug" },
  team: { href: "/account/team", label: "Team", icon: "users" },
  settings: { href: "/account/settings", label: "Settings", icon: "settings" },
};

export const ACCOUNT_PATH = "/account";
export const PRICING_PATH = "/pricing";
export const LOGIN_PATH = "/login";

/**
 * Returns true if the license type allows team management.
 *
 * `personal` is single-seat (no team UI). `team` (5 seats), `growth`
 * (10 seats), and `enterprise` (unlimited) expose the team-management
 * surface (see SEAT_COUNTS in pricing.ts). The retired `business` tier is
 * matched via a string check (it is no longer in the LicenseType union) so
 * any grandfathered business license keeps its team-management access.
 */
export function isTeamLicense(licenseType: LicenseType | null): boolean {
  return (
    licenseType === "team" ||
    licenseType === "growth" ||
    licenseType === "enterprise" ||
    (licenseType as string) === "business"
  );
}
