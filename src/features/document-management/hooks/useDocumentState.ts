import { CoachService, ISessionResult, Share } from "entities/coach";
import { DocumentsService, IDocument } from "entities/document";
import { FoldersService, IFolder } from "entities/folder";
import { RootState } from "entities/store";
import { findFilePath, PathEntry } from "features/wrapper-folder-tree";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const useDocumentState = () => {
  const { tab, documentId, folderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { folders } = useSelector((state: RootState) => state.folder);
  const token = useSelector((state: RootState) => state.user.token);

  const [document, setDocument] = useState<IDocument | null>(null);
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

  const loadDocument = async (docId: string | undefined) => {
    if (!docId) return;

    try {
      const response = await DocumentsService.getDocumentById(docId);
      if (response) {
        setDocument(response);
        setDocumentTitle(response.title);
        loadConversation(response.chatId);
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      setDocument(null);
    }
  };

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
      loadDocument(documentId);
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
    setDocument,
    setFolder,
    setConversation,
    setSharedClients,
    setDocumentTitle,
    setIsCreatingDocument,
    setStreamingContent,
    setStreamingIsHtml,
    loadDocument,
    loadConversation,
    refreshSharedClients,
    navigate,
    location,
    loadingConversation,
  };
};
