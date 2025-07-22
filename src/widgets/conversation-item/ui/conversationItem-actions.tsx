import { ISessionResult } from "entities/coach";
import React from "react";
import Compare from "shared/assets/icons/compare";
import Dislike from "shared/assets/icons/dislike";
import Dublicate from "shared/assets/icons/dublicate";
import Arrow from "shared/assets/icons/grey-arrow";
import Edit from "shared/assets/icons/grey-edit";
import { TrashIcon } from "shared/assets/icons/trash-blue";
import Voiceover from "shared/assets/icons/voiceover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "shared/ui";

interface ConversationItemActionsProps {
  pair: ISessionResult;
  ratingsMap: Record<string, { rating: number; comment: string }>;
  index: number;
  onCompareToggle: (index: number) => void;
  onEditToggle: (pair: ISessionResult, document: any) => void;
  setSelectedDocumentId: (id: string) => void;
  setIsBadResponseOpen: (open: boolean) => void;
  setIsDeleteOpen: (open: boolean) => void;
  setIsMoveOpen: (open: boolean) => void;
  setIsMarkAsOpen: (open: boolean) => void;
  handleDublicateClick: (id: string) => Promise<void>;
  handleMarkAsClick: () => void;
  handleDelete: (id: string) => void;
}

export const ConversationItemActions: React.FC<
  ConversationItemActionsProps
> = ({
  pair,
  handleMarkAsClick,
  onEditToggle,
  setSelectedDocumentId,
  setIsBadResponseOpen,
  setIsMoveOpen,
  handleDublicateClick,
  setIsDeleteOpen,
}) => {
  return (
    <div className="flex md:flex-col items-start gap-2">
      <div className="relative flex md:flex-col items-center gap-2">
        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
                onClick={() => onEditToggle(pair, null)}
              >
                <Edit className="w-[16px] h-[16px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="z-50 py-[4px] px-[16px] w-fit text-[16px] font-semibold text-[#1D1D1F] ml-0"
            >
              Edit
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
                onClick={() => {
                  setSelectedDocumentId(pair.id);
                  setIsMoveOpen(true);
                }}
              >
                <Arrow className="w-[16px] h-[16px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="z-50 py-[4px] px-[16px] w-fit text-[16px] font-semibold text-[#1D1D1F] ml-0"
            >
              Move
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
                onClick={() => handleDublicateClick(pair.id)}
              >
                <Dublicate className="w-[16px] h-[16px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="z-50 py-[4px] px-[16px] w-fit text-[16px] font-semibold text-[#1D1D1F] ml-0"
            >
              Duplicate
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center">
                <Voiceover className="w-[16px] h-[16px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="z-50 py-[4px] px-[16px] w-fit text-[16px] font-semibold text-[#1D1D1F] ml-0"
            >
              Read aloud
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
                onClick={() => {
                  setSelectedDocumentId(pair.id);
                  setIsBadResponseOpen(true);
                }}
              >
                <Dislike className="w-[16px] h-[16px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="z-50 py-[4px] px-[16px] w-fit text-[16px] font-semibold text-[#1D1D1F] ml-0"
            >
              Bad response
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  setSelectedDocumentId(pair.id);
                  setIsDeleteOpen(true);
                }}
                className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
              >
                <TrashIcon width={16} height={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="z-50 py-[4px] px-[16px] w-fit text-[16px] font-semibold text-[#1D1D1F] ml-0"
            >
              Delete
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleMarkAsClick()}
                className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
              >
                <Compare />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="z-50 py-[4px] px-[16px] w-fit text-[16px] font-semibold text-[#1D1D1F] ml-0"
            >
              Mark as
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
