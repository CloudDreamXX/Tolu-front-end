import { useGetDocumentByIdQuery } from "entities/document";
import {
  useLazyGetSessionByIdQuery,
  useLazyGetContentSharesQuery,
  ISessionResult,
  Share,
} from "entities/coach";
import { useGetFoldersQuery, useGetFolderQuery } from "entities/folder/api";
import { IFolder } from "entities/folder";
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
  const [loadingConversation, setLoadingConversation] = useState(false);

  const isNewDocument = location.state?.isNewDocument;
  const isTemporaryDocument = documentId?.startsWith("temp_");

  const dispatch = useDispatch();

  const [getSessionById] = useLazyGetSessionByIdQuery();
  const [getContentShares] = useLazyGetContentSharesQuery();
  const { data: document } = useGetDocumentByIdQuery(documentId!, {
    skip: !documentId,
  });

  const { data: foldersResponse, refetch: refetchFolders } = useGetFoldersQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );

  const { data: folderResponse, refetch: refetchFolder } = useGetFolderQuery(
    folderId!,
    {
      skip: !folderId,
    }
  );

  const loadConversation = async (chatId: string | undefined) => {
    if (!chatId) return;
    setLoadingConversation(true);
    try {
      const response = await getSessionById(chatId).unwrap();
      if (response?.data.search_results) {
        setConversation(response.data.search_results);
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
    try {
      const response = await getContentShares(documentId).unwrap();
      setSharedClients(response.data.shares || []);
    } catch (err) {
      console.error("Error fetching shared clients:", err);
    }
  };

  useEffect(() => {
    if (!foldersResponse || !folderId) return;

    const allFolders = foldersResponse.folders;
    const path = findFilePath(allFolders, documentId ?? "");
    if (path) setDocumentPath(path);

    if (folderResponse) {
      setFolder(folderResponse);
    }
  }, [foldersResponse, folderResponse, folderId, documentId]);

  useEffect(() => {
    if (!isNewDocument && !isTemporaryDocument && documentId) {
      const fetchShared = async () => {
        const response = await getContentShares(documentId).unwrap();
        setSharedClients(response.data.shares || []);
      };
      fetchShared();
    }
  }, [documentId, isNewDocument, isTemporaryDocument]);

  return {
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

    isNewDocument,
    isTemporaryDocument,
    token,
    tab,
    documentId,
    folderId,

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

    refetchFolders,
    refetchFolder,
  };
};
