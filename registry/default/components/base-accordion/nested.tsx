import { Accordion, AccordionPanel, AccordionItem, AccordionHeader, AccordionTrigger } from '@/registry/default/ui/base-accordion';

export default function Component() {
  return (
    <Accordion variant="outline" openMultiple={false} className="w-full lg:w-[75%]">
      <AccordionItem value="reui-1">
        <AccordionHeader>
          <AccordionTrigger>What is ReUI?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>ReUI provides ready-to-use CRUD examples for developers.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="reui-2">
        <AccordionHeader>
          <AccordionTrigger>Who benefits from ReUI?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          Developers looking to save time with pre-built CRUD solutions.
          <Accordion variant="outline" openMultiple={false} className="mt-4">
            <AccordionItem value="nested-1">
              <AccordionHeader>
                <AccordionTrigger>How does ReUI save time?</AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel>
                By providing ready-to-use examples that developers can plug into their projects.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem value="nested-2">
              <AccordionHeader>
                <AccordionTrigger>What makes ReUI unique?</AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel>
                ReUI offers optimized solutions that adapt to your backend with minimal setup.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </AccordionPanel>
      </AccordionItem>
      <AccordionItem value="reui-3">
        <AccordionHeader>
          <AccordionTrigger>Why choose ReUI?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>
          ReUI simplifies development with plug-and-play CRUDs.
          <Accordion variant="outline" openMultiple={false} className="mt-4">
            <AccordionItem value="nested-3">
              <AccordionHeader>
                <AccordionTrigger>What types of CRUDs are included?</AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel>Examples include user management, product catalogs, and more.</AccordionPanel>
            </AccordionItem>
            <AccordionItem value="nested-4">
              <AccordionHeader>
                <AccordionTrigger>Can I customize ReUI CRUDs?</AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel>
                Yes! ReUI CRUDs are fully customizable to suit your project&apos;s needs.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
