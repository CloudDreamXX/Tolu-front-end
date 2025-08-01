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
import { ClientService } from "entities/client";
import { setFolders } from "entities/client/lib";
import { useTextSelectionTooltip } from "pages/content-manager/document/lib";

export const LibraryDocument = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [messages] = useState([]);
  const [isLoadingSession] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>(
    null
  );
  const [isLoadingDocument, setIsLoadingDocument] = useState(true);

  const healthHistory = useSelector(
    (state: RootState) => state.healthHistory.data
  );
  const dispatch = useDispatch();
  const isMobileChatOpen = useSelector(
    (state: RootState) => state.client.isMobileChatOpen
  );

  const [textContent, setTextContent] = useState("");
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const { textForInput, tooltipPosition, showTooltip, handleTooltipClick } =
    useTextSelectionTooltip();
  const [isReadingAloud, setIsReadingAloud] = useState<boolean>(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();

      const storedVoice = localStorage.getItem("selectedVoice");

      let voice: SpeechSynthesisVoice | null = null;

      if (storedVoice) {
        const storedVoiceSettings = JSON.parse(storedVoice);
        voice =
          availableVoices.find(
            (v) =>
              v.name === storedVoiceSettings.name &&
              v.lang === storedVoiceSettings.lang
          ) || null;
      }

      if (!voice) {
        voice =
          availableVoices.find(
            (v) => v.name === "Google UK English Male" && v.lang === "en-GB"
          ) || null;
      }

      setSelectedVoice(voice);

      if (voice) {
        const voiceSettings = { name: voice.name, lang: voice.lang };
        localStorage.setItem("selectedVoice", JSON.stringify(voiceSettings));
      }
    };

    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }

    return () => {
      if (speechSynthesis.onvoiceschanged) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    if (selectedDocument) {
      const strippedText = selectedDocument.content.replace(
        /<\/?[^>]+(>|$)/g,
        ""
      );
      setTextContent(strippedText);
    }
  }, [selectedDocument]);

  const handleReadAloud = () => {
    setIsReadingAloud((prev) => !prev);
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    } else {
      const utterance = new SpeechSynthesisUtterance(textContent);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        speechSynthesis.cancel();
      };

      speechSynthesis.speak(utterance);
    }
  };

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
        setSelectedDocument(response);
      }
    } catch (error) {
      console.error("Error fetching document:", error);
      setSelectedDocument(null);
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

    const folders = await ClientService.getLibraryContent();
    dispatch(setFolders(folders.folders));
  };

  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        setIsReadingAloud(false);
      }
    };
  }, [selectedDocument]);

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
            initialStatus={selectedDocument?.readStatus}
            initialRating={selectedDocument?.userRating}
            onRegenerate={() => {}}
            isSearching={false}
            hasMessages={messages.length >= 2}
            onStatusChange={onStatusChange}
            onReadAloud={handleReadAloud}
            isReadingAloud={isReadingAloud}
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
            ) : selectedDocument ? (
              <div className="p-[24px] rounded-[16px] bg-white xl:h-[calc(100vh-48px)] xl:overflow-y-auto">
                <div className="prose-sm prose max-w-none">
                  {showTooltip && tooltipPosition && (
                    <div
                      className="fixed bg-white border border-blue-500 px-2 py-1 rounded-md"
                      style={{
                        top: `${tooltipPosition.top}px`,
                        left: `${tooltipPosition.left}px`,
                        transform: "translateX(-50%)",
                        zIndex: 9999,
                      }}
                    >
                      <button
                        onClick={handleTooltipClick}
                        className="text-black text-[16px] font-semibold"
                      >
                        Ask TOLU
                      </button>
                    </div>
                  )}
                  {parse(selectedDocument.content)}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-red-500">
                Failed to load the document.
              </div>
            )}

            <div className="xl:hidden block mt-[16px] mb-[16px]">
              <ChatActions
                initialStatus={selectedDocument?.readStatus}
                initialRating={selectedDocument?.rating}
                onRegenerate={() => {}}
                isSearching={false}
                hasMessages={messages.length >= 2}
                onStatusChange={onStatusChange}
                onReadAloud={handleReadAloud}
                isReadingAloud={isReadingAloud}
              />
            </div>
          </div>
        )}

        <div className="hidden xl:block w-full">
          <LibrarySmallChat
            healthHistory={healthHistory}
            isLoading={isLoadingDocument}
            selectedText={textForInput}
          />
        </div>
      </div>
    </div>
  );
};
