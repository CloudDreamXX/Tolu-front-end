import { ChatSocketService } from "entities/chat";
import { ClientService, CoachListItem } from "entities/client";
import { clearAllChatHistory, setFolders } from "entities/client/lib";
import {
  useGetCreatorProfileQuery,
  useGetCreatorPhotoQuery,
  useUpdateStatusMutation,
} from "entities/content";
import { ContentStatus } from "entities/content";
import { useGetDocumentByIdQuery } from "entities/document";
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { phoneMask, toast, usePageWidth } from "shared/lib";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from "shared/ui";
import { HealthProfileForm } from "widgets/health-profile-form";
import { LibrarySmallChat } from "widgets/library-small-chat";
import { DocumentLoadingSkeleton } from "./lib";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import SharePopup from "widgets/share-popup/ui";

const getHeadshotFilename = (url?: string | null): string | null => {
  if (!url) return null;
  const clean = url.trim().split(/[?#]/)[0];
  const parts = clean.split("/").filter(Boolean);
  const last = parts[parts.length - 1] || "";
  return last ? decodeURIComponent(last) : null;
};

export const LibraryDocument = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [messages] = useState([]);
  const [isLoadingSession] = useState(false);
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
  const [sharePopup, setSharePopup] = useState<boolean>(false);
  const [providersOpen, setProvidersOpen] = useState(false);
  const [coaches, setCoaches] = useState<CoachListItem[]>([]);
  const [coachesLoading, setCoachesLoading] = useState(false);
  const [creatorPhoto, setCreatorPhoto] = useState<string | null>(null);

  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const [coachProfiles, setCoachProfiles] = useState<Record<string, any>>({});

  const [coachDialogOpen, setCoachDialogOpen] = useState(false);

  const { data: selectedDocument, isLoading: isLoadingDocument } =
    useGetDocumentByIdQuery(documentId!);
  const { data: creatorProfileData } = useGetCreatorProfileQuery(
    selectedDocument?.creator_id || ""
  );
  const { data: creatorPhotoData } = useGetCreatorPhotoQuery({
    id: creatorProfileData?.creator_id || "",
    filename:
      creatorProfileData?.detailed_profile?.personal_info?.headshot_url
        .split("/")
        .pop() || "",
  });
  const [updateStatus] = useUpdateStatusMutation();

  const selectedCoach = useMemo(
    () => coaches.find((c) => c.coach_id === selectedCoachId) ?? null,
    [coaches, selectedCoachId]
  );

  useEffect(() => {
    if (creatorPhotoData) {
      const objectUrl = URL.createObjectURL(creatorPhotoData);
      setCreatorPhoto(objectUrl);
    }
  }, [creatorPhotoData]);

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      if (
        message.notification.type === "content_share" ||
        message.notification.type === "message"
      ) {
        toast({
          title: message.notification.title,
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

  useEffect(() => {
    return () => {
      dispatch(clearAllChatHistory());
    };
  }, []);

  const fetchCoaches = useCallback(async () => {
    if (coaches.length) return;
    setCoachesLoading(true);
    try {
      const data = await ClientService.getCoaches();
      setCoaches(data.coaches);
    } catch (e) {
      console.error("Failed to load coaches:", e);
    } finally {
      setCoachesLoading(false);
    }
  }, [coaches.length]);

  const fetchPhotoUrl = useCallback(
    async (coachId: string, filename?: string | null) => {
      if (!filename) return null;
      if (photoUrls[coachId]) return photoUrls[coachId];
      try {
        const blob = await ClientService.downloadCoachPhoto(coachId, filename);
        const url = URL.createObjectURL(blob);
        setPhotoUrls((prev) => ({ ...prev, [coachId]: url }));
        return url;
      } catch (e) {
        console.warn("Photo download failed:", e);
        return null;
      }
    },
    [photoUrls]
  );

  const handleOpenCoach = useCallback(
    async (coach: CoachListItem) => {
      setSelectedCoachId(coach.coach_id);
      setCoachDialogOpen(true);

      try {
        if (!coachProfiles[coach.coach_id]) {
          const profile = await ClientService.getCoachProfile(coach.coach_id);
          setCoachProfiles((p) => ({ ...p, [coach.coach_id]: profile }));
          const fn = getHeadshotFilename(
            profile?.detailed_profile?.headshot_url ??
              coach.profile?.headshot_url
          );
          if (fn) void fetchPhotoUrl(coach.coach_id, fn);
        } else {
          const fn = getHeadshotFilename(
            coachProfiles[coach.coach_id]?.detailed_profile?.headshot_url ??
              coach.profile?.headshot_url
          );
          if (fn) void fetchPhotoUrl(coach.coach_id, fn);
        }
      } catch (e) {
        console.error("Failed to load coach profile:", e);
      }
    },
    [coachProfiles, fetchPhotoUrl]
  );

  const onProvidersOpenChange = useCallback(
    (open: boolean) => {
      setProvidersOpen(open);
      if (open) void fetchCoaches();
    },
    [fetchCoaches]
  );

  useEffect(() => {
    return () => {
      Object.values(photoUrls).forEach((u) => URL.revokeObjectURL(u));
    };
  }, [photoUrls]);

  useEffect(() => {
    if (!providersOpen || !coaches.length) return;
    coaches.forEach((c) => {
      if (c.profile?.headshot_url && !photoUrls[c.coach_id]) {
        void fetchPhotoUrl(
          c.coach_id,
          getHeadshotFilename(c.profile?.headshot_url)
        );
      }
    });
  }, [providersOpen, coaches, photoUrls, fetchPhotoUrl]);

  const onStatusChange = async (status: string) => {
    if (documentId) {
      const newStatus: ContentStatus = {
        content_id: documentId,
        status: status,
      };
      await updateStatus(newStatus);
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
        <Popover open={providersOpen} onOpenChange={onProvidersOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="blue2"
              size={isMobile ? "sm" : "icon"}
              className="text-[12px] px-[10px] rounded-full text-[#1C63DB] md:h-14 md:w-14"
            >
              {isMobile ? (
                "Providers"
              ) : (
                <MaterialIcon iconName="groups" fill={1} />
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-fit md:w-[360px] p-0 rounded-[18px] border border-[#1C63DB] shadow-[0px_4px_12px_rgba(0,0,0,0.12)] bg-white"
            align="start"
          >
            <div className="p-3 border-b border-[#EAEAEA]">
              <div className="text-[14px] font-semibold text-[#1D1D1F]">
                Your Providers
              </div>
              <div className="text-[12px] text-muted-foreground">
                Coaches linked to your account
              </div>
            </div>

            <ScrollArea className="max-h-[360px]">
              {coachesLoading ? (
                <div className="p-4 text-sm text-muted-foreground">
                  Loading…
                </div>
              ) : coaches.length ? (
                <ul className="p-2">
                  {coaches.map((c) => {
                    const name = c.basic_info?.name;
                    const photo = photoUrls[c.coach_id];

                    return (
                      <li
                        key={c.coach_id}
                        className="p-2 rounded-[12px] hover:bg-[#F5F5F5] transition-colors"
                      >
                        <button
                          onClick={() => handleOpenCoach(c)}
                          className="w-full text-left flex items-center gap-3"
                        >
                          <div className="h-10 w-10 rounded-full bg-[#E0F0FF] overflow-hidden flex items-center justify-center text-sm font-medium text-[#1C63DB]">
                            {photo ? (
                              <img
                                src={photo}
                                alt={name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              name?.slice(0, 2).toUpperCase()
                            )}
                          </div>

                          <div className="truncate font-medium text-[14px]">
                            {name}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="p-4 text-sm text-muted-foreground">
                  No providers yet.
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <Dialog open={coachDialogOpen} onOpenChange={setCoachDialogOpen}>
          <DialogContent className="max-w-[560px] p-0 rounded-xl overflow-hidden">
            <div className="p-4 flex items-center gap-3 border-b">
              <div className="h-12 w-12 rounded-full bg-[#E0F0FF] overflow-hidden flex items-center justify-center text-sm font-medium text-[#1C63DB]">
                {selectedCoachId && photoUrls[selectedCoachId] ? (
                  <img
                    src={photoUrls[selectedCoachId]}
                    alt={selectedCoach?.basic_info?.name || "Coach"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (selectedCoach?.basic_info?.name || "C")
                    .slice(0, 2)
                    .toUpperCase()
                )}
              </div>

              <div className="min-w-0">
                <div className="text-base font-semibold truncate">
                  {coachProfiles[selectedCoachId!]?.basic_info?.name ||
                    selectedCoach?.basic_info?.name ||
                    "Coach"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {coachProfiles[selectedCoachId!]?.basic_info?.role_name ||
                    "Practitioner"}
                  {coachProfiles[selectedCoachId!]?.relationship_details
                    ?.is_primary_coach === "yes"
                    ? " • Primary coach"
                    : ""}
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3 text-sm">
              <p className="leading-relaxed">
                {coachProfiles[selectedCoachId!]?.detailed_profile?.bio ||
                  selectedCoach?.profile?.bio ||
                  "No bio provided."}
              </p>

              <div className="grid grid-cols-2 gap-y-1 gap-x-3">
                <span className="text-muted-foreground">Email:</span>
                {coachProfiles[selectedCoachId!]?.basic_info?.email || "—"}

                <span className="text-muted-foreground">Phone:</span>
                {(coachProfiles[selectedCoachId!]?.basic_info?.phone &&
                  phoneMask(
                    coachProfiles[selectedCoachId!]?.basic_info?.phone
                  )) ||
                  "—"}

                <span className="text-muted-foreground">Timezone:</span>
                {coachProfiles[selectedCoachId!]?.detailed_profile?.timezone ||
                  "—"}

                <span className="text-muted-foreground">Languages:</span>
                {(
                  coachProfiles[selectedCoachId!]?.detailed_profile
                    ?.languages || []
                ).join(", ") || "—"}

                <span className="text-muted-foreground">Experience:</span>
                {coachProfiles[selectedCoachId!]?.detailed_profile
                  ?.years_experience ?? "—"}

                <span className="text-muted-foreground">Working duration:</span>
                {coachProfiles[selectedCoachId!]?.relationship_details
                  ?.working_duration || "—"}
              </div>
            </div>

            <Button onClick={() => setCoachDialogOpen(false)}>Close</Button>
          </DialogContent>
        </Dialog>

        <Button
          variant="blue2"
          size={isMobile ? "sm" : "icon"}
          className="text-[12px] px-[10px] rounded-full text-[#1C63DB] md:h-14 md:w-14"
          disabled
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
                {creatorProfileData && (
                  <Avatar className="object-cover w-[80px] h-[80px] rounded-full">
                    <AvatarImage src={creatorPhoto || undefined} />
                    <AvatarFallback className="text-3xl bg-slate-300 ">
                      {creatorProfileData.detailed_profile.personal_info
                        .first_name !== "" &&
                      creatorProfileData.detailed_profile.personal_info
                        .first_name !== null &&
                      creatorProfileData.detailed_profile.personal_info
                        .last_name !== null &&
                      creatorProfileData.detailed_profile.personal_info
                        .last_name !== "" ? (
                        <div className="flex items-center">
                          <span>
                            {creatorProfileData.detailed_profile.personal_info.first_name.slice(
                              0,
                              1
                            )}
                          </span>
                          <span>
                            {creatorProfileData.detailed_profile.personal_info.last_name.slice(
                              0,
                              1
                            )}
                          </span>
                        </div>
                      ) : (
                        creatorProfileData.basic_info.name.slice(0, 1)
                      )}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="text-[18px] text-[#111827] text-center font-semibold">
                  {creatorProfileData?.basic_info.name}
                </div>
              </div>
              <div className="text-[16px] text-[#5F5F65] whitespace-pre-line w-full">
                Bio: <br />{" "}
                {creatorProfileData?.detailed_profile.personal_info.bio ||
                  "No bio provided."}
              </div>
            </div>
          )}
        </div>
      )}
      {isLoadingDocument && (
        <div className="flex items-center gap-[12px] px-[20px] py-[10px] bg-white text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-[50%] translate-x-[-50%] xl:translate-x-[-25%]">
          <span className="inline-flex h-5 w-5 items-center justify-center">
            <MaterialIcon
              iconName="progress_activity"
              className="text-blue-600 animate-spin"
            />
          </span>
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
            setSharePopup={setSharePopup}
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
                onRegenerate={() => {}}
                isSearching={false}
                hasMessages={messages.length >= 2}
                onStatusChange={onStatusChange}
                onReadAloud={handleReadAloud}
                isReadingAloud={isReadingAloud}
                setSharePopup={setSharePopup}
              />
            </div>
          </div>
        )}

        {sharePopup && documentId && (
          <SharePopup
            contentId={documentId}
            onClose={() => setSharePopup(false)}
            coachId={creatorProfileData?.creator_id || ""}
          />
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
