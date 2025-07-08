import React, { useEffect } from "react";
import { ScrollArea } from "shared/ui";
import { BadRateResponse } from "widgets/bad-rate-response-popup";
import { ChangeStatusPopup } from "widgets/ChangeStatusPopup";
import { ChooseSubfolderPopup } from "widgets/ChooseSubfolderPopup";
import { ConversationList } from "widgets/conversation-list";
import { DeleteMessagePopup } from "widgets/DeleteMessagePopup/ui";
import { DocumentBreadcrumbs } from "widgets/document-breadcrumbs";
import { DocumentHeader } from "widgets/document-header";
import { DocumentInfoHeader } from "widgets/document-info-header";
import { MessageInput } from "widgets/message-input";
import { UserEngagementSidebar } from "widgets/user-engagement-sidebar";

import {
  useContentActions,
  useDocumentCreation,
  useDocumentState,
  useMessageState,
} from "features/document-management";
import { LibrarySmallChat } from "widgets/library-small-chat";

export const ContentManagerDocument: React.FC = () => {
  const {
    document,
    folder,
    conversation,
    sharedClients,
    documentTitle,
    isCreatingDocument,
    streamingContent,
    streamingIsHtml,
    isNewDocument,
    tab,
    documentId,
    folderId,
    setDocumentTitle,
    setIsCreatingDocument,
    setStreamingContent,
    setStreamingIsHtml,
    setSharedClients,
    loadDocument,
    loadConversation,
    refreshSharedClients,
    navigate,
    location,
    documentPath,
  } = useDocumentState();

  const {
    message,
    clientId,
    isSendingMessage,
    newMessageStreaming,
    newMessageIsHtml,
    setMessage,
    setClientId,
    setFiles,
    handleSendMessage,
  } = useMessageState();

  const {
    compareIndex,
    mobilePage,
    ratingsMap,
    isMarkAsOpen,
    isBadResponseOpen,
    isDeleteOpen,
    isDublicateOpen,
    isMoveOpen,
    isEditing,
    editedContent,
    editedTitle,
    editedQuery,
    selectedDocumentId,
    selectedDocumentStatus,
    isRateOpen,
    setCompareIndex,
    setMobilePage,
    setIsMarkAsOpen,
    setIsBadResponseOpen,
    setIsDeleteOpen,
    setIsDublicateOpen,
    setIsMoveOpen,
    setIsEditing,
    setEditedContent,
    setEditedTitle,
    setEditedQuery,
    setSelectedDocumentId,
    setIsRateOpen,
    onStatusComplete,
    handleMarkAsClick,
    handleRateClick,
    handleDeleteClick,
    handleDublicateClick,
    handleDublicateAndMoveClick,
    handleMoveClick,
    handleSaveEdit,
  } = useContentActions();

  const { handleDocumentCreation } = useDocumentCreation();

  // Handle document creation for new documents
  useEffect(() => {
    const createDocument = async () => {
      if (isNewDocument && location.state) {
        await handleDocumentCreation({
          location,
          documentId,
          folderId,
          clientId,
          setIsCreatingDocument,
          setDocumentTitle,
          setStreamingContent,
          setStreamingIsHtml,
          loadConversation,
          setSharedClients,
          navigate,
          loadDocument,
        });
      }
    };

    createDocument();
  }, [isNewDocument, location.state]);

  // Handle message sending
  const onSendMessage = async () => {
    if (!document || !folderId) return;
    await handleSendMessage(document, folderId, async () => {
      await loadConversation(document?.chatId);
    });
  };

  // Handle comparison toggle
  const onCompareToggle = (index: number) => {
    setCompareIndex(compareIndex === index ? null : index);
  };

  // Handle edit toggle
  const onEditToggle = (pair: any) => {
    setSelectedDocumentId(pair.id);
    setEditedContent(pair.content);
    setEditedTitle(document?.title ?? "");
    setEditedQuery(document?.query ?? "");
    setIsEditing(true);
  };

  // Handle save edit
  const onSaveEdit = async (contentId: string) => {
    await handleSaveEdit(contentId, documentId, loadDocument);
  };

  // Handle cancel edit
  const onCancelEdit = () => {
    setIsEditing(false);
  };

  // Handle mark as click
  const onMarkAsClick = (contentId: string) => {
    handleMarkAsClick(contentId, folder);
  };

  // Handle status complete
  const onStatusCompleteHandler = async (status: any, contentId?: string) => {
    await onStatusComplete(status, contentId);
  };

  return (
    <div className="flex flex-col gap-2 px-[16px] md:px-[24px] xl:pl-[48px] xl:pr-[24px] pt-2 md:pt-6 h-[calc(100vh-78px)] w-full">
      <div className="flex flex-row justify-end w-full h-full gap-[26px]">
        <div className="relative flex flex-col w-full h-full gap-2">
          <DocumentBreadcrumbs tab={tab} folder={folder} path={documentPath} />

          <DocumentInfoHeader
            document={document}
            sharedClients={sharedClients}
            documentId={documentId}
            refreshSharedClients={refreshSharedClients}
          />

          <div className="flex flex-col h-full bg-white p-2 pr-0 md:p-8 md:pr-0 w-full overflow-hidden m-auto rounded-tl-[24px] rounded-tr-[24px]">
            <ScrollArea className="h-[calc(100%-64px)] pr-2 md:pr-6">
              <DocumentHeader
                documentTitle={documentTitle}
                query={document?.query}
                isCreatingDocument={isCreatingDocument}
                isSendingMessage={isSendingMessage}
              />

              <ConversationList
                conversation={conversation}
                compareIndex={compareIndex}
                mobilePage={mobilePage}
                isEditing={isEditing}
                selectedDocumentId={selectedDocumentId}
                editedTitle={editedTitle}
                editedQuery={editedQuery}
                editedContent={editedContent}
                ratingsMap={ratingsMap}
                streamingContent={streamingContent}
                streamingIsHtml={streamingIsHtml}
                isCreatingDocument={isCreatingDocument}
                isSendingMessage={isSendingMessage}
                newMessageStreaming={newMessageStreaming}
                newMessageIsHtml={newMessageIsHtml}
                message={message}
                onStatusComplete={onStatusCompleteHandler}
                onCompareToggle={onCompareToggle}
                onEditToggle={onEditToggle}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
                setMobilePage={setMobilePage}
                setSelectedDocumentId={setSelectedDocumentId}
                setIsBadResponseOpen={setIsBadResponseOpen}
                setIsDeleteOpen={setIsDeleteOpen}
                setIsMoveOpen={setIsMoveOpen}
                setIsRateOpen={setIsRateOpen}
                setEditedTitle={setEditedTitle}
                setEditedQuery={setEditedQuery}
                setEditedContent={setEditedContent}
                handleDublicateClick={handleDublicateClick}
                handleMarkAsClick={onMarkAsClick}
              />
            </ScrollArea>
          </div>

          <MessageInput
            message={message}
            isSendingMessage={isSendingMessage}
            folderId={folderId}
            documentId={documentId}
            onMessageChange={setMessage}
            onSendMessage={onSendMessage}
            setFiles={setFiles}
            setClientId={setClientId}
          />
        </div>

        <UserEngagementSidebar
          document={document}
          folderName={folder?.name ?? ""}
        />

        {isMarkAsOpen && selectedDocumentId && selectedDocumentStatus && (
          <ChangeStatusPopup
            onClose={() => setIsMarkAsOpen(false)}
            onComplete={onStatusCompleteHandler}
            currentStatus={
              selectedDocumentStatus as
                | "Raw"
                | "Ready for Review"
                | "Waiting"
                | "Second Review Requested"
                | "Ready to Publish"
                | "Live"
                | "Archived"
            }
            handleMoveClick={handleMoveClick}
            contentId={selectedDocumentId}
          />
        )}

        {isBadResponseOpen && (
          <BadRateResponse
            contentId={selectedDocumentId}
            handleRateClick={handleRateClick}
            onClose={() => setIsBadResponseOpen(false)}
          />
        )}

        {isDeleteOpen && (
          <DeleteMessagePopup
            contentId={selectedDocumentId}
            onCancel={() => setIsDeleteOpen(false)}
            onDelete={handleDeleteClick}
          />
        )}

        {isDublicateOpen && (
          <ChooseSubfolderPopup
            title={"Duplicate"}
            contentId={selectedDocumentId}
            handleSave={handleDublicateAndMoveClick}
            onClose={() => setIsDublicateOpen(false)}
            parentFolderId={folder?.parentFolderId ?? ""}
          />
        )}

        {isMoveOpen && (
          <ChooseSubfolderPopup
            title={"Move"}
            contentId={selectedDocumentId}
            handleSave={handleMoveClick}
            onClose={() => setIsMoveOpen(false)}
            parentFolderId={folder?.parentFolderId ?? ""}
          />
        )}

        <div className="hidden xl:block max-w-[40%] w-full">
          <LibrarySmallChat isCoach />
        </div>
      </div>
    </div>
  );
};
