'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/registry/default/ui/button';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetBody } from '@/registry/default/ui/sheet';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import BlocksNav from './blocks-nav';

export function BlocksNavMobileToggle() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
	const pathname = usePathname();

  // Close sheet when route changes
  useEffect(() => {
    setIsSheetOpen(false);
  }, [pathname]);

  return (
		<div className="lg:hidden -ms-2.5">
			<Sheet
				open={isSheetOpen}
				onOpenChange={setIsSheetOpen}
			>
				<SheetTrigger asChild>
					<Button variant="ghost" mode="icon">
						<Menu/>
					</Button>
				</SheetTrigger>
				<SheetContent
					className="p-0 gap-0 w-[225px]"
					side="left"
					close={false}
				>
					<SheetHeader className="p-0 space-y-0" />
					<SheetBody className="p-0 overflow-y-auto">
						<BlocksNav />
					</SheetBody>
				</SheetContent>
			</Sheet>
		</div>
  );
}
