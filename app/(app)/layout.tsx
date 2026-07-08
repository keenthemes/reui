import { AppSiteShell } from "@/components/app-site-shell"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppSiteShell>{children}</AppSiteShell>
}
