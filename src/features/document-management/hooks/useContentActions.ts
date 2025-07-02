import { useState } from "react";
import { CoachService, RateContent } from "entities/coach";
import {
  FoldersService,
  ContentToMove,
  IFolder,
  ISubfolder,
  IContentItem,
} from "entities/folder";
import { ContentService, ContentToEdit } from "entities/content";

export const useContentActions = () => {
  const [compareIndex, setCompareIndex] = useState<number | null>(null);
  const [mobilePage, setMobilePage] = useState<1 | 2>(1);
  const [ratingsMap, setRatingsMap] = useState<
    Record<string, { rating: number; comment: string }>
  >({});

  // Modal states
  const [isMarkAsOpen, setIsMarkAsOpen] = useState<boolean>(false);
  const [isRateOpen, setIsRateOpen] = useState<boolean>(false);
  const [isBadResponseOpen, setIsBadResponseOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isDublicateOpen, setIsDublicateOpen] = useState<boolean>(false);
  const [isMoveOpen, setIsMoveOpen] = useState<boolean>(false);

  // Edit states
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState<string>("");
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedQuery, setEditedQuery] = useState<string>("");

  // Selected states
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>("");
  const [selectedDocumentStatus, setSelectedDocumentStatus] = useState<
    string | undefined
  >(undefined);

  const findContentItemByIdInFolder = (
    currentFolder: IFolder | ISubfolder,
    contentItemId: string
  ): IContentItem | null => {
    for (const contentItem of currentFolder.content) {
      if (contentItem.id === contentItemId) {
        return contentItem;
      }

      if (Array.isArray(contentItem.messages)) {
        for (const message of contentItem.messages) {
          if (message.id === contentItemId) {
            return contentItem;
          }
        }
      }
    }

    for (const subfolder of currentFolder.subfolders) {
      const result = findContentItemByIdInFolder(subfolder, contentItemId);
      if (result) {
        return result;
      }
    }

    return null;
  };

  const onStatusComplete = async (
    status:
      | "Raw"
      | "Ready for Review"
      | "Waiting"
      | "Second Review Requested"
      | "Ready to Publish"
      | "Live"
      | "Archived",
    contentId?: string
  ) => {
    const newStatus = {
      id: contentId ?? selectedDocumentId,
      status: status,
    };

    try {
      await CoachService.changeStatus(newStatus);
      setIsMarkAsOpen(false);
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  const handleMarkAsClick = (contentId: string, folder: IFolder | null) => {
    if (!folder) return;

    const status = findContentItemByIdInFolder(folder, contentId)?.status;

    if (status) {
      setSelectedDocumentId(contentId);
      setSelectedDocumentStatus(status);
      setIsMarkAsOpen(true);
    } else {
      console.warn("Status not found for content ID:", contentId);
    }
  };

  const handleRateClick = async (
    id: string,
    rating: number,
    comment: string,
    down: boolean
  ) => {
    setRatingsMap((prev) => ({
      ...prev,
      [id]: { rating, comment },
    }));
    const payload: RateContent = {
      content_id: id,
      rating: rating,
      thumbs_down: down,
      comment: comment,
    };
    await CoachService.rateContent(payload);
    setIsRateOpen(false);
    setIsBadResponseOpen(false);
  };

  const handleDeleteClick = async (id: string) => {
    await FoldersService.deleteContent(id);
    setIsDeleteOpen(false);
  };

  const handleDublicateClick = async (id: string) => {
    setIsDublicateOpen(true);
    const response = await ContentService.duplicateContentById(id);
    setSelectedDocumentId(response.duplicated_content.id);
  };

  const handleDublicateAndMoveClick = async (
    id: string,
    subfolderId: string
  ) => {
    const payload: ContentToMove = {
      content_id: id,
      target_folder_id: subfolderId,
    };
    await FoldersService.moveFolderContent(payload);
    setIsDublicateOpen(false);
  };

  const handleMoveClick = async (id: string, subfolderId: string) => {
    const payload: ContentToMove = {
      content_id: id,
      target_folder_id: subfolderId,
    };
    await FoldersService.moveFolderContent(payload);
    setIsMoveOpen(false);
  };

  const handleSaveEdit = async (
    contentId: string,
    documentId?: string,
    onDocumentUpdate?: (docId: string) => Promise<void>
  ) => {
    try {
      const payload: ContentToEdit = {
        content_id: contentId,
        new_title: editedTitle,
        new_query: editedQuery,
        new_content: editedContent,
      };
      await ContentService.editContent(payload);
      if (documentId && onDocumentUpdate) {
        await onDocumentUpdate(documentId);
      }
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save content edit", err);
    }
  };

  return {
    // State
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

    // Actions
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
    setSelectedDocumentStatus,

    // Handlers
    onStatusComplete,
    handleMarkAsClick,
    handleRateClick,
    handleDeleteClick,
    handleDublicateClick,
    handleDublicateAndMoveClick,
    handleMoveClick,
    handleSaveEdit,
  };
};
