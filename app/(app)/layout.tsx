export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-site-background font-site-sans overscroll-behavior has-[.bordered-sidebar]:[&_header]:border-site-border/80 has-[.bordered-sidebar]:bg-site-muted/60 dark:has-[.bordered-sidebar]:bg-site-background relative flex min-h-svh flex-col overscroll-none">
      <main className="relative flex flex-1 flex-col">{children}</main>
    </div>
  )
}
