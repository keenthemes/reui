// Description: Product inventory table with stock badges and prices
// Order: 11
// GridSize: 1

import { Badge } from "@/registry-reui/bases/base/reui/badge"

import { Button } from "@/registry/bases/base/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/bases/base/ui/table"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const products = [
  {
    name: "Ergonomic Desk Chair",
    sku: "FRN-001",
    category: "Furniture",
    price: "$549.00",
    stock: 124,
    stockStatus: "In Stock",
    stockVariant: "success-light" as const,
  },
  {
    name: "Wireless Noise-Canceling Headphones",
    sku: "AUD-042",
    category: "Audio",
    price: "$349.99",
    stock: 8,
    stockStatus: "Low Stock",
    stockVariant: "warning-light" as const,
  },
  {
    name: '4K Ultra HD Monitor 32"',
    sku: "DSP-019",
    category: "Displays",
    price: "$799.00",
    stock: 0,
    stockStatus: "Out of Stock",
    stockVariant: "destructive-light" as const,
  },
  {
    name: "Mechanical Keyboard RGB",
    sku: "INP-087",
    category: "Input",
    price: "$179.99",
    stock: 56,
    stockStatus: "In Stock",
    stockVariant: "success-light" as const,
  },
  {
    name: "USB-C Docking Station",
    sku: "ACC-033",
    category: "Accessories",
    price: "$249.00",
    stock: 3,
    stockStatus: "Low Stock",
    stockVariant: "warning-light" as const,
  },
]

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.sku}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="bg-muted style-vega:rounded-md style-maia:rounded-md style-nova:rounded-sm style-lyra:rounded-none style-mira:rounded-sm flex size-9 shrink-0 items-center justify-center">
                    <IconPlaceholder
                      lucide="PackageIcon"
                      tabler="IconPackage"
                      hugeicons="Package01Icon"
                      phosphor="PackageIcon"
                      remixicon="RiBox3Line"
                      className="text-muted-foreground size-4"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-muted-foreground tru font-mono text-xs">
                      {product.sku}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {product.category}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant={product.stockVariant} size="sm">
                    {product.stockStatus}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    ({product.stock})
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right text-sm font-medium">
                {product.price}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" className="size-8" />
                    }
                  >
                    <IconPlaceholder
                      lucide="MoreHorizontalIcon"
                      tabler="IconDots"
                      hugeicons="MoreHorizontalCircle01Icon"
                      phosphor="DotsThreeIcon"
                      remixicon="RiMoreLine"
                    />
                    <span className="sr-only">Open menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Restock</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
