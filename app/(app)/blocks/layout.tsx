'use client';

import BlocksNav from "@/components/blocks-nav";
import BlocksSuggestion from "@/components/blocks-suggest";
import BlocksCategories from "@/components/blocks-categories";

export default function BlocksLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b border-border">
        <div className="container-fluid flex justify-between items-center gap-2.5">
          <div className="flex items-center gap-2.5">
            <BlocksCategories/>
          </div>
          <div className="flex items-center gap-2.5">
            <BlocksSuggestion />
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="hidden lg:block w-[250px] flex-shrink-0">
          <div className="sticky top-16 max-h-screen overflow-y-auto py-1">
            <BlocksNav />
          </div>
        </div>
        <main className="flex-1 border-l border-border">
          <div className="container-fluid py-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
