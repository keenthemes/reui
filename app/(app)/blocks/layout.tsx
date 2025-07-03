'use client';

import BlocksNavToggle from "@/components/blocks-nav-toggle";
import BlocksNav from "@/components/blocks-nav";
import BlocksSuggestion from "@/components/blocks-suggest";
import BlocksBreadcrumb from "@/components/blocks-breadcrumb";

export default function BlocksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b border-border py-2.5">
        <div className="container-fluid flex justify-between items-center gap-2.5">
          <div className="flex items-center gap-2.5">
            <BlocksNavToggle />
            <BlocksBreadcrumb />
          </div>
          <div>
            <BlocksSuggestion />
          </div>
        </div>
      </div>
      <div className="flex grow">
        <div className="sticky top-0 hidden lg:block w-[280px] flex-shrink-0">
          <BlocksNav />
        </div>
        <main className="flex-1 border-l border-border">
          <div className="container-fluid">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
