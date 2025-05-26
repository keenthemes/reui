import Link from 'next/link';
import { Button } from '@/registry/default/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/registry/default/ui/pagination';
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function PaginationDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button variant="ghost" mode="icon" asChild disabled>
            <Link href="#">
              <ChevronFirst className="rtl:rotate-180" />
            </Link>
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button variant="ghost" mode="icon" asChild disabled>
            <Link href="#">
              <ChevronLeft className="rtl:rotate-180" />
            </Link>
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button variant="ghost" mode="icon" asChild>
            <Link href="#">1</Link>
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button variant="outline" mode="icon" asChild>
            <Link href="#">2</Link>
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button variant="ghost" mode="icon" asChild>
            <Link href="#">3</Link>
          </Button>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <Button variant="ghost" mode="icon" asChild>
            <Link href="#">
              <ChevronRight className="rtl:rotate-180" />
            </Link>
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button variant="ghost" mode="icon" asChild>
            <Link href="#">
              <ChevronLast className="rtl:rotate-180" />
            </Link>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
