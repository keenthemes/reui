// Description: Table in card with status badges.
// Order: 3

import { Card, CardContent } from "@/registry/bases/base/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/bases/base/ui/table"

const tasks = [
  {
    id: "1",
    name: "Design homepage",
    status: "Completed",
    statusColor: "bg-green-500/10 text-green-700",
  },
  {
    id: "2",
    name: "Implement API",
    status: "In Progress",
    statusColor: "bg-yellow-500/10 text-yellow-700",
  },
  {
    id: "3",
    name: "Write tests",
    status: "Pending",
    statusColor: "bg-gray-500/10 text-gray-700",
  },
]

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col">
      <Card className="p-0">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.name}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${task.statusColor}`}
                    >
                      {task.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
