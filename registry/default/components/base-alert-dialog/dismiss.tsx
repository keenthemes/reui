import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/registry/default/ui/base-alert-dialog';
import { Button } from '@/registry/default/ui/base-button';
import { Bell } from 'lucide-react';

export default function BaseAlertDialogDismiss() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline">Show dialog</Button>} />
      <AlertDialogContent showDismissButton={true}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Bell className="size-5 text-muted-foreground" />
            Important Notice
          </AlertDialogTitle>
          <AlertDialogDescription>
            This is a general notice dialog that can be used to display important information, updates, or announcements
            to users.
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
