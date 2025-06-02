import { Button } from '@/registry/default/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/default/ui/dialog';
import { ScrollArea } from '@/registry/default/ui/scroll-area';
import { useDirection } from '@radix-ui/react-direction';

export default function DialogDemo() {
  const direction = useDirection();

  const faqSections = [
    {
      title: 'Account Management',
      content:
        'Navigate to the registration page, provide the required information, and verify your email address. You can sign up using your email or through social media platforms.',
    },
    {
      title: 'Payment and Billing',
      content:
        'We accept all major credit cards, PayPal, and bank transfers. If you face issues, check your payment details or contact our support team.',
    },
    {
      title: 'Subscription Plans',
      content:
        'Choose a plan that fits your needs. Upgrade, downgrade, or cancel at any time from the subscription settings page in your account.',
    },
    {
      title: 'Technical Support',
      content:
        'Our support team is available 24/7 via live chat or email. Check our Help Center for troubleshooting guides and tips.',
    },
    {
      title: 'Privacy and Security',
      content:
        'Your data is encrypted and stored securely. We comply with GDPR and other privacy regulations to protect your information.',
    },
    {
      title: 'Feature Requests',
      content:
        'Got ideas for new features? Submit your request via the feedback form in the app or reach out to us directly.',
    },
    {
      title: 'Refund Policy',
      content:
        "If you're not satisfied with your purchase, you can request a refund within 14 days. Please review our refund policy for more details.",
    },
    {
      title: 'Mobile App Support',
      content:
        'Our platform is fully compatible with iOS and Android devices. Download our app from the App Store or Google Play.',
    },
    {
      title: 'User Roles and Permissions',
      content:
        'Admins can assign roles and permissions to other users. These roles determine the level of access within the platform.',
    },
    {
      title: 'Data Export',
      content:
        'You can export your data at any time from the account settings page. Available formats include CSV and PDF.',
    },
    {
      title: 'Integration Options',
      content:
        'Our platform integrates with popular tools like Slack, Zapier, and Google Workspace. Check the integration settings for more details.',
    },
    {
      title: 'Two-Factor Authentication',
      content:
        'Enable two-factor authentication (2FA) for enhanced security. Visit your account settings to activate this feature.',
    },
    {
      title: 'Custom Branding',
      content:
        'Customize the platform with your brand colors, logo, and more. This feature is available in premium plans.',
    },
    {
      title: 'Learning Resources',
      content: 'Access tutorials, webinars, and guides in the Help Center to get the most out of our platform.',
    },
    {
      title: 'Account Recovery',
      content:
        "If you forget your password, click 'Forgot Password' on the login page to reset it. You can also contact support for assistance.",
    },
    {
      title: 'System Requirements',
      content:
        'Our platform supports the latest versions of Chrome, Firefox, Safari, and Edge. Ensure your browser is up to date for the best experience.',
    },
    {
      title: 'Trial Period',
      content:
        'We offer a 14-day free trial for new users. During this period, you can explore all premium features at no cost.',
    },
    {
      title: 'Data Backup',
      content:
        'Your data is automatically backed up daily to ensure it remains safe and recoverable in case of any issues.',
    },
    {
      title: 'Multi-Language Support',
      content:
        'Our platform is available in multiple languages. You can switch your preferred language in the account settings.',
    },
    {
      title: 'Notification Settings',
      content:
        'Manage your email and in-app notifications from the notification settings page. Customize what updates you want to receive.',
    },
    {
      title: 'Account Recovery',
      content:
        "If you forget your password, click 'Forgot Password' on the login page to reset it. You can also contact support for assistance.",
    },
    {
      title: 'System Requirements',
      content:
        'Our platform supports the latest versions of Chrome, Firefox, Safari, and Edge. Ensure your browser is up to date for the best experience.',
    },
    {
      title: 'Trial Period',
      content:
        'We offer a 14-day free trial for new users. During this period, you can explore all premium features at no cost.',
    },
    {
      title: 'Data Backup',
      content:
        'Your data is automatically backed up daily to ensure it remains safe and recoverable in case of any issues.',
    },
    {
      title: 'Multi-Language Support',
      content:
        'Our platform is available in multiple languages. You can switch your preferred language in the account settings.',
    },
    {
      title: 'Notification Settings',
      content:
        'Manage your email and in-app notifications from the notification settings page. Customize what updates you want to receive.',
    },
    {
      title: 'Account Recovery',
      content:
        "If you forget your password, click 'Forgot Password' on the login page to reset it. You can also contact support for assistance.",
    },
    {
      title: 'System Requirements',
      content:
        'Our platform supports the latest versions of Chrome, Firefox, Safari, and Edge. Ensure your browser is up to date for the best experience.',
    },
    {
      title: 'Trial Period',
      content:
        'We offer a 14-day free trial for new users. During this period, you can explore all premium features at no cost.',
    },
    {
      title: 'Data Backup',
      content:
        'Your data is automatically backed up daily to ensure it remains safe and recoverable in case of any issues.',
    },
    {
      title: 'Multi-Language Support',
      content:
        'Our platform is available in multiple languages. You can switch your preferred language in the account settings.',
    },
    {
      title: 'Notification Settings',
      content:
        'Manage your email and in-app notifications from the notification settings page. Customize what updates you want to receive.',
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </DialogTrigger>
      <DialogContent className="p-0" variant="fullscreen" dir={direction}>
        <DialogHeader className="pt-5 pb-3 m-0 border-b border-border">
          <DialogTitle className="px-6 text-base">Frequently Asked Questions(FAQ)</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="text-sm h-full my-3 ps-6 pe-5 me-1">
          <div className="space-y-4 [&_h3]:font-semibold [&_h3]:text-foreground">
            {faqSections.map((faq, index) => (
              <div key={index} className="text-accent-foreground space-y-1">
                <h3>{faq.title}</h3>
                <p>{faq.content}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter className="px-6 py-4 border-t border-border">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button">Ok</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
