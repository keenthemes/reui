'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/default/ui/avatar';
// Assuming you have Avatar components
import { Badge } from '@/registry/default/ui/badge'; // Assuming you have a Badge component
import { Button } from '@/registry/default/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTitle,
  CardToolbar,
} from '@/registry/default/ui/card';
import { Settings } from 'lucide-react';

// User data
const users = [
  {
    id: '1',
    name: 'Kathryn Campbell',
    availability: 'online',
    avatar: '1.png',
    status: 'active',
    email: 'kathryn@apple.com',
  },
  {
    id: '2',
    name: 'Robert Smith',
    availability: 'away',
    avatar: '2.png',
    status: 'inactive',
    email: 'robert@openai.com',
  },
  {
    id: '3',
    name: 'Sophia Johnson',
    availability: 'busy',
    avatar: '3.png',
    status: 'active',
    email: 'sophia@meta.com',
  },
  {
    id: '4',
    name: 'Lucas Walker',
    availability: 'offline',
    avatar: '4.png',
    status: 'inactive',
    flag: '🇦🇺',
    email: 'lucas@tesla.com',
  },
  {
    id: '5',
    name: 'Emily Davis',
    availability: 'online',
    avatar: '5.png',
    status: 'active',
    email: 'emily@sap.com',
  },
];

export default function CardDemo() {
  return (
    <Card className="w-[400px]" variant="accent">
      <CardHeader>
        <CardHeading>
          <CardTitle>Recent Users</CardTitle>
        </CardHeading>
        <CardToolbar>
          <Button mode="icon" variant="outline" size="sm">
            <Settings />
          </Button>
        </CardToolbar>
      </CardHeader>
      <CardContent className="py-1">
        {users.map((user) => {
          return (
            <div
              key={user.id}
              className="flex items-center justify-between gap-2 py-2 border-b border-dashed last:border-none"
            >
              {/* Left: Avatar and User Info */}
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage src={`/media/avatars/${user.avatar}`} alt={user.name} />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <div>
                  <Link href="#" className="text-sm font-medium text-foreground hover:text-primary">
                    {user.name}
                  </Link>
                  <div className="text-sm font-normal text-muted-foreground">{user.email}</div>
                </div>
              </div>
              {/* Right: Status Badge */}
              <Badge appearance="outline" variant={user.status === 'active' ? 'primary' : 'secondary'}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </Badge>
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="justify-center">
        <Button mode="link" underlined="dashed">
          <Link href="#">Learn more</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
