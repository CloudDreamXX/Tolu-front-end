import { ISessionResult } from "entities/coach";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import { Button } from "shared/ui";
import { ConversationItemActions } from "./conversationItem-actions";
import { Editor } from "primereact/editor";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { smartRender } from "features/chat/ui/message-bubble/lib";

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
  onRestoreOriginalFormat: () => void;
  setStatusPopup: React.Dispatch<React.SetStateAction<boolean>>;
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
  onRestoreOriginalFormat,
  setStatusPopup,
}) => {
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
                  <MaterialIcon
                    iconName="keyboard_arrow_left"
                    className="text-blue-600"
                  />
                </span>
              </button>

              <div className="text-[16px] font-[500]">{mobilePage}/2</div>

              <button onClick={() => setMobilePage(2)}>
                <span className="block transform rotate-180">
                  <MaterialIcon
                    iconName="keyboard_arrow_left"
                    className="text-blue-600"
                  />
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
                  <MaterialIcon
                    iconName="keyboard_arrow_left"
                    className="text-blue-600"
                  />
                </span>
              </button>

              <div className="text-[16px] font-[500]">{mobilePage}/2</div>

              <button
                onClick={() => setMobilePage(2)}
                disabled={mobilePage === 2}
              >
                <span className="block transform rotate-180">
                  <MaterialIcon
                    iconName="keyboard_arrow_left"
                    className="text-blue-600"
                  />
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

  const handleEditorChange = (e: { htmlValue: any }) => {
    const formattedContent = e.htmlValue;
    setEditedContent(formattedContent);
  };

  const renderEditView = () => (
    <div className="flex flex-col gap-2 w-full min-w-0">
      <input
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        placeholder="Title"
        className="text-xl font-bold w-full max-w-full min-w-0 box-border border border-[#008FF6] rounded-[16px] px-4 py-3 outline-none"
      />

      <div className="editor-wrap w-full max-w-full min-w-0 bg-white border border-[#008FF6] rounded-[16px] overflow-hidden">
        <Editor
          value={editedContent}
          onTextChange={handleEditorChange}
          style={{ width: "100%" }}
          className="w-full max-w-full min-w-0 bg-white p-3 h-fit"
        />
      </div>

      {isEditing && (
        <div className="flex flex-col flex-col-reverse md:flex-row flex-wrap md:justify-end gap-2">
          <button
            className="text-[#1C63DB] text-[16px] px-4 py-2"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
          <Button
            className="px-4 py-2"
            variant="light-blue"
            onClick={onRestoreOriginalFormat}
          >
            Restore original format
          </Button>
          <Button
            variant="brightblue"
            className="text-[16px] px-4 py-2"
            onClick={() => onSaveEdit(pair.id)}
          >
            Save changes
          </Button>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    const [rendered, setRendered] = useState<JSX.Element | null>(null);

    useEffect(() => {
      smartRender(pair.content).then(setRendered);
    }, [pair.content]);

    return (
      <div className="richtext max-w-none">{rendered}</div>
    );
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

      <div className="flex flex-col gap-4 mr-auto md:flex-row-reverse md:gap-2 md:gap-6">
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
          setStatusPopup={setStatusPopup}
        />
      </div>
    </div>
  );
};
