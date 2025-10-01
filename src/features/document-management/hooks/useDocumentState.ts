import { CoachService, ISessionResult, Share } from "entities/coach";
import { useGetDocumentByIdQuery } from "entities/document";
import { FoldersService, IFolder } from "entities/folder";
import { RootState } from "entities/store";
import { findFilePath, PathEntry } from "features/wrapper-folder-tree";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffectiveDocumentId } from "./useEffectiveDocumentId";
import { setFolderToChat, setLastChatId } from "entities/client/lib";

export const useDocumentState = () => {
  const { tab, folderId, documentId } = useEffectiveDocumentId();
  const location = useLocation();
  const navigate = useNavigate();
  const { folders } = useSelector((state: RootState) => state.folder);
  const token = useSelector((state: RootState) => state.user.token);

  const [folder, setFolder] = useState<IFolder | null>(null);
  const [conversation, setConversation] = useState<ISessionResult[]>([]);
  const [sharedClients, setSharedClients] = useState<Share[] | null>(null);
  const [documentTitle, setDocumentTitle] = useState<string>("");
  const [documentPath, setDocumentPath] = useState<PathEntry[]>([]);

  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string>("");
  const [streamingIsHtml, setStreamingIsHtml] = useState(false);

  const isNewDocument = location.state?.isNewDocument;
  const isTemporaryDocument = documentId?.startsWith("temp_");

  const [loadingConversation, setLoadingConversation] = useState(false);
  const dispatch = useDispatch();

  const { data: document } = useGetDocumentByIdQuery(documentId!);

  const loadConversation = async (chatId: string | undefined) => {
    if (!chatId) return;

    setLoadingConversation(true);
    try {
      const response = await CoachService.getSessionById(chatId);
      if (response?.search_results) {
        setConversation(response.search_results);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setLoadingConversation(false);
    }
  };

  useEffect(() => {
    loadConversation(document?.chatId);
    if (document?.status === "Raw") {
      dispatch(setLastChatId(document.chatId));
      dispatch(setFolderToChat(document.originalFolderId));
    }
  }, [document]);

  const refreshSharedClients = async () => {
    if (!documentId) return;
    const response = await CoachService.getContentShares(documentId);
    setSharedClients(response.shares);
  };

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        if (!folderId) return;

        const documentPath = findFilePath(folders, documentId ?? "");
        if (documentPath) setDocumentPath(documentPath);

        const response = await FoldersService.getFolder(folderId);
        if (response) setFolder(response);
      } catch (error) {
        console.error("Error fetching folder:", error);
      }
    };

    fetchFolder();
  }, [documentId, folderId, folders]);

  useEffect(() => {
    if (!isNewDocument && !isTemporaryDocument && documentId) {
      const fetchShared = async () => {
        const response = await CoachService.getContentShares(documentId);
        setSharedClients(response.shares);
      };

      fetchShared();
    }
  }, [documentId, isNewDocument, isTemporaryDocument]);

  return {
    // State
    folders,
    document,
    folder,
    conversation,
    sharedClients,
    documentTitle,
    isCreatingDocument,
    streamingContent,
    streamingIsHtml,
    documentPath,

    // Computed
    isNewDocument,
    isTemporaryDocument,
    token,
    tab,
    documentId,
    folderId,

    // Actions
    setFolder,
    setConversation,
    setSharedClients,
    setDocumentTitle,
    setIsCreatingDocument,
    setStreamingContent,
    setStreamingIsHtml,
    loadConversation,
    refreshSharedClients,
    navigate,
    location,
    loadingConversation,
  };
};
