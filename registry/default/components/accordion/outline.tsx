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
        <AccordionContent>Developers looking to save time with pre-built CRUD solutions.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="reui-3">
        <AccordionTrigger>Why choose ReUI?</AccordionTrigger>
        <AccordionContent>ReUI simplifies development with plug-and-play CRUDs.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
