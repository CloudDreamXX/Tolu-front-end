import { ChatSocketService } from "entities/chat";
import { ClientService } from "entities/client";
import { clearAllChatHistory, setFolders } from "entities/client/lib";
import {
  ContentService,
  ContentStatus,
  CreatorProfile,
} from "entities/content";
import { DocumentsService, IDocument } from "entities/document";
import { HealthHistoryService } from "entities/health-history";
import {
  setError,
  setHealthHistory,
  setLoading,
} from "entities/health-history/lib";
import { RootState } from "entities/store";
import { ChatActions, ChatLoading } from "features/chat";
import parse from "html-react-parser";
import { useTextSelectionTooltip } from "pages/content-manager/document/lib";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast, usePageWidth } from "shared/lib";
import { Avatar, AvatarFallback, AvatarImage, Button } from "shared/ui";
import { HealthProfileForm } from "widgets/health-profile-form";
import { LibrarySmallChat } from "widgets/library-small-chat";
import { DocumentLoadingSkeleton } from "./lib";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

export const LibraryDocument = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [messages] = useState([]);
  const [isLoadingSession] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>(
    null
  );
  const [isLoadingDocument, setIsLoadingDocument] = useState(true);
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [creatorPhoto, setCreatorPhoto] = useState<string | null>(null);
  const [isCreatorCardOpen, setIsCreatorCardOpen] = useState(false);

  const healthHistory = useSelector(
    (state: RootState) => state.healthHistory.data
  );
  const dispatch = useDispatch();

  const [textContent, setTextContent] = useState("");
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const {
    textForInput,
    tooltipPosition,
    showTooltip,
    handleTooltipClick,
    handleDeleteSelectedText,
  } = useTextSelectionTooltip();
  const [isReadingAloud, setIsReadingAloud] = useState<boolean>(false);
  const { isMobile } = usePageWidth();

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      if (message.notification.type === "content_share") {
        toast({
          title: "New Content Shared",
          description: message.notification.message,
        });
      }
    };

    ChatSocketService.on("notification", (message: any) =>
      handleNewMessage(message)
    );

    return () => {
      ChatSocketService.off("notification", (message: any) =>
        handleNewMessage(message)
      );
    };
  }, []);

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
        const creatorData = await ContentService.getCreatorProfile(
          response.creator_id
        );
        setCreator(creatorData);
        if (creatorData.detailed_profile.personal_info.headshot_url) {
          const filename =
            creatorData.detailed_profile.personal_info.headshot_url
              ?.split("/")
              .pop() || "";
          const blob = await ContentService.getCreatorPhoto(
            creatorData.creator_id,
            filename
          );
          const objectUrl = URL.createObjectURL(blob);
          setCreatorPhoto(objectUrl);
        }
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
  }, [documentId, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearAllChatHistory());
    };
  }, []);

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
      <div className="flex items-center gap-2 mb-4 md:gap-4">
        <HealthProfileForm healthHistory={healthHistory} />
        <Button
          variant="brightblue"
          size={isMobile ? "sm" : "icon"}
          className="px-[10px] rounded-full md:h-14 md:w-14"
        >
          {isMobile ? "Providers" : <MaterialIcon iconName="groups" fill={1} />}
        </Button>
        <Button
          variant="blue2"
          size={isMobile ? "sm" : "icon"}
          className="px-[10px] rounded-full text-[#1C63DB] md:h-14 md:w-14"
        >
          {isMobile ? (
            "Communities (soon)"
          ) : (
            <MaterialIcon iconName="language" />
          )}
        </Button>
      </div>
      {!isLoadingDocument && selectedDocument && (
        <div className="w-full xl:w-[50%] flex justify-end text-[16px] text-[#1D1D1F] font-semibold relative">
          Created by{" "}
          {
            <span
              tabIndex={0}
              aria-haspopup="dialog"
              aria-expanded={isCreatorCardOpen}
              onMouseEnter={
                !isMobile ? () => setIsCreatorCardOpen(true) : undefined
              }
              onMouseLeave={
                !isMobile ? () => setIsCreatorCardOpen(false) : undefined
              }
              onFocus={!isMobile ? () => setIsCreatorCardOpen(true) : undefined}
              onBlur={!isMobile ? () => setIsCreatorCardOpen(false) : undefined}
              onClick={
                isMobile ? () => setIsCreatorCardOpen((v) => !v) : undefined
              }
              className="underline ml-[6px] cursor-pointer"
            >
              {selectedDocument.creator_name}
            </span>
          }{" "}
          <span className="ml-[6px]">
            {selectedDocument.published_date
              ? `on ${selectedDocument.published_date}`
              : ""}
          </span>
          {isCreatorCardOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-full max-w-[500px] rounded-2xl border border-[#E5E7EB] bg-white shadow-xl p-4 z-50 flex items-start gap-6"
              onMouseEnter={
                !isMobile ? () => setIsCreatorCardOpen(true) : undefined
              }
              onMouseLeave={
                !isMobile ? () => setIsCreatorCardOpen(false) : undefined
              }
              role="dialog"
              aria-label="Coach details"
            >
              <div className="flex flex-col items-center justify-center gap-3">
                {creatorPhoto ||
                  (creator && (
                    <Avatar className="object-cover w-[80px] h-[80px] rounded-full">
                      <AvatarImage src={creatorPhoto || undefined} />
                      <AvatarFallback className="text-3xl bg-slate-300 ">
                        {creator.detailed_profile.personal_info.first_name !== "" &&
                          creator.detailed_profile.personal_info.first_name !== null &&
                          creator.detailed_profile.personal_info.last_name !== null &&
                          creator.detailed_profile.personal_info.last_name !== ""
                          ? <div className="flex items-center">
                            <span>{creator.detailed_profile.personal_info.first_name.slice(
                              0,
                              1
                            )}</span><span>{creator.detailed_profile.personal_info.last_name.slice(
                              0,
                              1
                            )}</span>
                          </div>
                          : creator.basic_info.name.slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  ))}

                <div className="text-[18px] text-[#111827] font-semibold">
                  {creator?.basic_info.name}
                </div>
              </div>
              <div className="text-[16px] text-[#5F5F65] whitespace-pre-line w-full">
                Bio: <br />{" "}
                {creator?.detailed_profile.personal_info.bio ||
                  "No bio provided."}
              </div>
            </div>
          )}
        </div>
      )}
      {isLoadingDocument && (
        <div className="flex gap-[12px] px-[20px] py-[10px] bg-white text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-[50%] translate-x-[-50%] xl:translate-x-[-25%]">
          <MaterialIcon
            iconName="progress_activity"
            className="text-blue-600 animate-spin"
          />
          Please wait, we are loading the information...
        </div>
      )}
      <div className="flex flex-row w-full h-full gap-6 xl:h-[calc(100vh-48px)] relative">
        <div className="hidden xl:block">
          <ChatActions
            initialStatus={selectedDocument?.readStatus}
            initialRating={selectedDocument?.userRating}
            onRegenerate={() => { }}
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
          <div className={`relative flex flex-col w-full h-full xl:pr-4`}>
            {isLoadingDocument ? (
              <DocumentLoadingSkeleton />
            ) : selectedDocument ? (
              <div className="p-[24px] rounded-[16px] bg-white xl:h-[calc(100vh-48px)] xl:overflow-y-auto">
                <div className="prose-sm prose max-w-none">
                  {showTooltip && tooltipPosition && (
                    <div
                      className="fixed px-2 py-1 bg-white border border-blue-500 rounded-md"
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
                        Ask Tolu
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
                onRegenerate={() => { }}
                isSearching={false}
                hasMessages={messages.length >= 2}
                onStatusChange={onStatusChange}
                onReadAloud={handleReadAloud}
                isReadingAloud={isReadingAloud}
              />
            </div>
          </div>
        )}

        <div className="hidden w-full xl:block">
          <LibrarySmallChat
            isLoading={isLoadingDocument}
            selectedText={textForInput}
            deleteSelectedText={handleDeleteSelectedText}
          />
        </div>
      </div>
    </div>
  );
};
