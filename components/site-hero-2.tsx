export function SiteHero2() {
  return (
    <div className="container">
      <div className="flex items-center justify-center py-10 lg:py-2 lg:h-[380px] mb-5">
        <div className="flex items-center flex-col justify-between gap-6">
          <h1 className="text-2xl lg:text-[48px] font-bold text-center">Built with ReUI</h1>

          <div className="text-center text-xl max-w-4xl text-muted-foreground">
            Save time and ship faster with premium and free <strong className="text-foreground">shadcn/ui</strong>{' '}
            compatible templates and starter kits crafted by the <strong className="text-foreground">ReUI</strong> core
            team with best practices in mind. Perfect for MVPs and production-ready apps that require modern design and
            smooth performance.
          </div>
        </div>
      </div>
    </div>
  );
}
