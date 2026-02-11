// Description: Table with interactive elements.
// Order: 5

import { Card, CardContent } from "@/registry/bases/base/ui/card"
import { Input } from "@/registry/bases/base/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/bases/base/ui/table"

const items = [
  { id: "1", name: "Item Alpha", quantity: 1, price: "$10.00" },
  { id: "2", name: "Item Beta", quantity: 2, price: "$20.00" },
  { id: "3", name: "Item Gamma", quantity: 1, price: "$30.00" },
]

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col">
      <Card className="p-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      defaultValue={item.quantity}
                      className="h-8 w-20"
                      min="0"
                    />
                  </TableCell>
                  <TableCell className="text-right">{item.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
