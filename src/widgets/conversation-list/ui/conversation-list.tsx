import { ISessionResult } from "entities/coach";
import { IDocument } from "entities/document";
import parse from "html-react-parser";
import React from "react";
import { ConversationItem } from "widgets/conversation-item";

const isHtmlContent = (content: string): boolean => /<[^>]*>/.test(content);

interface ConversationListProps {
  conversation: ISessionResult[];
  compareIndex: number | null;
  mobilePage: 1 | 2;
  isEditing: boolean;
  selectedDocumentId: string;
  editedTitle: string;
  editedQuery: string;
  editedContent: string;
  ratingsMap: Record<string, { rating: number; comment: string }>;
  streamingContent: string;
  streamingIsHtml: boolean;
  isCreatingDocument: boolean;
  isSendingMessage: boolean;
  newMessageStreaming: string;
  newMessageIsHtml: boolean;
  message: string;
  onStatusComplete: (status: any, contentId: string) => Promise<void>;
  onCompareToggle: (index: number) => void;
  onEditToggle: (pair: ISessionResult, document: IDocument | null) => void;
  onSaveEdit: (contentId: string, content?: string) => Promise<void>;
  onCancelEdit: () => void;
  setMobilePage: (page: 1 | 2) => void;
  setSelectedDocumentId: (id: string) => void;
  setIsBadResponseOpen: (open: boolean) => void;
  setIsDeleteOpen: (open: boolean) => void;
  setIsRateOpen: (open: boolean) => void;
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

export const ConversationList: React.FC<ConversationListProps> = ({
  conversation,
  compareIndex,
  mobilePage,
  isEditing,
  selectedDocumentId,
  editedTitle,
  editedQuery,
  editedContent,
  ratingsMap,
  streamingContent,
  streamingIsHtml,
  isCreatingDocument,
  isSendingMessage,
  newMessageStreaming,
  newMessageIsHtml,
  message,
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
  setEditedQuery,
  setEditedContent,
  handleDublicateClick,
  handleMarkAsClick,
  handleDeleteContent,
  onMarkAsFinalHandler,
  onRestoreOriginalFormat,
  setStatusPopup,
}) => {
  return (
    <div className="flex flex-col gap-[32px]">
      {isCreatingDocument && (
        <div className="prose-sm prose">
          {streamingIsHtml || isHtmlContent(streamingContent) ? (
            <>
              {parse(streamingContent)}
              <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse" />
            </>
          ) : (
            <>
              <div className="whitespace-pre-wrap">{streamingContent}</div>
              <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse" />
            </>
          )}
        </div>
      )}

      {conversation.map((pair, index) => (
        <ConversationItem
          key={pair.id || index}
          pair={pair}
          index={index}
          compareIndex={compareIndex}
          mobilePage={mobilePage}
          isEditing={isEditing}
          selectedDocumentId={selectedDocumentId}
          editedTitle={editedTitle}
          editedQuery={editedQuery}
          editedContent={editedContent}
          ratingsMap={ratingsMap}
          conversation={conversation}
          onStatusComplete={onStatusComplete}
          onCompareToggle={onCompareToggle}
          onEditToggle={onEditToggle}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          setMobilePage={setMobilePage}
          setSelectedDocumentId={setSelectedDocumentId}
          setIsBadResponseOpen={setIsBadResponseOpen}
          setIsDeleteOpen={setIsDeleteOpen}
          setIsMoveOpen={setIsMoveOpen}
          setIsMarkAsOpen={setIsMarkAsOpen}
          setEditedTitle={setEditedTitle}
          setEditedQuery={setEditedQuery}
          setEditedContent={setEditedContent}
          handleDublicateClick={handleDublicateClick}
          handleMarkAsClick={handleMarkAsClick}
          handleDeleteContent={handleDeleteContent}
          onMarkAsFinalHandler={onMarkAsFinalHandler}
          onRestoreOriginalFormat={onRestoreOriginalFormat}
          setStatusPopup={setStatusPopup}
        />
      ))}

      {isSendingMessage && message && (
        <div className="flex flex-col gap-4">
          <div className="ml-auto p-[24px] bg-[#F6F6F6] border border-[#EAEAEA] rounded-[16px] w-full md:max-w-[563px] xl:max-w-[800px]">
            <p className="text-[16px] md:text-[18px] font-[500] text-[#1D1D1F]">
              {message}
            </p>
          </div>
          {newMessageIsHtml || isHtmlContent(newMessageStreaming) ? (
            <div className="prose-sm prose max-w-none">
              {parse(newMessageStreaming)}
              <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse" />
            </div>
          ) : (
            <div className="whitespace-pre-wrap">
              {newMessageStreaming}
              <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
