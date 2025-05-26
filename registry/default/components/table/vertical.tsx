import { Badge } from '@/registry/default/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/registry/default/ui/table';

export default function TableDemo() {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table className="w-full md:w-[350px]">
        <TableBody>
          <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
            <TableCell className="bg-muted/50 py-2 font-medium">Name</TableCell>
            <TableCell className="py-2">Sophia Johnson</TableCell>
          </TableRow>
          <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
            <TableCell className="bg-muted/50 py-2 font-medium">
              Email
            </TableCell>
            <TableCell className="py-2">s.johnson@company.com</TableCell>
          </TableRow>
          <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
            <TableCell className="bg-muted/50 py-2 font-medium">
              Location
            </TableCell>
            <TableCell className="py-2">New York, USA</TableCell>
          </TableRow>
          <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
            <TableCell className="bg-muted/50 py-2 font-medium">Role</TableCell>
            <TableCell className="py-2">
              <Badge variant="secondary">Admin</Badge>
            </TableCell>
          </TableRow>
          <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
            <TableCell className="bg-muted/50 py-2 font-medium">
              Status
            </TableCell>
            <TableCell className="py-2">
              <Badge variant="primary">Active</Badge>
            </TableCell>
          </TableRow>
          <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
            <TableCell className="bg-muted/50 py-2 font-medium">
              Last Login
            </TableCell>
            <TableCell className="py-2">Jan 25, 2025</TableCell>
          </TableRow>
          <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
            <TableCell className="bg-muted/50 py-2 font-medium">
              Balance
            </TableCell>
            <TableCell className="py-2">$1,250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
