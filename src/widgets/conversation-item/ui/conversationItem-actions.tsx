import { ISessionResult } from "entities/coach";
import React from "react";
import Compare from "shared/assets/icons/compare";
import Dislike from "shared/assets/icons/dislike";
import Dublicate from "shared/assets/icons/dublicate";
import Arrow from "shared/assets/icons/grey-arrow";
import Bin from "shared/assets/icons/grey-bin";
import Edit from "shared/assets/icons/grey-edit";
import MarkAs from "shared/assets/icons/grey-mark-as";
import Voiceover from "shared/assets/icons/voiceover";
import { RatePopup } from "widgets/RatePopup";

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
  handleDublicateClick: (id: string) => Promise<void>;
  handleMarkAsClick: (id: string) => void;
}

export const ConversationItemActions: React.FC<
  ConversationItemActionsProps
> = ({
  pair,
  ratingsMap,
  index,
  onCompareToggle,
  onEditToggle,
  setSelectedDocumentId,
  setIsBadResponseOpen,
  setIsDeleteOpen,
  setIsMoveOpen,
  handleDublicateClick,
  handleMarkAsClick,
}) => {
  const handleRateClick = async (
    id: string,
    rating: number,
    comment: string,
    down: boolean
  ) => {
    console.warn("Rate click not implemented", {
      id,
      rating,
      comment,
      down,
    });
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="relative flex flex-col items-center gap-2">
        <RatePopup
          contentId={pair.id}
          ratingsMap={ratingsMap}
          handleRateClick={handleRateClick}
        />

        <button
          className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
          onClick={() => onEditToggle(pair, null)}
        >
          <Edit />
        </button>

        <button
          className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
          onClick={() => {
            setSelectedDocumentId(pair.id);
            setIsMoveOpen(true);
          }}
        >
          <Arrow />
        </button>

        <button
          className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
          onClick={() => handleDublicateClick(pair.id)}
        >
          <Dublicate />
        </button>

        <button
          className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
          onClick={() => handleMarkAsClick(pair.id)}
        >
          <MarkAs />
        </button>

        <button className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center">
          <Voiceover />
        </button>

        <button
          className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
          onClick={() => {
            setSelectedDocumentId(pair.id);
            setIsBadResponseOpen(true);
          }}
        >
          <Dislike className="scale-x-[-1]" />
        </button>

        <button
          className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
          onClick={() => {
            setSelectedDocumentId(pair.id);
            setIsDeleteOpen(true);
          }}
        >
          <Bin />
        </button>

        <button
          onClick={() => onCompareToggle(index)}
          className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
        >
          <Compare />
        </button>
      </div>
    </div>
  );
};
