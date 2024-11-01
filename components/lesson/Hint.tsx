import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Hint({ children }: { children: React.ReactNode }) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="hint-1">
        <AccordionTrigger>Hint</AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
