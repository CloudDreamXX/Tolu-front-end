import React from "react";
import { ISessionResult } from "entities/coach";
import { Button } from "shared/ui";
import Star from "shared/assets/icons/grey-star";
import Bin from "shared/assets/icons/grey-bin";
import Arrow from "shared/assets/icons/grey-arrow";
import Folders from "shared/assets/icons/grey-folders";
import Edit from "shared/assets/icons/grey-edit";
import MarkAs from "shared/assets/icons/grey-mark-as";
import Dislike from "shared/assets/icons/dislike";
import Voiceover from "shared/assets/icons/voiceover";
import FilledStar from "shared/assets/icons/filled-star";

interface ConversationItemActionsProps {
  pair: ISessionResult;
  ratingsMap: Record<string, { rating: number; comment: string }>;
  compareIndex: number | null;
  index: number;
  isEditing: boolean;
  onCompareToggle: (index: number) => void;
  onEditToggle: (pair: ISessionResult, document: any) => void;
  onSaveEdit: (contentId: string) => Promise<void>;
  onCancelEdit: () => void;
  setSelectedDocumentId: (id: string) => void;
  setIsRateOpen: (open: boolean) => void;
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
  compareIndex,
  index,
  isEditing,
  onCompareToggle,
  onEditToggle,
  onSaveEdit,
  onCancelEdit,
  setSelectedDocumentId,
  setIsRateOpen,
  setIsBadResponseOpen,
  setIsDeleteOpen,
  setIsMoveOpen,
  handleDublicateClick,
  handleMarkAsClick,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="relative flex items-center">
        <button
          className="p-[5px] md:p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"
          onClick={() => {
            setSelectedDocumentId(pair.id);
            setIsRateOpen(true);
          }}
        >
          {!ratingsMap[pair.id] ? <Star /> : <FilledStar />}
        </button>

        <button
          className="p-[5px] md:p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"
          onClick={() => onEditToggle(pair, null)}
        >
          <Edit />
        </button>

        <button
          className="p-[5px] md:p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"
          onClick={() => {
            setSelectedDocumentId(pair.id);
            setIsMoveOpen(true);
          }}
        >
          <Arrow />
        </button>

        <button
          className="p-[5px] md:p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"
          onClick={() => handleDublicateClick(pair.id)}
        >
          <Folders />
        </button>

        <button
          className="p-[5px] md:p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"
          onClick={() => handleMarkAsClick(pair.id)}
        >
          <MarkAs />
        </button>

        <button className="p-[5px] md:p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]">
          <Voiceover />
        </button>

        <button
          className="p-[5px] md:p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"
          onClick={() => {
            setSelectedDocumentId(pair.id);
            setIsBadResponseOpen(true);
          }}
        >
          <Dislike />
        </button>

        <button
          className="p-[5px] md:p-[8px] rounded-[8px] hover:text-[#1C63DB] text-[#5F5F65] hover:bg-[#EDF3FF]"
          onClick={() => {
            setSelectedDocumentId(pair.id);
            setIsDeleteOpen(true);
          }}
        >
          <Bin />
        </button>

        <button
          onClick={() => onCompareToggle(index)}
          className="py-[4px] px-[10px] rounded-[8px] text-[18px] text-[#5F5F65] ml-[16px] md:ml-[24px] hover:bg-[#EDF3FF] hover:text-[#1C63DB]"
        >
          {compareIndex === index ? "Return" : "Compare"}
        </button>
      </div>

      {isEditing && (
        <div className="flex gap-[8px]">
          <Button
            variant="secondary"
            className="text-[#1C63DB] text-[16px] font-semibold"
            onClick={onCancelEdit}
          >
            Cancel
          </Button>
          <Button
            variant="brightblue"
            className="font-semibold text-[16px]"
            onClick={() => onSaveEdit(pair.id)}
          >
            Save changes
          </Button>
        </div>
      )}
    </div>
  );
};
