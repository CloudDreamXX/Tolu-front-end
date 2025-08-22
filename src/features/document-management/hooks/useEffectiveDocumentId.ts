import { useLocation, useMatch, useSearchParams } from "react-router-dom";
import { useMemo } from "react";

type NavState = {
  docId?: string;
  lastId?: string;
  selectedSwitch?: string;
};

export function useEffectiveDocumentId() {
  const location = useLocation();
  const [qs] = useSearchParams();

  const docMatch = useMatch(
    "/content-manager/:tab/folder/:folderId/document/:documentId"
  );
  const chatMatch = useMatch(
    "/content-manager/:tab/folder/:folderId/chat/:chatId"
  );

  return useMemo(() => {
    if (docMatch) {
      const { tab, folderId, documentId } = docMatch.params as {
        tab: string;
        folderId: string;
        documentId: string;
      };
      return {
        documentId,
        tab,
        folderId,
      };
    }

    if (chatMatch) {
      const { tab, folderId, chatId } = chatMatch.params as {
        tab: string;
        folderId: string;
        chatId: string;
      };

      const state = (location.state as NavState | undefined) ?? {};
      const fromState = state.docId;
      const fromQuery = qs.get("docId") ?? undefined;

      return {
        chatId,
        tab,
        folderId,
        documentId: fromState ?? fromQuery,
        source: fromState
          ? ("state" as const)
          : fromQuery
            ? ("query" as const)
            : null,
      };
    }

    return {
      documentId: undefined,
    };
  }, [docMatch, chatMatch, location.state, qs]);
}
