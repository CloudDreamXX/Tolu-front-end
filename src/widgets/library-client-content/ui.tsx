import { HealthHistoryService } from "entities/health-history";
import { LibraryCard } from "features/library-card";
import { useEffect, useState } from "react";
import Search from "shared/assets/icons/search";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Input,
} from "shared/ui";

export const LibraryClientContent = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col w-full">
      <Input
        placeholder="Search by name or content"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
        icon={<Search className="w-4 h-4" />}
        autoFocus
      />
      <Accordion
        type="single"
        collapsible
        className="w-full mt-4"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="pt-0">
            Chronic constipation relief
          </AccordionTrigger>
          <AccordionContent className="flex flex-row flex-wrap gap-4 pb-2">
            <LibraryCard
              title="Gut Reset"
              author="Jessica Gale MD CFNP"
              recomendedBy="TOLU"
              timestamp="3/12/25"
            />
            <LibraryCard
              title="Eating for Hormones"
              author="Jessica Gale MD CFNP"
              recomendedBy="TOLU"
              timestamp="3/12/25"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Accordion
        type="single"
        collapsible
        className="w-full mt-4"
        defaultValue="item-2"
      >
        <AccordionItem value="item-2">
          <AccordionTrigger className="pt-0">
            Personalized for you
          </AccordionTrigger>
          <AccordionContent className="flex flex-row flex-wrap gap-4 pb-2">
            <LibraryCard
              title="Sleep Disturbance"
              author="Jessica Gale MD CFNP"
              recomendedBy="TOLU"
              timestamp="3/12/25"
            />
            <LibraryCard
              title="Sleep Disturbance"
              author="Jessica Gale MD CFNP"
              recomendedBy="TOLU"
              timestamp="3/12/25"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
