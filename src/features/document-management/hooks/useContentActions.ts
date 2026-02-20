import { useState } from "react";
import { RateContent } from "entities/coach";
import {
  useChangeStatusMutation,
  useRateContentMutation,
} from "entities/coach";
import {
  useDeleteContentMutation,
  useMoveFolderContentMutation,
  useGetFoldersQuery,
} from "entities/folder/api";
import { ContentToMove, IFolder, ISubfolder } from "entities/folder";
import {
  useEditContentMutation,
  useDuplicateContentByIdMutation,
} from "entities/content";
import { ContentToEdit } from "entities/content";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "entities/store";
import { IDocument, useGetDocumentByIdQuery } from "entities/document";
import { toast } from "shared/lib";

export const useContentActions = () => {
  const [compareIndex, setCompareIndex] = useState<number | null>(null);
  const [mobilePage, setMobilePage] = useState<1 | 2>(1);
  const [ratingsMap, setRatingsMap] = useState<
    Record<string, { rating: number; comment: string }>
  >({});

  const [isMarkAsOpen, setIsMarkAsOpen] = useState(false);
  const [isRateOpen, setIsRateOpen] = useState(false);
  const [isBadResponseOpen, setIsBadResponseOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDublicateOpen, setIsDublicateOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editedQuery, setEditedQuery] = useState("");

  const [selectedDocumentId, setSelectedDocumentId] = useState("");
  const [selectedDocumentStatus, setSelectedDocumentStatus] = useState<
    string | undefined
  >(undefined);

  const { folders } = useSelector((state: RootState) => state.folder);

  const [editContent] = useEditContentMutation();
  const [duplicateContentById] = useDuplicateContentByIdMutation();
  const [changeStatus] = useChangeStatusMutation();
  const [rateContent] = useRateContentMutation();
  const [deleteContent] = useDeleteContentMutation();
  const [moveFolderContent] = useMoveFolderContentMutation();
  const { refetch: refetchFolders } = useGetFoldersQuery();

  const nav = useNavigate();
  const { refetch: refetchDocument } = useGetDocumentByIdQuery(
    selectedDocumentId,
    {
      skip: !selectedDocumentId || selectedDocumentId.startsWith("temp_"),
    }
  );

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
      status,
    };

    try {
      const res = await changeStatus(newStatus).unwrap();
      setIsMarkAsOpen(false);
      nav(
        `/content-manager/library/folder/${res.data.content.folder_id}/document/${selectedDocumentId}`
      );
      window.location.reload();
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  const handleMarkAsClick = (document: IDocument | null) => {
    if (!document) return;
    setSelectedDocumentId(document.id);
    setSelectedDocumentStatus(document.status);
    setIsMarkAsOpen(true);
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
      rating,
      thumbs_down: down,
      comment,
    };
    await rateContent(payload).unwrap();
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

    try {
      await deleteContent(currentContentId).unwrap();
      toast({ title: "Deleted successfully" });

      await refetchFolders();
      setIsDeleteOpen(false);

      if (nextContentId && parentFolderId) {
        nav(
          `/content-manager/library/folder/${parentFolderId}/document/${nextContentId}`
        );
      } else {
        nav("/content-manager/create");
      }
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const handleDublicateClick = async (id: string) => {
    setIsDublicateOpen(true);
    try {
      const response = await duplicateContentById(id).unwrap();
      setSelectedDocumentId(response.duplicated_content.id);
    } catch (err) {
      console.error("Error duplicating content:", err);
    }
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
      const response = await moveFolderContent(payload).unwrap();

      const movedContentId = response.content.id;
      const movedFolderId = response.content.folder_id;

      await refetchFolders();
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
    try {
      await moveFolderContent(payload).unwrap();
      await refetchFolders();
      setIsMoveOpen(false);
    } catch (error) {
      console.error("Error moving content:", error);
    }
  };

  const handleSaveEdit = async (
    contentId: string,
    documentId?: string,
    content?: string
  ) => {
    try {
      const payload: ContentToEdit = {
        content_id: contentId,
        new_title: editedTitle,
        new_query: editedQuery,
        new_content: content ?? editedContent,
      };
      await editContent(payload).unwrap();
      if (documentId) {
        refetchDocument();
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
