import React from "react";
import parse from "html-react-parser";
import { ISessionResult } from "entities/coach";
import { Button } from "shared/ui";
import { ConversationItemActions } from "./conversationItem-actions";
import BlueChevron from "shared/assets/icons/blue-chevron";

const isHtmlContent = (content: string): boolean => /<[^>]*>/.test(content);

interface ConversationItemProps {
  pair: ISessionResult;
  index: number;
  compareIndex: number | null;
  mobilePage: 1 | 2;
  isEditing: boolean;
  selectedDocumentId: string;
  editedTitle: string;
  editedQuery: string;
  editedContent: string;
  ratingsMap: Record<string, { rating: number; comment: string }>;
  conversation: ISessionResult[];
  onStatusComplete: (status: any, contentId: string) => Promise<void>;
  onCompareToggle: (index: number) => void;
  onEditToggle: (pair: ISessionResult, document: any) => void;
  onSaveEdit: (contentId: string) => Promise<void>;
  onCancelEdit: () => void;
  setMobilePage: (page: 1 | 2) => void;
  setSelectedDocumentId: (id: string) => void;
  setIsRateOpen: (open: boolean) => void;
  setIsBadResponseOpen: (open: boolean) => void;
  setIsDeleteOpen: (open: boolean) => void;
  setIsMoveOpen: (open: boolean) => void;
  setEditedTitle: (title: string) => void;
  setEditedQuery: (query: string) => void;
  setEditedContent: (content: string) => void;
  handleDublicateClick: (id: string) => Promise<void>;
  handleMarkAsClick: (id: string) => void;
  ReactQuill: any;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  pair,
  index,
  compareIndex,
  mobilePage,
  isEditing,
  selectedDocumentId,
  editedTitle,
  editedQuery,
  editedContent,
  ratingsMap,
  conversation,
  onStatusComplete,
  onCompareToggle,
  onEditToggle,
  onSaveEdit,
  onCancelEdit,
  setMobilePage,
  setSelectedDocumentId,
  setIsRateOpen,
  setIsBadResponseOpen,
  setIsDeleteOpen,
  setIsMoveOpen,
  setEditedTitle,
  setEditedQuery,
  setEditedContent,
  handleDublicateClick,
  handleMarkAsClick,
  ReactQuill,
}) => {
  const isHTML = isHtmlContent(pair.content);

  const renderCompareView = () => (
    <div className="flex-row block gap-4 md:flex">
      {/* Mobile paginated view */}
      <div className="block md:hidden">
        {mobilePage === 1 && (
          <div className="p-6 flex flex-col gap-[16px]">
            <div className="prose-sm prose max-w-none">
              {isHtmlContent(conversation[index - 1].content) ? (
                parse(conversation[index - 1].content)
              ) : (
                <div className="whitespace-pre-wrap">
                  {conversation[index - 1].content}
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-[8px] text-[#1C63DB]">
              <button
                onClick={() => setMobilePage(1)}
                disabled={mobilePage === 1}
              >
                <span>
                  <BlueChevron />
                </span>
              </button>

              <div className="text-[16px] font-[500]">{mobilePage}/2</div>

              <button onClick={() => setMobilePage(2)}>
                <span className="block transform rotate-180">
                  <BlueChevron />
                </span>
              </button>
            </div>

            <Button
              variant="brightblue"
              className="self-center w-fit"
              onClick={() =>
                onStatusComplete("Ready for Review", conversation[index - 1].id)
              }
            >
              Confirm and Mark as Ready for Review
            </Button>
          </div>
        )}

        {mobilePage === 2 && (
          <div className="p-6 flex flex-col gap-[16px]">
            <div className="prose-sm prose max-w-none">
              {isHtmlContent(pair.content) ? (
                parse(pair.content)
              ) : (
                <div className="whitespace-pre-wrap">{pair.content}</div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-[8px] text-[#1C63DB]">
              <button onClick={() => setMobilePage(1)}>
                <span>
                  <BlueChevron />
                </span>
              </button>

              <div className="text-[16px] font-[500]">{mobilePage}/2</div>

              <button
                onClick={() => setMobilePage(2)}
                disabled={mobilePage === 2}
              >
                <span className="block transform rotate-180">
                  <BlueChevron />
                </span>
              </button>
            </div>

            <Button
              variant="brightblue"
              className="self-center w-fit"
              onClick={() => onStatusComplete("Ready for Review", pair.id)}
            >
              Confirm and Mark as Ready for Review
            </Button>
          </div>
        )}
      </div>

      {/* Desktop layout */}
      <div className="flex-row hidden gap-4 md:flex">
        {/* previous version */}
        <div className="flex-1 p-6 flex flex-col gap-[64px]">
          {isHtmlContent(conversation[index - 1].content) ? (
            <div className="prose-sm prose max-w-none">
              {parse(conversation[index - 1].content)}
            </div>
          ) : (
            <div className="whitespace-pre-wrap">
              {conversation[index - 1].content}
            </div>
          )}
          <Button
            variant="brightblue"
            className="self-center w-fit"
            onClick={() =>
              onStatusComplete("Ready for Review", conversation[index - 1].id)
            }
          >
            Confirm and Mark as Ready for Review
          </Button>
        </div>

        {/* current version */}
        <div className="flex-1 p-6 flex flex-col gap-[64px]">
          {isHtmlContent(pair.content) ? (
            <div className="prose-sm prose max-w-none">
              {parse(pair.content)}
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{pair.content}</div>
          )}
          <Button
            variant="brightblue"
            className="self-center w-fit"
            onClick={() => onStatusComplete("Ready for Review", pair.id)}
          >
            Confirm and Mark as Ready for Review
          </Button>
        </div>
      </div>
    </div>
  );

  const renderEditView = () => (
    <>
      <input
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        placeholder="Title"
        className="text-xl font-bold w-full border border-[#008FF6] rounded-[16px] p-[16px] outline-none"
      />
      <input
        type="text"
        value={editedQuery}
        onChange={(e) => setEditedQuery(e.target.value)}
        placeholder="Query"
        className="text-md font-medium w-full border border-[#008FF6] rounded-[16px] p-[16px] outline-none"
      />
      <ReactQuill
        theme="snow"
        value={editedContent}
        onChange={setEditedContent}
        className="bg-white border border-[#008FF6] rounded-[16px] p-[16px]"
      />
    </>
  );

  const renderContent = () => {
    if (isHTML) {
      return (
        <div className="prose-sm prose max-w-none">{parse(pair.content)}</div>
      );
    }
    return <div className="whitespace-pre-wrap">{pair.content}</div>;
  };

  return (
    <div className="flex flex-col gap-[24px] pb-[100px]">
      {index > 0 && pair.query && (
        <div className="ml-auto p-[24px] bg-[#F6F6F6] border border-[#EAEAEA] rounded-[16px] w-full md:max-w-[563px] xl:max-w-[800px]">
          <p className="text-[18px] font-[500] text-[#1D1D1F]">{pair.query}</p>
        </div>
      )}

      {compareIndex === index && index > 0 && renderCompareView()}

      {compareIndex !== index && (
        <>
          {isEditing && selectedDocumentId === pair.id
            ? renderEditView()
            : renderContent()}
        </>
      )}

      <ConversationItemActions
        pair={pair}
        ratingsMap={ratingsMap}
        compareIndex={compareIndex}
        index={index}
        isEditing={isEditing}
        onCompareToggle={onCompareToggle}
        onEditToggle={onEditToggle}
        onSaveEdit={onSaveEdit}
        onCancelEdit={onCancelEdit}
        setSelectedDocumentId={setSelectedDocumentId}
        setIsRateOpen={setIsRateOpen}
        setIsBadResponseOpen={setIsBadResponseOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        setIsMoveOpen={setIsMoveOpen}
        handleDublicateClick={handleDublicateClick}
        handleMarkAsClick={handleMarkAsClick}
      />
    </div>
  );
};
