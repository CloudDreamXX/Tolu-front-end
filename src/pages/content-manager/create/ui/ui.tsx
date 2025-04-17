import { Send } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "shared/ui/breadcrumb";
import { Button } from "shared/ui/button";
import { Textarea } from "shared/ui/textarea";
import { PopoverClient } from "./popover-client";
import { PopoverFolder } from "./popover-folder";
import { PopoverAttach } from "./popover-attach";
import { PopoverInstruction } from "./popover-instruction";

export const ContentManagerCreatePage: React.FC = () => {
  return (
    <div className="flex flex-col gap-2 px-12 py-6">
      <Breadcrumb className="flex flex-row gap-2 text-sm text-muted-foreground">
        <BreadcrumbLink href="/content-manager">AI-Generated</BreadcrumbLink>
        <BreadcrumbSeparator />
        <BreadcrumbItem>Untitled</BreadcrumbItem>
      </Breadcrumb>
      <h1 className="text-4xl font-semibold text-center">
        Hi, how can I help you?
      </h1>
      <div className="flex flex-col gap-6 pt-6">
        <Textarea
          placeholder="Let's start with a subject or writing request..."
          className="h-20 text-lg font-medium text-gray-900 resize-none placeholder:text-gray-500 border-[#008FF6] rounded-t-3xl"
          footer={
            <div className="flex flex-row w-full gap-[10px]">
              <PopoverClient />
              <PopoverFolder />
              <Button
                variant="black"
                className="ml-auto w-12 h-12 p-[10px] rounded-full"
              >
                <Send color="#fff" />
              </Button>
            </div>
          }
          footerClassName="rounded-b-3xl border-[#008FF6] border-t-0"
        />
        <div className="flex flex-row gap-6">
          <PopoverAttach />
          <PopoverInstruction />
        </div>
      </div>
    </div>
  );
};
