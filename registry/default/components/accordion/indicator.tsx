import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/registry/default/ui/accordion';

export default function AccordionDemo() {
  return (
    <Accordion type="single" collapsible indicator="plus" className="w-full lg:w-[75%]">
      <AccordionItem value="crudhunt-1">
        <AccordionTrigger>What is Crudhunt?</AccordionTrigger>
        <AccordionContent>Crudhunt provides ready-to-use CRUD examples for developers.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="crudhunt-2">
        <AccordionTrigger>Who benefits from Crudhunt?</AccordionTrigger>
        <AccordionContent>Developers looking to save time with pre-built CRUD solutions.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="crudhunt-3">
        <AccordionTrigger>Why choose Crudhunt?</AccordionTrigger>
        <AccordionContent>Crudhunt simplifies development with plug-and-play CRUDs.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
