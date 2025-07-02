import React, { useEffect } from "react";
import { ScrollArea } from "shared/ui";
import { RatePopup } from "widgets/RatePopup";
import { DeleteMessagePopup } from "widgets/DeleteMessagePopup/ui";
import { ChooseSubfolderPopup } from "widgets/ChooseSubfolderPopup";
import { ChangeStatusPopup } from "widgets/ChangeStatusPopup";
import { DocumentBreadcrumbs } from "widgets/document-breadcrumbs";
import { DocumentInfoHeader } from "widgets/document-info-header";
import { DocumentHeader } from "widgets/document-header";
import { ConversationList } from "widgets/conversation-list";
import { MessageInput } from "widgets/message-input";
import { UserEngagementSidebar } from "widgets/user-engagement-sidebar";
import { BadRateResponse } from "widgets/bad-rate-response-popup";

import {
  useDocumentState,
  useMessageState,
  useContentActions,
  useDocumentCreation,
} from "features/document-management";

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
    isRateOpen,
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
    setCompareIndex,
    setMobilePage,
    setIsMarkAsOpen,
    setIsRateOpen,
    setIsBadResponseOpen,
    setIsDeleteOpen,
    setIsDublicateOpen,
    setIsMoveOpen,
    setIsEditing,
    setEditedContent,
    setEditedTitle,
    setEditedQuery,
    setSelectedDocumentId,
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
    <div className="flex flex-col gap-2 px-[16px] md:px-[24px] xl:px-[60px] pt-6 h-[calc(100vh-78px)] w-full">
      <div className="flex flex-row w-full h-full gap-[26px]">
        <div className="relative flex flex-col w-full h-full gap-2">
          <DocumentBreadcrumbs tab={tab} folder={folder} />

          <DocumentInfoHeader
            document={document}
            sharedClients={sharedClients}
            documentId={documentId}
            refreshSharedClients={refreshSharedClients}
          />

          <div className="flex flex-col h-full pt-6 w-full overflow-hidden xl:max-w-[1080px] m-auto">
            <ScrollArea className="h-[calc(100%-64px)]">
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
                setIsRateOpen={setIsRateOpen}
                setIsBadResponseOpen={setIsBadResponseOpen}
                setIsDeleteOpen={setIsDeleteOpen}
                setIsMoveOpen={setIsMoveOpen}
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

        {/* Modals */}
        {isRateOpen && selectedDocumentId && (
          <RatePopup
            contentId={selectedDocumentId}
            onClose={() => setIsRateOpen(false)}
            handleRateClick={handleRateClick}
            ratingsMap={ratingsMap}
          />
        )}

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
            parentFolderId={folder?.id ?? ""}
          />
        )}

        {isMoveOpen && (
          <ChooseSubfolderPopup
            title={"Move"}
            contentId={selectedDocumentId}
            handleSave={handleMoveClick}
            onClose={() => setIsMoveOpen(false)}
            parentFolderId={folder?.id ?? ""}
          />
        )}
      </div>
    </div>
  );
};
