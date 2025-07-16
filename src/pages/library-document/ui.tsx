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

  return (
    <div className="flex flex-col w-full h-full gap-6 p-6">
      <div className="flex flex-row w-full h-full gap-6 xl:h-[calc(100vh-48px)] relative">
        <div className="hidden xl:block">
          <ChatActions
            onRegenerate={() => {}}
            isSearching={false}
            hasMessages={messages.length >= 2}
          />
        </div>

        {isLoadingSession ? (
          <ChatLoading />
        ) : (
          <div className="relative flex flex-col w-full h-full xl:pr-4">
            {isLoadingDocument ? (
              <div className="p-6 text-center text-muted-foreground">
                Loading document...
              </div>
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
                onRegenerate={() => {}}
                isSearching={false}
                hasMessages={messages.length >= 2}
              />
            </div>
          </div>
        )}

        <div className="hidden xl:block w-full">
          <LibrarySmallChat healthHistory={healthHistory} />
        </div>
      </div>
    </div>
  );
};
