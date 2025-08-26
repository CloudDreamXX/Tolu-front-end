import React, { useEffect, useState } from "react";
import { ScrollArea } from "shared/ui";
import { BadRateResponse } from "widgets/bad-rate-response-popup";
import { ChangeStatusPopup } from "widgets/ChangeStatusPopup";
import { ChooseSubfolderPopup } from "widgets/ChooseSubfolderPopup";
import { ConversationList } from "widgets/conversation-list";
import { DeleteMessagePopup } from "widgets/DeleteMessagePopup/ui";
import { DocumentBreadcrumbs } from "widgets/document-breadcrumbs";
import { DocumentHeader } from "widgets/document-header";
import { DocumentInfoHeader } from "widgets/document-info-header";
import { UserEngagementSidebar } from "widgets/user-engagement-sidebar";

import {
  useContentActions,
  useDocumentCreation,
  useDocumentState,
  useMessageState,
} from "features/document-management";
import { cn, toast } from "shared/lib";
import { LibrarySmallChat } from "widgets/library-small-chat";
import { findFolderPath } from "features/wrapper-folder-tree";
import { DocumentLoadingSkeleton } from "pages/library-document/lib";
import LoadingIcon from "shared/assets/icons/loading-icon";
import { useTextSelectionTooltip } from "./lib";
import { useDispatch } from "react-redux";
import { clearAllChatHistory } from "entities/client/lib";

export const ContentManagerDocument: React.FC = () => {
  const {
    folders,
    document: selectedDocument,
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
    loadingConversation,
  } = useDocumentState();

  const {
    message,
    clientId,
    isSendingMessage,
    newMessageStreaming,
    newMessageIsHtml,
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

  const dispatch = useDispatch();
  const { handleDocumentCreation } = useDocumentCreation();
  const isDraft = documentPath[0]?.name.toLowerCase() === "drafts";
  const {
    textForInput,
    tooltipPosition,
    showTooltip,
    handleTooltipClick,
    handleDeleteSelectedText,
  } = useTextSelectionTooltip();

  const [originalEdit, setOriginalEdit] = useState<{
    contentId: string;
    content: string;
    title: string;
    query: string;
  } | null>(null);

  useEffect(() => {
    const createDocument = async () => {
      if (isNewDocument && location.state) {
        await handleDocumentCreation({
          location,
          documentId,
          documentName: documentTitle,
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

    return () => {
      dispatch(clearAllChatHistory());
    };
  }, [isNewDocument, location.state]);

  const onCompareToggle = (index: number) => {
    setCompareIndex(compareIndex === index ? null : index);
  };

  const onEditToggle = (pair: any) => {
    setSelectedDocumentId(pair.id);
    setEditedContent(pair.content);
    setEditedTitle(selectedDocument?.aiTitle ?? selectedDocument?.title ?? "");
    setEditedQuery(selectedDocument?.query ?? "");
    setIsEditing(true);

    setOriginalEdit({
      contentId: pair.id,
      content: pair.content,
      title: selectedDocument?.aiTitle ?? selectedDocument?.title ?? "",
      query: selectedDocument?.query ?? "",
    });
  };

  const onRestoreOriginalFormat = () => {
    if (originalEdit && selectedDocumentId === originalEdit.contentId) {
      setEditedContent(originalEdit.content);
      setEditedTitle(originalEdit.title);
      setEditedQuery(originalEdit.query);
    }
  };

  const onSaveEdit = async (contentId: string) => {
    await handleSaveEdit(contentId, documentId, loadDocument);
    setOriginalEdit(null);
  };

  const onCancelEdit = () => {
    setIsEditing(false);
    setOriginalEdit(null);
  };

  const onMarkAsClick = () => {
    handleMarkAsClick(selectedDocument);
  };

  const onStatusCompleteHandler = async (status: any, contentId?: string) => {
    await onStatusComplete(status, contentId);
  };

  const onMarkAsFinalHandler = async (contentId?: string) => {
    const itemsToArchive = conversation.filter((item) => item.id !== contentId);

    try {
      await Promise.all(
        itemsToArchive.map((item) => onStatusComplete("Archived", item.id))
      );

      toast({
        title: "Content was successfully marked as final",
      });

      navigate(location.pathname);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-2 px-[16px] md:px-[24px] xl:pl-[48px] xl:pr-[24px] xl:pb-[24px] pt-2 md:pt-6 h-[calc(100vh-78px)] w-full overflow-y-auto">
      {loadingConversation && (
        <div className="flex gap-[12px] px-[20px] py-[10px] bg-white text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-[50%] translate-x-[-50%] xl:translate-x-[-25%]">
          <LoadingIcon />
          Please wait, we are loading the information...
        </div>
      )}
      <div className="flex flex-row justify-end w-full h-full gap-[26px]">
        <div className="relative flex flex-col w-full h-full gap-2 overflow-y-auto">
          <DocumentBreadcrumbs tab={tab} folder={folder} path={documentPath} />

          <DocumentInfoHeader
            document={selectedDocument}
            sharedClients={sharedClients}
            documentId={documentId}
            refreshSharedClients={refreshSharedClients}
          />

          <div className="flex flex-col xl:bg-white p-2 pr-0 md:p-8 md:pr-0 w-full mx-auto rounded-[24px]">
            {showTooltip && tooltipPosition && (
              <div
                className="fixed px-2 py-1 bg-white border border-blue-500 rounded-md"
                style={{
                  top: `${tooltipPosition.top}px`,
                  left: `${tooltipPosition.left}px`,
                  transform: "translateX(-50%)",
                  zIndex: 9999,
                }}
              >
                <button
                  onClick={handleTooltipClick}
                  className="text-black text-[16px] font-semibold"
                >
                  Ask Tolu
                </button>
              </div>
            )}
            <ScrollArea className={cn("pr-2 md:pr-6")}>
              {loadingConversation ? (
                <DocumentLoadingSkeleton />
              ) : (
                <>
                  <DocumentHeader
                    documentTitle={documentTitle}
                    query={selectedDocument?.query}
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
                    setIsMarkAsOpen={setIsMarkAsOpen}
                    setEditedTitle={setEditedTitle}
                    setEditedQuery={setEditedQuery}
                    setEditedContent={setEditedContent}
                    handleDublicateClick={handleDublicateClick}
                    handleMarkAsClick={onMarkAsClick}
                    handleDeleteContent={handleDeleteClick}
                    onMarkAsFinalHandler={onMarkAsFinalHandler}
                    onRestoreOriginalFormat={onRestoreOriginalFormat}
                  />
                </>
              )}
            </ScrollArea>
          </div>
        </div>

        <UserEngagementSidebar
          document={selectedDocument}
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
            parentFolderId={
              folder?.parentFolderId ||
              (findFolderPath(folders, folder?.id)?.[0]?.id ?? "")
            }
          />
        )}

        {isMoveOpen && (
          <ChooseSubfolderPopup
            title={"Move"}
            contentId={selectedDocumentId}
            handleSave={handleMoveClick}
            onClose={() => setIsMoveOpen(false)}
            parentFolderId={
              folder?.parentFolderId ||
              (findFolderPath(folders, folder?.id)?.[0]?.id ?? "")
            }
          />
        )}

        <div className="hidden xl:block max-w-[40%] w-full">
          <LibrarySmallChat
            isCoach
            isDraft={isDraft}
            isLoading={loadingConversation}
            selectedText={textForInput}
            deleteSelectedText={handleDeleteSelectedText}
            onDocumentRefresh={(docId) => loadDocument(docId)}
          />
        </div>
      </div>
    </div>
  );
};
