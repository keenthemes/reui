export function SiteHero2() {
  return (
    <div className="container">
      <div className="flex items-center justify-center py-10 lg:py-2 lg:h-[400px] mb-5">
        <div className="flex items-center flex-col justify-between gap-6">
          <h1 className="text-2xl lg:text-[48px] font-bold text-center">Built with ReUI</h1>

          <div className="text-center text-xl max-w-3xl text-muted-foreground">
            Engineered by the <strong className="text-foreground">ReUI</strong> core team, our premium templates 
						and boilerplates give you everything you need to build fast production-ready 
            codebases that play perfectly with <strong className="text-foreground">shadcn/ui</strong> and modern frontend best practices.
          </div>
        </div>
      </div>
    </div>
  );
}
