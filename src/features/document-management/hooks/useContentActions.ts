import { useState } from "react";
import { CoachService, RateContent } from "entities/coach";
import {
  FoldersService,
  ContentToMove,
  IFolder,
  ISubfolder,
  IContentItem,
  setFolders,
} from "entities/folder";
import { ContentService, ContentToEdit } from "entities/content";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "entities/store";

export const useContentActions = () => {
  const dispatch = useDispatch();

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

  const { folders } = useSelector((state: RootState) => state.folder);

  const nav = useNavigate();

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
    const currentContentId = id;
    let nextContentId: string | null = null;
    let parentFolderId: string | null = null;

    const findNextContentInFolder = (folder: IFolder | ISubfolder): boolean => {
      const index = folder.content.findIndex(
        (item) => item.id === currentContentId
      );

      if (index >= 0) {
        if (index + 1 < folder.content.length) {
          nextContentId = folder.content[index + 1].id;
        }
        parentFolderId = folder.id;
        return true;
      }

      for (const subfolder of folder.subfolders) {
        const found = findNextContentInFolder(subfolder);
        if (found) {
          if (!parentFolderId) parentFolderId = subfolder.id;
          return true;
        }
      }

      return false;
    };

    for (const folder of folders) {
      const found = findNextContentInFolder(folder);
      if (found) break;
    }

    await FoldersService.deleteContent(currentContentId);

    const folderResponse = await FoldersService.getFolders();
    dispatch(setFolders(folderResponse));
    setIsDeleteOpen(false);

    if (nextContentId && parentFolderId) {
      nav(
        `/content-manager/library/folder/${parentFolderId}/document/${nextContentId}`
      );
    } else {
      nav("/content-manager/create");
    }
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

    try {
      const response = await FoldersService.moveFolderContent(payload);

      const movedContentId = response.content.id;
      const movedFolderId = response.content.folder_id;

      const folderResponse = await FoldersService.getFolders();
      dispatch(setFolders(folderResponse));

      setIsDublicateOpen(false);

      nav(
        `/content-manager/library/folder/${movedFolderId}/document/${movedContentId}`
      );
    } catch (err) {
      console.error("Failed to duplicate and move content:", err);
    }
  };

  const handleMoveClick = async (id: string, subfolderId: string) => {
    const payload: ContentToMove = {
      content_id: id,
      target_folder_id: subfolderId,
    };
    await FoldersService.moveFolderContent(payload);
    const folderResponse = await FoldersService.getFolders();
    dispatch(setFolders(folderResponse));
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
