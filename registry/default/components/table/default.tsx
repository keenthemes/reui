import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/registry/default/ui/table';

const subscriptions = [
  {
    subscriptionId: 'SUB001',
    customerName: 'John Doe',
    plan: 'Pro',
    status: 'Active',
    renewalDate: '2024-02-15',
    amount: '$49.99',
  },
  {
    subscriptionId: 'SUB002',
    customerName: 'Jane Smith',
    plan: 'Basic',
    status: 'Cancelled',
    renewalDate: '2024-01-10',
    amount: '$19.99',
  },
  {
    subscriptionId: 'SUB003',
    customerName: 'Michael Brown',
    plan: 'Enterprise',
    status: 'Pending',
    renewalDate: '2024-03-01',
    amount: '$99.99',
  },
  {
    subscriptionId: 'SUB004',
    customerName: 'Emily Johnson',
    plan: 'Pro',
    status: 'Active',
    renewalDate: '2024-02-20',
    amount: '$49.99',
  },
  {
    subscriptionId: 'SUB005',
    customerName: 'David Wilson',
    plan: 'Basic',
    status: 'Active',
    renewalDate: '2024-02-05',
    amount: '$19.99',
  },
];

export default function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of your active and past subscriptions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">Ref ID</TableHead>
          <TableHead>Customer Name</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Renewal Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.map((sub) => (
          <TableRow key={sub.subscriptionId}>
            <TableCell className="font-medium">{sub.subscriptionId}</TableCell>
            <TableCell>{sub.customerName}</TableCell>
            <TableCell>{sub.plan}</TableCell>
            <TableCell>
              <span
                className={`${sub.status === 'Active' ? 'text-green-600' : sub.status === 'Cancelled' ? 'text-red-600' : 'text-yellow-600'}`}
              >
                {sub.status}
              </span>
            </TableCell>
            <TableCell>{sub.renewalDate}</TableCell>
            <TableCell className="text-right">{sub.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Total Revenue</TableCell>
          <TableCell className="text-right">
            {subscriptions
              .filter((sub) => sub.status === 'Active')
              .reduce((total, sub) => total + parseFloat(sub.amount.slice(1)), 0)
              .toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
              })}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
