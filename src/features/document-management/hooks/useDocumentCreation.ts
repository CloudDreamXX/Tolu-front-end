import { CoachService, ShareContentData } from "entities/coach";
import {
  useShareContentMutation,
  useLazyGetContentSharesQuery,
} from "entities/coach";

const isHtmlContent = (content: string): boolean => /<[^>]*>/.test(content);

interface DocumentCreationParams {
  location: any;
  documentId: string | undefined;
  documentName: string;
  folderId: string | undefined;
  clientId: string | null;
  setIsCreatingDocument: (value: boolean) => void;
  setDocumentTitle: (value: string) => void;
  setStreamingContent: (value: string) => void;
  setStreamingIsHtml: (value: boolean) => void;
  loadConversation: (chatId: string | undefined) => Promise<void>;
  setSharedClients: (clients: any) => void;
  navigate: any;
}

export const useDocumentCreation = () => {
  const [shareContent] = useShareContentMutation();

  const [getContentShares] = useLazyGetContentSharesQuery();

  const handleDocumentCreation = async (params: DocumentCreationParams) => {
    const {
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
    } = params;
    if (!location.state) return;

    setIsCreatingDocument(true);
    setDocumentTitle(location.state.originalTitle ?? "New Document");
    setStreamingContent("");
    setStreamingIsHtml(false);

    const {
      chatMessage,
      folderId: stateFolderId,
      files: stateFiles,
      instruction: stateInstruction,
      clientId: stateClientId,
    } = location.state;

    let accumulatedReply = "";

    try {
      await CoachService.aiLearningSearch(
        { ...chatMessage, folder_instructions: stateInstruction ?? "" },
        stateFolderId,
        stateFiles ?? [],
        undefined,
        stateClientId,
        undefined,
        undefined,
        (chunk) => {
          if (chunk.reply) {
            accumulatedReply += chunk.reply;
            setStreamingContent(accumulatedReply);
            if (isHtmlContent(accumulatedReply)) {
              setStreamingIsHtml(true);
            }
          }
        },
        async ({ documentId: realDocumentId }) => {
          if (documentId && clientId) {
            const data: ShareContentData = {
              content_id: realDocumentId,
              client_id: clientId,
            };
            await shareContent(data).unwrap();
          }

          await loadConversation(documentId);

          const response = await getContentShares(realDocumentId).unwrap();
          if (response.shares) {
            setSharedClients(response.shares);
          }
          setIsCreatingDocument(false);
          navigate(
            `/content-manager/library/folder/${folderId}/document/${realDocumentId}`,
            { replace: true }
          );
        }
      );

      window.history.replaceState({}, "", window.location.pathname);
    } catch (error) {
      console.error("Error creating document:", error);
      setIsCreatingDocument(false);
    }
  };

  return {
    handleDocumentCreation,
  };
};
