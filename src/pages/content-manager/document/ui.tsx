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
import { findFolderPath } from "features/wrapper-folder-tree";
import { DocumentLoadingSkeleton } from "pages/library-document/lib";
import { useTextSelectionTooltip } from "./lib";
import { useDispatch } from "react-redux";
import { clearAllChatHistory } from "entities/client/lib";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { ChatSocketService } from "entities/chat";
import { ChangeAdminStatusPopup } from "widgets/change-admin-status-popup";
import {
  useUpdateContentStatusMutation,
  LibraryContentStatus,
} from "entities/content";
import { useGetDocumentByIdQuery } from "entities/document";
import { isInteractiveContent } from "widgets/conversation-item/ui/conversation-item";
import { ResizableLibraryChat } from "widgets/library-small-chat/components/ResizableSmallChat";

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

  const [statusPopup, setStatusPopup] = useState<boolean>(false);

  const [updateContentStatus] = useUpdateContentStatusMutation();
  const { refetch } = useGetDocumentByIdQuery(documentId!);

  const [widthPercent, setWidthPercent] = useState(50);

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      if (
        message.notification.type === "invitation_requested" ||
        message.notification.type === "client_joined" ||
        message.notification.type === "message"
      ) {
        toast({
          title: message.notification.title,
          description: message.notification.message,
        });
      }
    };

    ChatSocketService.on("notification", (message: any) =>
      handleNewMessage(message)
    );

    return () => {
      ChatSocketService.off("notification", (message: any) =>
        handleNewMessage(message)
      );
    };
  }, []);

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

  const onSaveEdit = async (contentId: string, content?: string) => {
    await handleSaveEdit(contentId, documentId, content);
    setOriginalEdit(null);
  };

  const onCancelEdit = () => {
    setIsEditing(false);
    setOriginalEdit(null);
  };

  const onMarkAsClick = () => {
    handleMarkAsClick(selectedDocument ? selectedDocument : null);
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

  const onStatusChange = async (comment?: string) => {
    try {
      const payload: LibraryContentStatus = {
        id: documentId || "",
        status: "Waiting",
        reviewer_comment: comment?.trim() || undefined,
      };

      await updateContentStatus(payload).unwrap();
      refetch();
      toast({
        title: "Status changed successfully",
      });
      setStatusPopup(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to change document status",
      });
    }
  };

  const isCard = selectedDocument
    ? isInteractiveContent(selectedDocument.content)
    : false;

  return (
    <div className="flex flex-col gap-2 px-[16px] md:px-[24px] xl:pt-0 xl:pl-0 xl:pr-0 xl:pb-0 py-4 md:pt-6 md:pb-0 h-[calc(100vh-95px)] xl:h-screen w-full overflow-y-auto">
      {loadingConversation && (
        <div className="flex gap-[12px] px-[20px] py-[10px] bg-white text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-[50%] translate-x-[-50%] xl:translate-x-[-25%]">
          <span className="inline-flex h-5 w-5 items-center justify-center">
            <MaterialIcon
              iconName="progress_activity"
              className="text-blue-600 animate-spin"
            />
          </span>
          Please wait, we are loading the information...
        </div>
      )}
      <div className="flex flex-row justify-end w-full h-full gap-[26px]">
        <div
          className="relative flex flex-col w-full h-full gap-2 overflow-y-auto xl:pl-[48px] xl:pr-[24px] xl:pb-[24px] xl:pt-6"
          style={{ width: `${100 - widthPercent}%` }}
        >
          <DocumentBreadcrumbs tab={tab} folder={folder} path={documentPath} />

          <DocumentInfoHeader
            document={selectedDocument ? selectedDocument : null}
            sharedClients={sharedClients}
            documentId={documentId}
            refreshSharedClients={refreshSharedClients}
            folderInstructions={
              folder?.customInstructions ||
              folder?.subfolders[0]?.customInstructions ||
              undefined
            }
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
                    setStatusPopup={setStatusPopup}
                  />
                </>
              )}
            </ScrollArea>
          </div>
        </div>

        <UserEngagementSidebar
          document={selectedDocument ? selectedDocument : null}
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
            title={`Delete ${isCard ? "card" : "document"}?`}
            text={`Are you sure you want to delete this ${isCard ? "card" : "document"}? This action cannot be undone`}
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

        {statusPopup && (
          <ChangeAdminStatusPopup
            action={"Waiting"}
            onClose={() => setStatusPopup(false)}
            onSave={onStatusChange}
          />
        )}

        <ResizableLibraryChat
          widthPercent={widthPercent}
          setWidthPercent={setWidthPercent}
        />
      </div>
    </div>
  );
};
