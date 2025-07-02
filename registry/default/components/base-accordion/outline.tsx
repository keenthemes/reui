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
        <AccordionPanel>Developers looking to save time with pre-built CRUD solutions.</AccordionPanel>
      </AccordionItem>
      <AccordionItem value="reui-3">
        <AccordionHeader>
          <AccordionTrigger>Why choose ReUI?</AccordionTrigger>
        </AccordionHeader>
        <AccordionPanel>ReUI simplifies development with plug-and-play CRUDs.</AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
