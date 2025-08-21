import { CoachService, ShareContentData } from "entities/coach";
import { RootState } from "entities/store";
import { useSelector } from "react-redux";

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
  loadDocument: (docId: string) => Promise<void>;
}

export const useDocumentCreation = () => {
  const practitionerName = useSelector(
    (state: RootState) => state.user.user?.name
  );
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
      loadDocument,
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
            await CoachService.shareContent(
              data,
              practitionerName || "Practitioner",
              params.documentName || "document"
            );
          }

          await loadConversation(documentId);
          const response = await CoachService.getContentShares(realDocumentId);
          setSharedClients(response.shares);
          setIsCreatingDocument(false);
          navigate(
            `/content-manager/library/folder/${folderId}/document/${realDocumentId}`,
            { replace: true }
          );
          loadDocument(realDocumentId);
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
