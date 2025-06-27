import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/registry/default/ui/accordion';

export default function AccordionDemo() {
  return (
    <Accordion type="single" variant="outline" collapsible className="w-full lg:w-[75%]">
      <AccordionItem value="reui-1">
        <AccordionTrigger>What is ReUI?</AccordionTrigger>
        <AccordionContent>ReUI provides ready-to-use CRUD examples for developers.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="reui-2">
        <AccordionTrigger>Who benefits from ReUI?</AccordionTrigger>
        <AccordionContent>
          Developers looking to save time with pre-built CRUD solutions.
          <Accordion type="single" variant="outline" collapsible className="mt-4">
            <AccordionItem value="nested-1">
              <AccordionTrigger>How does ReUI save time?</AccordionTrigger>
              <AccordionContent>
                By providing ready-to-use examples that developers can plug into their projects.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="nested-2">
              <AccordionTrigger>What makes ReUI unique?</AccordionTrigger>
              <AccordionContent>
                ReUI offers optimized solutions that adapt to your backend with minimal setup.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="reui-3">
        <AccordionTrigger>Why choose ReUI?</AccordionTrigger>
        <AccordionContent>
          ReUI simplifies development with plug-and-play CRUDs.
          <Accordion type="single" variant="outline" collapsible className="mt-4">
            <AccordionItem value="nested-3">
              <AccordionTrigger>What types of CRUDs are included?</AccordionTrigger>
              <AccordionContent>Examples include user management, product catalogs, and more.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="nested-4">
              <AccordionTrigger>Can I customize ReUI CRUDs?</AccordionTrigger>
              <AccordionContent>
                Yes! ReUI CRUDs are fully customizable to suit your project&apos;s needs.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
