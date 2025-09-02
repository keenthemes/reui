import { Badge } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardToolbar } from '@/registry/default/ui/card';
import { Globe, Mail, MapPin, Phone, Users } from 'lucide-react';

const customerData = {
  customerName: 'Sarah Mitchell',
  phone: '+(1)-555-0127',
  email: 'sarah.mitchell@outlook.com',
  website: 'sarahmitchell.design',
  address: {
    city: 'San Francisco',
    state: 'California',
    zipCode: '94102',
    country: 'United States',
  },
  socialPlatforms: [
    {
      name: 'LinkedIn',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg',
    },
    {
      name: 'Twitter',
      logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg',
    },
    {
      name: 'Behance',
      logo: 'https://cdn.worldvectorlogo.com/logos/behance-1.svg',
    },
  ],
};

export default function ListCard1() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 lg:p-8">
      <Card className="w-full md:max-w-md">
        <CardHeader className="border-0 py-5">
          <CardTitle>Customer Details</CardTitle>
          <CardToolbar>
            <Button variant="outline">Edit Customer</Button>
          </CardToolbar>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Phone Number */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-5">
              <Phone className="size-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between flex-1">
              <span className="text-sm text-muted-foreground font-medium">Phone Number</span>
              <Badge variant="primary" appearance="light">
                {customerData.phone}
              </Badge>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-5">
              <Mail className="size-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between flex-1">
              <span className="text-sm text-muted-foreground font-medium">Email</span>
              <Badge variant="primary" appearance="light">
                {customerData.email}
              </Badge>
            </div>
          </div>

          {/* Website */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-5">
              <Globe className="size-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between flex-1">
              <span className="text-sm text-muted-foreground font-medium">Website</span>
              <Badge variant="primary" appearance="light">
                {customerData.website}
              </Badge>
            </div>
          </div>

          {/* Social Platforms */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-5">
              <Users className="size-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between flex-1">
              <span className="text-sm text-muted-foreground font-medium">Social Platforms</span>
              <div className="flex items-center gap-2">
                {customerData.socialPlatforms.map((platform, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center w-8 h-8 bg-white border rounded overflow-hidden"
                  >
                    <img src={platform.logo} alt={platform.name} className="h-5 w-5 object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2.5">
            <div className="flex items-center justify-center size-5 mt-0.5">
              <MapPin className="size-4 text-muted-foreground" />
            </div>
            <div className="flex items-start justify-between flex-1">
              <span className="text-sm text-muted-foreground font-medium">Address</span>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  {customerData.address.city}, {customerData.address.state}
                </div>
                <div className="text-sm font-medium text-foreground">
                  {customerData.address.zipCode} {customerData.address.country}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
