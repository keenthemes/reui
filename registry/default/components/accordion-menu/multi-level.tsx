'use client';

import {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuIndicator,
  AccordionMenuItem,
  AccordionMenuLabel,
  AccordionMenuSeparator,
  AccordionMenuSub,
  AccordionMenuSubContent,
  AccordionMenuSubTrigger,
} from '@/registry/default/ui/accordion-menu';
import { Alert, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { Badge } from '@/registry/default/ui/badge';
import { RiCheckboxCircleFill } from '@remixicon/react';
import {
  Activity,
  Clipboard,
  LifeBuoy,
  Package,
  Settings,
  Settings2,
  ShoppingBag,
  Smartphone,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

// ...other imports and code remain unchanged

export default function AccordionMenuDemo() {
  return (
    <div className="w-full md:w-[250px] overflow-hidden border border-border rounded-md p-2">
      <AccordionMenu
        type="multiple"
        defaultValue={['products']}
        selectedValue="androidPhones"
        classNames={{
          separator: '-mx-2 mb-2.5',
        }}
      >
        {/* Main Navigation Label */}
        <AccordionMenuLabel>Main Navigation</AccordionMenuLabel>
        <AccordionMenuSeparator />

        <AccordionMenuGroup>
          {/* Level 1: Dashboard (single item) */}
          <AccordionMenuItem
            value="dashboard"
            onClick={() =>
              toast.custom((t) => (
                <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                  <AlertIcon>
                    <RiCheckboxCircleFill />
                  </AlertIcon>
                  <AlertTitle>Dashboard clicked</AlertTitle>
                </Alert>
              ))
            }
          >
            <User />
            <span>Dashboard</span>
          </AccordionMenuItem>

          {/* Level 1: Products (submenu) */}
          <AccordionMenuSub value="products">
            <AccordionMenuSubTrigger>
              <ShoppingBag />
              <span>Products</span>
              <AccordionMenuIndicator />
            </AccordionMenuSubTrigger>
            <AccordionMenuSubContent type="multiple" defaultValue="electronics" parentValue="products">
              <AccordionMenuGroup>
                {/* Level 2: Electronics */}
                <AccordionMenuSub value="electronics">
                  <AccordionMenuSubTrigger>
                    <Smartphone />
                    <span>Electronics</span>
                    <AccordionMenuIndicator />
                  </AccordionMenuSubTrigger>
                  <AccordionMenuSubContent type="multiple" defaultValue="mobilePhones" parentValue="electronics">
                    <AccordionMenuGroup>
                      {/* Level 3: Mobile Phones (no icon) */}
                      <AccordionMenuSub value="mobilePhones">
                        <AccordionMenuSubTrigger>
                          <span>Mobile Phones</span>
                          <AccordionMenuIndicator />
                        </AccordionMenuSubTrigger>
                        <AccordionMenuSubContent type="multiple" parentValue="mobilePhones">
                          <AccordionMenuGroup>
                            {/* Level 4: End Options (no icons, some with badges) */}
                            <AccordionMenuItem
                              value="androidPhones"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Android Phones clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Android</span>
                              <AccordionMenuIndicator>
                                <Badge variant="primary" appearance="outline" shape="circle" size="sm">
                                  New
                                </Badge>
                              </AccordionMenuIndicator>
                            </AccordionMenuItem>
                            <AccordionMenuItem
                              value="androidAccessories"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Accessories clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Accessories</span>
                            </AccordionMenuItem>
                          </AccordionMenuGroup>
                        </AccordionMenuSubContent>
                      </AccordionMenuSub>

                      {/* Level 3: Laptops (no icon) */}
                      <AccordionMenuSub value="laptops">
                        <AccordionMenuSubTrigger>
                          <span>Laptops</span>
                          <AccordionMenuIndicator />
                        </AccordionMenuSubTrigger>
                        <AccordionMenuSubContent type="multiple" parentValue="laptops">
                          <AccordionMenuGroup>
                            {/* Level 4: Gaming Laptops */}
                            <AccordionMenuItem
                              value="gamingLaptops"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Gaming Laptops clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Gaming Laptops</span>
                            </AccordionMenuItem>
                            {/* Level 4: Ultrabooks with badge */}
                            <AccordionMenuItem
                              value="ultrabooks"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Ultrabooks clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Ultrabooks</span>
                              <AccordionMenuIndicator>
                                <Badge variant="primary" appearance="outline" size="sm">
                                  Hot
                                </Badge>
                              </AccordionMenuIndicator>
                            </AccordionMenuItem>
                          </AccordionMenuGroup>
                        </AccordionMenuSubContent>
                      </AccordionMenuSub>
                    </AccordionMenuGroup>
                  </AccordionMenuSubContent>
                </AccordionMenuSub>

                {/* Level 2: Apparel */}
                <AccordionMenuSub value="apparel">
                  <AccordionMenuSubTrigger>
                    <Package />
                    <span>Apparel</span>
                    <AccordionMenuIndicator />
                  </AccordionMenuSubTrigger>
                  <AccordionMenuSubContent type="multiple" parentValue="apparel">
                    <AccordionMenuGroup>
                      {/* Level 3: Men (no icon) */}
                      <AccordionMenuSub value="men">
                        <AccordionMenuSubTrigger>
                          <span>Men</span>
                          <AccordionMenuIndicator />
                        </AccordionMenuSubTrigger>
                        <AccordionMenuSubContent type="multiple" parentValue="men">
                          <AccordionMenuGroup>
                            {/* Level 4: T-Shirts */}
                            <AccordionMenuItem
                              value="mensTShirts"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Men T-Shirts clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>T-Shirts</span>
                            </AccordionMenuItem>
                            {/* Level 4: Jeans with badge */}
                            <AccordionMenuItem
                              value="mensJeans"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Men Jeans clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Jeans</span>
                              <AccordionMenuIndicator>
                                <Badge variant="destructive" size="sm">
                                  Sale
                                </Badge>
                              </AccordionMenuIndicator>
                            </AccordionMenuItem>
                          </AccordionMenuGroup>
                        </AccordionMenuSubContent>
                      </AccordionMenuSub>

                      {/* Level 3: Women (no icon) */}
                      <AccordionMenuSub value="women">
                        <AccordionMenuSubTrigger>
                          <span>Women</span>
                          <AccordionMenuIndicator />
                        </AccordionMenuSubTrigger>
                        <AccordionMenuSubContent type="multiple" parentValue="women">
                          <AccordionMenuGroup>
                            {/* Level 4: Dresses */}
                            <AccordionMenuItem
                              value="dresses"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Dresses clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Dresses</span>
                            </AccordionMenuItem>
                            {/* Level 4: Shoes with badge */}
                            <AccordionMenuItem
                              value="shoes"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Shoes clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Shoes</span>
                              <AccordionMenuIndicator>
                                <Badge variant="primary" size="sm">
                                  New
                                </Badge>
                              </AccordionMenuIndicator>
                            </AccordionMenuItem>
                          </AccordionMenuGroup>
                        </AccordionMenuSubContent>
                      </AccordionMenuSub>
                    </AccordionMenuGroup>
                  </AccordionMenuSubContent>
                </AccordionMenuSub>
              </AccordionMenuGroup>
            </AccordionMenuSubContent>
          </AccordionMenuSub>

          {/* Level 1: Services */}
          <AccordionMenuSub value="services">
            <AccordionMenuSubTrigger>
              <Activity />
              <span>Services</span>
              <AccordionMenuIndicator />
            </AccordionMenuSubTrigger>
            <AccordionMenuSubContent type="multiple" parentValue="services">
              <AccordionMenuGroup>
                {/* Level 2: Consulting */}
                <AccordionMenuSub value="consulting">
                  <AccordionMenuSubTrigger>
                    <Clipboard />
                    <span>Consulting</span>
                    <AccordionMenuIndicator />
                  </AccordionMenuSubTrigger>
                  <AccordionMenuSubContent type="multiple" parentValue="consulting">
                    <AccordionMenuGroup>
                      {/* Level 3: Business Consulting (no icon) */}
                      <AccordionMenuSub value="businessConsulting">
                        <AccordionMenuSubTrigger>
                          <span>Business Consulting</span>
                          <AccordionMenuIndicator />
                        </AccordionMenuSubTrigger>
                        <AccordionMenuSubContent type="multiple" parentValue="businessConsulting">
                          <AccordionMenuGroup>
                            {/* Level 4: Options */}
                            <AccordionMenuItem
                              value="strategy"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Strategy clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Strategy</span>
                            </AccordionMenuItem>
                            <AccordionMenuItem
                              value="operations"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Operations clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Operations</span>
                              <AccordionMenuIndicator>
                                <Badge variant="info" size="sm">
                                  Top
                                </Badge>
                              </AccordionMenuIndicator>
                            </AccordionMenuItem>
                          </AccordionMenuGroup>
                        </AccordionMenuSubContent>
                      </AccordionMenuSub>

                      {/* Level 3: IT Consulting (no icon) */}
                      <AccordionMenuSub value="itConsulting">
                        <AccordionMenuSubTrigger>
                          <span>IT Consulting</span>
                          <AccordionMenuIndicator />
                        </AccordionMenuSubTrigger>
                        <AccordionMenuSubContent type="multiple" parentValue="itConsulting">
                          <AccordionMenuGroup>
                            {/* Level 4: Options */}
                            <AccordionMenuItem
                              value="cloudServices"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Cloud Services clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Cloud Services</span>
                            </AccordionMenuItem>
                            <AccordionMenuItem
                              value="cybersecurity"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Cybersecurity clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Cybersecurity</span>
                            </AccordionMenuItem>
                          </AccordionMenuGroup>
                        </AccordionMenuSubContent>
                      </AccordionMenuSub>
                    </AccordionMenuGroup>
                  </AccordionMenuSubContent>
                </AccordionMenuSub>

                {/* Level 2: Support under Services */}
                <AccordionMenuSub value="supportServices">
                  <AccordionMenuSubTrigger>
                    <LifeBuoy />
                    <span>Support</span>
                    <AccordionMenuIndicator />
                  </AccordionMenuSubTrigger>
                  <AccordionMenuSubContent type="multiple" parentValue="supportServices">
                    <AccordionMenuGroup>
                      {/* Level 3: Technical Support (no icon) */}
                      <AccordionMenuSub value="technicalSupport">
                        <AccordionMenuSubTrigger>
                          <span>Technical Support</span>
                          <AccordionMenuIndicator />
                        </AccordionMenuSubTrigger>
                        <AccordionMenuSubContent type="multiple" parentValue="technicalSupport">
                          <AccordionMenuGroup>
                            {/* Level 4: Options */}
                            <AccordionMenuItem
                              value="helpdesk"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Helpdesk clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Helpdesk</span>
                            </AccordionMenuItem>
                            <AccordionMenuItem
                              value="remoteAssistance"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Remote Assistance clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Remote Assistance</span>
                              <AccordionMenuIndicator>
                                <Badge variant="destructive" size="sm">
                                  New
                                </Badge>
                              </AccordionMenuIndicator>
                            </AccordionMenuItem>
                          </AccordionMenuGroup>
                        </AccordionMenuSubContent>
                      </AccordionMenuSub>

                      {/* Level 3: Customer Support (no icon) */}
                      <AccordionMenuSub value="customerSupport">
                        <AccordionMenuSubTrigger>
                          <span>Customer Support</span>
                          <AccordionMenuIndicator />
                        </AccordionMenuSubTrigger>
                        <AccordionMenuSubContent type="multiple" parentValue="customerSupport">
                          <AccordionMenuGroup>
                            {/* Level 4: Options */}
                            <AccordionMenuItem
                              value="faq"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>FAQ clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>FAQ</span>
                            </AccordionMenuItem>
                            <AccordionMenuItem
                              value="contactSupport"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Contact Support clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Contact Support</span>
                              <AccordionMenuIndicator>
                                <Badge variant="primary" size="sm">
                                  Hot
                                </Badge>
                              </AccordionMenuIndicator>
                            </AccordionMenuItem>
                          </AccordionMenuGroup>
                        </AccordionMenuSubContent>
                      </AccordionMenuSub>
                    </AccordionMenuGroup>
                  </AccordionMenuSubContent>
                </AccordionMenuSub>
              </AccordionMenuGroup>
            </AccordionMenuSubContent>
          </AccordionMenuSub>

          {/* Level 1: Settings */}
          <AccordionMenuSub value="settings">
            <AccordionMenuSubTrigger>
              <Settings />
              <span>Settings</span>
              <AccordionMenuIndicator />
            </AccordionMenuSubTrigger>
            <AccordionMenuSubContent type="multiple" parentValue="settings">
              <AccordionMenuGroup>
                {/* Level 2: Account Settings */}
                <AccordionMenuSub value="account">
                  <AccordionMenuSubTrigger>
                    <User />
                    <span>Account</span>
                    <AccordionMenuIndicator />
                  </AccordionMenuSubTrigger>
                  <AccordionMenuSubContent type="multiple" parentValue="account">
                    <AccordionMenuGroup>
                      {/* Level 3: Profile (no icon) */}
                      <AccordionMenuSub value="profile">
                        <AccordionMenuSubTrigger>
                          <span>Profile</span>
                          <AccordionMenuIndicator />
                        </AccordionMenuSubTrigger>
                        <AccordionMenuSubContent type="multiple" parentValue="profile">
                          <AccordionMenuGroup>
                            {/* Level 4: End Options */}
                            <AccordionMenuItem
                              value="editProfile"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Edit Profile clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Edit Profile</span>
                            </AccordionMenuItem>
                            <AccordionMenuItem
                              value="changePassword"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Change Password clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Change Password</span>
                            </AccordionMenuItem>
                          </AccordionMenuGroup>
                        </AccordionMenuSubContent>
                      </AccordionMenuSub>

                      {/* Level 3: Billing (no icon) */}
                      <AccordionMenuSub value="billing">
                        <AccordionMenuSubTrigger>
                          <span>Billing</span>
                          <AccordionMenuIndicator />
                        </AccordionMenuSubTrigger>
                        <AccordionMenuSubContent type="multiple" parentValue="billing">
                          <AccordionMenuGroup>
                            {/* Level 4: Payment Methods */}
                            <AccordionMenuItem
                              value="paymentMethods"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Payment Methods clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Payment Methods</span>
                            </AccordionMenuItem>
                            {/* Level 4: Invoices with badge */}
                            <AccordionMenuItem
                              value="invoices"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Invoices clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Invoices</span>
                              <AccordionMenuIndicator>
                                <Badge variant="info" size="sm">
                                  5
                                </Badge>
                              </AccordionMenuIndicator>
                            </AccordionMenuItem>
                          </AccordionMenuGroup>
                        </AccordionMenuSubContent>
                      </AccordionMenuSub>
                    </AccordionMenuGroup>
                  </AccordionMenuSubContent>
                </AccordionMenuSub>

                {/* Level 2: Misc Settings (with icon in item) */}
                <AccordionMenuItem
                  value="miscSettings"
                  onClick={() =>
                    toast.custom((t) => (
                      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                        <AlertIcon>
                          <RiCheckboxCircleFill />
                        </AlertIcon>
                        <AlertTitle>Misc Settings clicked</AlertTitle>
                      </Alert>
                    ))
                  }
                >
                  <Settings2 />
                  <span>Misc Settings</span>
                </AccordionMenuItem>
              </AccordionMenuGroup>
            </AccordionMenuSubContent>
          </AccordionMenuSub>

          {/* Level 1: Support */}
          <AccordionMenuSub value="support">
            <AccordionMenuSubTrigger>
              <LifeBuoy />
              <span>Support</span>
              <AccordionMenuIndicator />
            </AccordionMenuSubTrigger>
            <AccordionMenuSubContent type="multiple" parentValue="support">
              <AccordionMenuGroup>
                {/* Level 2: FAQ */}
                <AccordionMenuSub value="faq">
                  <AccordionMenuSubTrigger>
                    <Activity />
                    <span>FAQ</span>
                    <AccordionMenuIndicator />
                  </AccordionMenuSubTrigger>
                  <AccordionMenuSubContent type="multiple" parentValue="faq">
                    <AccordionMenuGroup>
                      {/* Level 3: General FAQ (no icon) */}
                      <AccordionMenuSub value="generalFAQ">
                        <AccordionMenuSubTrigger>
                          <span>General FAQ</span>
                          <AccordionMenuIndicator />
                        </AccordionMenuSubTrigger>
                        <AccordionMenuSubContent type="multiple" parentValue="generalFAQ">
                          <AccordionMenuGroup>
                            {/* Level 4: End Options */}
                            <AccordionMenuItem
                              value="howToUse"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>How To Use clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>How To Use</span>
                            </AccordionMenuItem>
                            <AccordionMenuItem
                              value="contactFAQ"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Contact FAQ clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Contact FAQ</span>
                              <AccordionMenuIndicator>
                                <Badge variant="primary" size="sm">
                                  New
                                </Badge>
                              </AccordionMenuIndicator>
                            </AccordionMenuItem>
                          </AccordionMenuGroup>
                        </AccordionMenuSubContent>
                      </AccordionMenuSub>

                      {/* Level 3: Technical FAQ (no icon) */}
                      <AccordionMenuSub value="technicalFAQ">
                        <AccordionMenuSubTrigger>
                          <span>Technical FAQ</span>
                          <AccordionMenuIndicator />
                        </AccordionMenuSubTrigger>
                        <AccordionMenuSubContent type="multiple" parentValue="technicalFAQ">
                          <AccordionMenuGroup>
                            {/* Level 4: End Options */}
                            <AccordionMenuItem
                              value="systemRequirements"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>System Requirements clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>System Requirements</span>
                            </AccordionMenuItem>
                            <AccordionMenuItem
                              value="troubleshooting"
                              onClick={() =>
                                toast.custom((t) => (
                                  <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                                    <AlertIcon>
                                      <RiCheckboxCircleFill />
                                    </AlertIcon>
                                    <AlertTitle>Troubleshooting clicked</AlertTitle>
                                  </Alert>
                                ))
                              }
                            >
                              <span>Troubleshooting</span>
                            </AccordionMenuItem>
                          </AccordionMenuGroup>
                        </AccordionMenuSubContent>
                      </AccordionMenuSub>
                    </AccordionMenuGroup>
                  </AccordionMenuSubContent>
                </AccordionMenuSub>

                {/* Level 2: Direct Contact */}
                <AccordionMenuItem
                  value="directContact"
                  onClick={() =>
                    toast.custom((t) => (
                      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                        <AlertIcon>
                          <RiCheckboxCircleFill />
                        </AlertIcon>
                        <AlertTitle>Direct Contact clicked</AlertTitle>
                      </Alert>
                    ))
                  }
                >
                  <User />
                  <span>Direct Contact</span>
                </AccordionMenuItem>
              </AccordionMenuGroup>
            </AccordionMenuSubContent>
          </AccordionMenuSub>
        </AccordionMenuGroup>
      </AccordionMenu>
    </div>
  );
}
