import React, { useState } from "react";
import { AI_GENERATED_CONTENT } from "./mock";
import { useParams } from "react-router-dom";
import {
  DocumentClientInfo,
  DocumentFileInfo,
  DocumentFolderInfo,
  DocumentInstructionInfo,
  DocumentStatusProgress,
  IDocument,
  DocumentEditPopover,
} from "entities/document";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Button,
  ScrollArea,
  Textarea,
} from "shared/ui";

import { PopoverClient, PopoverFolder } from "widgets/content-popovers";
import { Dot, Send } from "lucide-react";

export const ContentManagerAiGeneratedDocument: React.FC = () => {
  const { documentId } = useParams();
  const [document] = useState<IDocument | null>(
    AI_GENERATED_CONTENT.find((doc) => doc.id === documentId) || null
  );

  if (!document) {
    return <div>Document not found</div>;
  }

  return (
    <div className="flex flex-col gap-2 px-[87px] py-6 bg-white h-[calc(100vh-78px)] w-full relative">
      <Textarea
        placeholder="Let's start with a subject or writing request..."
        containerClassName={
          "absolute bottom-8 left-[140px] w-[70%] bg-white z-10 rounded-3xl overflow-hidden border border-[#008FF6]"
        }
        className="h-20 text-lg font-medium text-gray-900 resize-none placeholder:text-gray-500"
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
      />
      <Breadcrumb className="flex flex-row gap-2 text-sm text-muted-foreground">
        <BreadcrumbLink href="/content-manager">AI-gen</BreadcrumbLink>
        <BreadcrumbSeparator />
        <BreadcrumbItem>{document.folder}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>{document.title}</BreadcrumbItem>
      </Breadcrumb>
      <div className="flex flex-row gap-[25px] h-full">
        <div className="flex flex-col w-full h-full max-h-full gap-2">
          <div className="flex flex-row gap-[41px] min-h-[50px] items-center">
            <DocumentFolderInfo
              folderId={document.folderId}
              folderName={document.folder}
            />
            <DocumentFileInfo files={document.attachedFiles} />
            <DocumentInstructionInfo instructions={document.instructions} />
            <DocumentClientInfo client={document.client} />
            <div className="ml-auto">
              <DocumentEditPopover />
            </div>
          </div>
          <div className="flex flex-row h-full gap-16">
            <DocumentStatusProgress status={document.status} />
            <ScrollArea className="h-[calc(100%-64px)] pt-6">
              <h1 className="mb-6 text-3xl font-bold">{document.title}</h1>
              <h2 className="mb-4 text-2xl font-bold">What to Know</h2>
              <p className="mb-4 text-lg font-medium text-muted-foreground">
                Menopause is a natural biological process that marks the end of
                a woman's menstrual cycles, typically occurring between ages 45
                and 55. It is diagnosed after 12 consecutive months without a
                period. The transition, known as perimenopause, can last several
                years and comes with various symptoms due to hormonal changes,
                primarily a decline in estrogen and progesterone.
              </p>
              <h2 className="mb-4 text-2xl font-bold">
                Common Symptoms of Menopause:
              </h2>
              <h2 className="mb-4 text-xl font-bold">
                1. Irregular Menstrual Cycles{" "}
              </h2>
              <p className="mb-4 text-lg font-medium text-muted-foreground">
                One of the earliest signs of perimenopause is a change in
                menstrual patterns. Women may experience:
              </p>
              <ul className="mb-4 list-disc list-inside">
                <li className="text-lg font-medium text-muted-foreground">
                  <Dot className="inline-block mr-2" />
                  Longer or shorter cycles (e.g., periods every 21 days instead
                  of 28 or skipping months entirely).
                </li>
                <li className="text-lg font-medium text-muted-foreground">
                  <Dot className="inline-block mr-2" />
                  Changes in flow (lighter or heavier periods).
                </li>
                <li className="text-lg font-medium text-muted-foreground">
                  <Dot className="inline-block mr-2" />
                  Breakthrough bleeding (spotting between periods).
                </li>
                <li className="text-lg font-medium text-muted-foreground">
                  <Dot className="inline-block mr-2" />
                  Eventually, periods stop completely as the ovaries cease egg
                  production.
                </li>
              </ul>
              <h2 className="mb-4 text-xl font-bold">
                2. Hot Flashes and Night Sweats{" "}
              </h2>
              <p className="mb-4 text-lg font-medium text-muted-foreground">
                Hot flashes are among the most well-known menopause symptoms,
                affecting up to 80% of women. They involve:
              </p>
              <ul className="pb-32">
                <li className="text-lg font-medium text-muted-foreground">
                  <Dot className="inline-block mr-2" />A sudden feeling of heat,
                  often in the chest, face, and neck.
                </li>
                <li className="text-lg font-medium text-muted-foreground">
                  <Dot className="inline-block mr-2" />
                  Flushed skin, sometimes accompanied by sweating.
                </li>
                <li className="text-lg font-medium text-muted-foreground">
                  <Dot className="inline-block mr-2" />
                  Flushed skin, sometimes accompanied by sweating.
                </li>{" "}
                <li className="text-lg font-medium text-muted-foreground">
                  <Dot className="inline-block mr-2" />
                  Flushed skin, sometimes accompanied by sweating.
                </li>{" "}
                <li className="text-lg font-medium text-muted-foreground">
                  <Dot className="inline-block mr-2" />
                  Flushed skin, sometimes accompanied by sweating.
                </li>{" "}
                <li className="text-lg font-medium text-muted-foreground">
                  <Dot className="inline-block mr-2" />
                  Flushed skin, sometimes accompanied by sweating.
                </li>{" "}
                <li className="text-lg font-medium text-muted-foreground">
                  <Dot className="inline-block mr-2" />
                  Flushed skin, sometimes accompanied by sweating.
                </li>{" "}
                <li className="text-lg font-medium text-muted-foreground">
                  <Dot className="inline-block mr-2" />
                  Flushed skin, sometimes accompanied by sweating.
                </li>{" "}
                <li className="text-lg font-medium text-muted-foreground">
                  <Dot className="inline-block mr-2" />
                  Flushed skin, sometimes accompanied by sweating.
                </li>{" "}
                <li className="text-lg font-medium text-muted-foreground">
                  <Dot className="inline-block mr-2" />
                  Flushed skin, sometimes accompanied by sweating.
                </li>
              </ul>
            </ScrollArea>
          </div>
        </div>
        <div className="pt-[75px] w-full max-w-[196px] bg-[#F9FAFB] h-full px-0.5">
          <h3 className="text-lg font-semibold px-[22px] pb-[15px] border-b border-[#008FF6] border-opacity-20">
            User Engagement
          </h3>
          <div className="py-[23px] px-[31px] flex flex-col gap-5">
            <div className="flex flex-col">
              <h5 className="text-sm font-semibold">Revenue generated</h5>
              <p className="text-2xl font-bold">
                {document.userEngagement?.revenue ?? "--"}
              </p>
            </div>
            <div className="flex flex-col">
              <h5 className="text-sm font-semibold">Read by users</h5>
              <p className="text-2xl font-bold">
                {document.userEngagement?.read ?? "--"}
              </p>
            </div>
            <div className="flex flex-col">
              <h5 className="text-sm font-semibold">Saved by users</h5>
              <p className="text-2xl font-bold">
                {document.userEngagement?.saved ?? "--"}
              </p>
            </div>
            <div className="flex flex-col">
              <h5 className="text-sm font-semibold">Feedback received</h5>
              <p className="text-2xl font-bold">
                {document.userEngagement?.feedback ?? "--"}
              </p>
            </div>
            <div className="flex flex-col">
              <h5 className="text-sm font-semibold">Comments</h5>
              <p className="text-2xl font-bold">
                {document.userEngagement?.comments ?? "--"}
              </p>
            </div>
            <div className="flex flex-col">
              <h5 className="text-sm font-semibold">Social media shares</h5>
              <p className="text-2xl font-bold">
                {document.userEngagement?.shares ?? "--"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
