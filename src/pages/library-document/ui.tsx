import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DocumentsService, IDocument } from "entities/document";
import { ChatActions, ChatLoading } from "features/chat";
import parse from "html-react-parser";
import { LibrarySmallChat } from "widgets/library-small-chat";
import { RootState } from "entities/store";
import { useSelector, useDispatch } from "react-redux";
import { HealthHistoryService } from "entities/health-history";
import {
  setHealthHistory,
  setLoading,
  setError,
} from "entities/health-history/lib";
import LoadingIcon from "shared/assets/icons/loading-icon";
import { DocumentLoadingSkeleton } from "./lib";
import { ContentService, ContentStatus } from "entities/content";

export const LibraryDocument = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [messages] = useState([]);
  const [isLoadingSession] = useState(false);
  const [document, setDocument] = useState<IDocument | null>(null);
  const [isLoadingDocument, setIsLoadingDocument] = useState(true);

  const healthHistory = useSelector(
    (state: RootState) => state.healthHistory.data
  );
  const dispatch = useDispatch();
  const isMobileChatOpen = useSelector(
    (state: RootState) => state.client.isMobileChatOpen
  );

  useEffect(() => {
    const fetchHealthHistory = async () => {
      try {
        dispatch(setLoading(true));
        const data = await HealthHistoryService.getUserHealthHistory();
        dispatch(setHealthHistory(data));
      } catch (error: any) {
        dispatch(setError("Failed to load user health history"));
        console.error("Health history fetch error:", error);
      }
    };

    if (healthHistory === undefined) {
      fetchHealthHistory();
    }
  }, [dispatch, healthHistory]);

  const loadDocument = async (docId: string | undefined) => {
    if (!docId) return;
    setIsLoadingDocument(true);
    try {
      const response = await DocumentsService.getDocumentById(docId);
      if (response) {
        setDocument(response);
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      setDocument(null);
    } finally {
      setIsLoadingDocument(false);
    }
  };

  useEffect(() => {
    loadDocument(documentId);
  }, [documentId]);

  const onStatusChange = async (status: string) => {
    if (documentId) {
      const newStatus: ContentStatus = {
        content_id: documentId,
        status: status,
      };
      await ContentService.updateStatus(newStatus);
    }
  };

  return (
    <div className={`flex flex-col w-full h-full gap-6 p-6`}>
      {isLoadingDocument && (
        <div className="flex gap-[12px] px-[20px] py-[10px] bg-white text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-[50%] translate-x-[-50%] xl:translate-x-[-25%]">
          <LoadingIcon />
          Please wait, we are loading the information...
        </div>
      )}
      <div className="flex flex-row w-full h-full gap-6 xl:h-[calc(100vh-48px)] relative">
        <div className="hidden xl:block">
          <ChatActions
            initialStatus={document?.readStatus}
            initialRating={document?.userRating}
            onRegenerate={() => {}}
            isSearching={false}
            hasMessages={messages.length >= 2}
            onStatusChange={onStatusChange}
          />
        </div>

        {isLoadingSession ? (
          <ChatLoading />
        ) : (
          <div
            className={`relative flex flex-col w-full h-full xl:pr-4 ${isMobileChatOpen ? "hidden" : "block"}`}
          >
            {isLoadingDocument ? (
              <DocumentLoadingSkeleton />
            ) : document ? (
              <div className="p-[24px] rounded-[16px] bg-white xl:h-[calc(100vh-48px)] xl:overflow-y-auto">
                <div className="ml-auto p-[24px] bg-[#F6F6F6] border border-[#EAEAEA] rounded-[16px] max-w-[310px] md:max-w-[563px] xl:max-w-[800px] flex flex-col gap-[8px] mb-[40px]">
                  <p className="text-[16px] md:text-[24px] font-[600] text-[#1D1D1F]">
                    {document.title}
                  </p>
                  <p className="text-[16px] md:text-[18px] font-[500] text-[#1D1D1F]">
                    {document.query}
                  </p>
                </div>

                <div className="prose-sm prose max-w-none">
                  {parse(document.content)}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-red-500">
                Failed to load the document.
              </div>
            )}

            <div className="xl:hidden block mt-[16px] mb-[16px]">
              <ChatActions
                initialStatus={document?.readStatus}
                initialRating={document?.rating}
                onRegenerate={() => {}}
                isSearching={false}
                hasMessages={messages.length >= 2}
                onStatusChange={onStatusChange}
              />
            </div>
          </div>
        )}

        <div className="hidden xl:block w-full">
          <LibrarySmallChat
            healthHistory={healthHistory}
            isLoading={isLoadingDocument}
          />
        </div>
      </div>
    </div>
  );
};
