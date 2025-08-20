import { ISessionResult } from "entities/coach";
import parse from "html-react-parser";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import BlueChevron from "shared/assets/icons/blue-chevron";
import { Button } from "shared/ui";
import { ConversationItemActions } from "./conversationItem-actions";
import "react-quill/dist/quill.snow.css";

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
  setIsBadResponseOpen: (open: boolean) => void;
  setIsDeleteOpen: (open: boolean) => void;
  setIsMoveOpen: (open: boolean) => void;
  setIsMarkAsOpen: (open: boolean) => void;
  setEditedTitle: (title: string) => void;
  setEditedQuery: (query: string) => void;
  setEditedContent: (content: string) => void;
  handleDublicateClick: (id: string) => Promise<void>;
  handleMarkAsClick: () => void;
  handleDeleteContent: (id: string) => void;
  onMarkAsFinalHandler: (contentId?: string | undefined) => Promise<void>;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  pair,
  index,
  compareIndex,
  mobilePage,
  isEditing,
  selectedDocumentId,
  editedTitle,
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
  setIsBadResponseOpen,
  setIsDeleteOpen,
  setIsMoveOpen,
  setIsMarkAsOpen,
  setEditedTitle,
  setEditedContent,
  handleDublicateClick,
  handleMarkAsClick,
  handleDeleteContent,
  onMarkAsFinalHandler,
}) => {
  const isHTML = isHtmlContent(pair.content);

  const renderCompareView = () => (
    <div className="flex-row block gap-4 md:flex">
      {/* Mobile paginated view */}
      <div className="block md:hidden">
        {mobilePage === 1 && (
          <div className="p-6 flex flex-col gap-[16px]">
            <div className="prose-sm prose max-w-none richtext">
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
            <div className="prose-sm prose max-w-none richtext">
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
      <div className="flex-row w-full gap-4">
        {/* previous version */}
        <div className="flex-1 p-6 flex flex-col gap-[64px]">
          {isHtmlContent(conversation[index - 1].content) ? (
            <div className="prose-sm prose max-w-none richtext">
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
            <div className="prose-sm prose max-w-none richtext">
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
    <div className="flex flex-col gap-2">
      <input
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        placeholder="Title"
        className="text-xl font-bold w-full border border-[#008FF6] rounded-[16px] p-[16px] outline-none"
      />
      <ReactQuill
        theme="snow"
        value={editedContent}
        onChange={setEditedContent}
        className="bg-white border border-[#008FF6] rounded-[16px] p-[16px] h-fit"
        formats={[
          "bold",
          "italic",
          "underline",
          "list",
          "align",
          "link",
          "blockquote",
          "code-block",
          "header",
          "font",
          "size",
          "color",
          "background",
          "lineHeight",
          "indent",
          "list",
          "ordered",
          "bullet",
          "paragraph",
          "image",
          "strike",
          "script",
          "direction",
        ]}
        modules={{
          toolbar: [
            [
              { header: "1" },
              { header: "2" },
              { header: "3" },
              { header: "4" },
              { list: "ordered" },
              { list: "bullet" },
              { align: [] },
              "bold",
              "italic",
              "underline",
              { lineHeight: [] },
              { indent: "-1" },
              { indent: "+1" },
              "link",
              "blockquote",
              "code-block",
            ],
          ],
          clipboard: {
            matchVisual: false,
          },
        }}
      />

      {isEditing && (
        <div className="flex flex-row self-end gap-[8px]">
          <button
            className="text-[#1C63DB] text-[16px] px-4"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
          <Button
            variant="brightblue"
            className="text-[16px] px-8"
            onClick={() => {
              onSaveEdit(pair.id);
            }}
          >
            Save changes
          </Button>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (isHTML) {
      return (
        <div className="prose-sm prose max-w-none richtext">
          {parse(pair.content)}
        </div>
      );
    }
    return <div className="whitespace-pre-wrap">{pair.content}</div>;
  };

  return (
    <div key={pair.id} className="flex flex-col gap-[24px]">
      {pair.query && (
        <div className="ml-auto p-[24px] bg-[#F6F6F6] border border-[#EAEAEA] rounded-[16px] w-full md:max-w-[563px] xl:max-w-[400px]">
          <p className="text-[16px] md:text-[18px] font-[500] text-[#1D1D1F]">
            {pair.query}
          </p>
        </div>
      )}

      {compareIndex === index && index > 0 && renderCompareView()}

      <div className="flex flex-col md:flex-row-reverse gap-4 md:gap-2 md:gap-6 mr-auto">
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
          index={index}
          onCompareToggle={onCompareToggle}
          onEditToggle={onEditToggle}
          setSelectedDocumentId={setSelectedDocumentId}
          setIsBadResponseOpen={setIsBadResponseOpen}
          setIsDeleteOpen={setIsDeleteOpen}
          setIsMoveOpen={setIsMoveOpen}
          setIsMarkAsOpen={setIsMarkAsOpen}
          handleDublicateClick={handleDublicateClick}
          handleMarkAsClick={handleMarkAsClick}
          handleDelete={handleDeleteContent}
          compareIndex={compareIndex}
          onMarkAsFinalHandler={onMarkAsFinalHandler}
        />
      </div>
    </div>
  );
};
