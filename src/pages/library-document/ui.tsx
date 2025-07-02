import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DocumentsService, IDocument } from "entities/document";
import { SearchAiChatInput } from "entities/search/ui/chat-input";
import { ChatActions, ChatLoading, RelatedContent } from "features/chat";
import parse from "html-react-parser";

export const LibraryDocument = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [messages, setMessages] = useState([]);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [document, setDocument] = useState<IDocument | null>(null);

  const loadDocument = async (docId: string | undefined) => {
    if (!docId) return;
    try {
      const response = await DocumentsService.getDocumentById(docId);
      if (response) {
        setDocument(response);
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      setDocument(null);
    }
  };

  useEffect(() => {
    loadDocument(documentId);
  }, [documentId]);

  return (
    <div className="flex flex-col w-full h-full gap-6 p-6">
      <div className="flex flex-row w-full h-full gap-6 max-h-[calc(100vh-6rem)] relative">
        <ChatActions
          onRegenerate={() => {}}
          isSearching={false}
          hasMessages={messages.length >= 2}
        />

        {isLoadingSession ? (
          <ChatLoading />
        ) : (
          <div className="relative flex flex-col w-full h-full pr-4 overflow-y-auto">
            {document && (
              <div className="p-[24px] rounded-[16px] bg-white">
                <div className="ml-auto p-[24px] bg-[#F6F6F6] border border-[#EAEAEA] rounded-[16px] max-w-[310px] md:max-w-[563px] xl:max-w-[800px] flex flex-col gap-[8px] mb-[40px]">
                  <p className="text-[24px] font-[500] text-[#1D1D1F]">
                    {document.title}
                  </p>
                  <p className="text-[18px] font-[500] text-[#1D1D1F]">
                    {document.query}
                  </p>
                </div>

                <div className="prose-sm prose max-w-none">
                  {parse(document.content)}
                </div>
              </div>
            )}
            <SearchAiChatInput
              placeholder="Your message"
              disabled={false}
              className="mt-4 rounded-[8px]"
            />
          </div>
        )}

        <RelatedContent />
      </div>
    </div>
  );
};
