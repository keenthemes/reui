const siteName = "ReUI"
const siteUrl = "https://reui.io"
const siteTwitterUrl = "https://x.com/reui_io"
const reuiProWaitlistUrl = "https://pro.reui.io"

export const siteConfig = {
  name: siteName,
  url: siteUrl,
  description:
    "Free & open-source library of 1,000+ components and patterns to 10x your productivity in shadcn projects.",
  metadata: {
    locale: "en_US",
    titleTemplate: "%s",
    titleSuffixes: {
      site: siteName,
      patternCategory: "UI Components and Patterns",
    },
  },
  links: {
    twitter: siteTwitterUrl,
    github: "https://github.com/keenthemes/reui",
    pro: reuiProWaitlistUrl,
  },
  announcementBar: {
    enabled: true,
    homeOnly: true,
    badgeText: "ReUI Pro",
    title: "Join the waitlist and lock in an exclusive 40% launch discount.",
    linkUrl: reuiProWaitlistUrl,
    linkText: "Join waitlist",
  },
  navItems: [
    {
      href: "/patterns",
      label: "Patterns",
    },
    {
      href: "/docs",
      label: "Docs",
    },
    {
      href: "/built-with-reui",
      label: "Built with ReUI",
    },
    {
      href: "https://pro.reui.io",
      pro: true,
      label: "Pro",
    },
  ],
}

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}
