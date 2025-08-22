import { zodResolver } from "@hookform/resolvers/zod";
import { MagnifyingGlassPlusIcon } from "@phosphor-icons/react";
import { ClientService } from "entities/client";
import {
  addMessageToChat,
  setActiveChat,
  setFilesToChat,
  setFolderToChat,
  setLastChatId,
  setMessagesToChat,
} from "entities/client/lib";
import { CoachService } from "entities/coach";
import { LibraryChatInput } from "entities/search";
import { SearchService, StreamChunk } from "entities/search/api";
import { RootState } from "entities/store";
import { ChatActions, ChatBreadcrumb, Message } from "features/chat";
import { joinReplyChunksSafely } from "features/chat/ui/message-bubble/lib";
import { Paperclip, Send, Settings } from "lucide-react";
import { caseBaseSchema } from "pages/content-manager";
import {
  CaseSearchForm,
  FormValues,
} from "pages/content-manager/create/case-search";
import { useEffect, useState } from "react";
import { useForm, useFormState, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Card, CardContent, CardFooter, CardHeader } from "shared/ui";
import {
  PopoverAttach,
  PopoverClient,
  PopoverFolder,
  PopoverInstruction,
} from "widgets/content-popovers";
import { MessageList } from "widgets/message-list";
import { MessageLoadingSkeleton } from "./components/MessageLoadingSkeleton";
import { extractVoiceText, generateCaseStory } from "./helpers";
import { SWITCH_CONFIG, SWITCH_KEYS, SwitchValue } from "./switch-config";
import { usePageWidth } from "shared/lib";

interface LibrarySmallChatProps {
  isCoach?: boolean;
  isDraft?: boolean;
  footer?: React.ReactNode;
  setMessage?: React.Dispatch<React.SetStateAction<string>>;
  isLoading?: boolean;
  selectedText?: string;
  deleteSelectedText?: () => void;
}

export const LibrarySmallChat: React.FC<LibrarySmallChatProps> = ({
  isCoach,
  isLoading,
  selectedText,
  deleteSelectedText,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isCreatePage = location.pathname === "/content-manager/create";
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const loading = useSelector((state: RootState) => state.client.loading);
  const chat = useSelector((state: RootState) => state.client.chat);
  const lastChatId = useSelector((state: RootState) => state.client.lastChatId);
  const activeChatKey = useSelector(
    (state: RootState) => state.client.activeChatKey
  );
  const chatState = useSelector(
    (state: RootState) => state.client.chatHistory[activeChatKey] || []
  );
  const folderState = useSelector(
    (state: RootState) => state.client.selectedChatFolder || null
  );
  const filesState = useSelector(
    (state: RootState) => state.client.selectedChatFiles || []
  );
  const { isMobileOrTablet } = usePageWidth();

  const { documentId } = useParams();
  const config = isCoach
    ? SWITCH_CONFIG.coach
    : documentId
      ? SWITCH_CONFIG.personalize
      : SWITCH_CONFIG.default;

  const [selectedSwitch, setSelectedSwitch] = useState<string>(
    config.defaultOption
  );

  const lastId = location.state?.lastId;
  const isSwitch = (value: SwitchValue) => selectedSwitch === value;

  const [isSearching, setIsSearching] = useState(false);
  const [streamingText, setStreamingText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [chatTitle, setChatTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [clientId, setClientId] = useState<string | null>(null);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [existingInstruction, setExistingInstruction] = useState<string>("");
  const [instruction, setInstruction] = useState<string>("");
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [voiceContent, setVoiceContent] = useState<string>("");
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  useEffect(() => {
    if (activeChatKey) {
      setSelectedSwitch(activeChatKey);
    } else {
      const switchKey = isCreatePage ? SWITCH_KEYS.RESEARCH : config.options[0];
      dispatch(setActiveChat(switchKey));
      setSelectedSwitch(switchKey);
    }
  }, [activeChatKey, dispatch]);

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

      voice ??=
        availableVoices.find(
          (v) => v.name === "Google UK English Male" && v.lang === "en-GB"
        ) || null;

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
    if (chat?.[0]?.answer) {
      setVoiceContent(extractVoiceText(chat[0].answer));
    }
  }, [chat]);

  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        setIsReadingAloud(false);
      }
    };
  }, [currentChatId]);

  const handleReadAloud = () => {
    setIsReadingAloud((prev) => !prev);
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    } else {
      const utterance = new SpeechSynthesisUtterance(voiceContent);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        speechSynthesis.cancel();
      };

      speechSynthesis.speak(utterance);
    }
  };

  const caseForm = useForm<FormValues>({
    resolver: zodResolver(caseBaseSchema),
    defaultValues: {
      age: "",
      employmentStatus: "",
      menopausePhase: "",
      symptoms: "",
      diagnosedConditions: "",
      medication: "",
      lifestyleFactors: "",
      previousInterventions: "",
      interventionOutcome: "",
      suspectedRootCauses: "",
      protocol: "",
      goal: "",
    },
  });

  const watchedCaseValues = useWatch({ control: caseForm.control });
  const { isValid } = useFormState({ control: caseForm.control });

  useEffect(() => {
    const fetchChat = async () => {
      if (lastId) {
        await loadExistingSession(lastId);
      }
    };
    fetchChat();
  }, []);

  useEffect(() => {
    const fetchChat = async () => {
      if (lastChatId) {
        await loadExistingSession(lastChatId);
      }
    };
    fetchChat();
  }, []);

  useEffect(() => {
    if (isValid) {
      const message = generateCaseStory(watchedCaseValues);
      setMessage?.(message);
    }
  }, [isValid]);

  const loadExistingSession = async (chatId: string) => {
    setIsLoadingSession(true);
    setError(null);

    try {
      const sessionData = await CoachService.getSessionById(chatId);
      dispatch(setLastChatId(chatId));

      if (sessionData && sessionData.search_results.length > 0) {
        const chatMessages: Message[] = [];

        sessionData.search_results.forEach((item) => {
          if (item.query) {
            chatMessages.push({
              id: `user-${item.id}`,
              type: "user",
              content: item.query,
              timestamp: new Date(item.created_at),
            });
          }

          if (item.content) {
            let content = item.content;
            let document = item.content;

            if (item.content.includes("Relevant Content")) {
              const parts = item.content.split("Relevant Content");
              content = parts[0].trim();
              document = item.content;
            }

            chatMessages.push({
              id: `ai-${item.id}`,
              type: "ai",
              content,
              timestamp: new Date(item.created_at),
              document,
            });
          }
        });

        chatMessages.sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        );

        dispatch(
          setMessagesToChat({ chatKey: chatId, messages: chatMessages })
        );

        if (sessionData.search_results[0]?.title) {
          setChatTitle(sessionData.search_results[0].title);
        }

        setCurrentChatId(chatId);
      }
    } catch (error) {
      console.error("Error loading chat session:", error);
      setError("Failed to load chat session");
    } finally {
      setIsLoadingSession(false);
    }
  };

  const handleSwitchChange = (value: string) => {
    setIsSwitchLoading(true);

    if (abortController) {
      abortController.abort();
    }

    setIsSwitchLoading(false);
    setIsSearching(false);
    setSelectedSwitch(value);
    dispatch(setActiveChat(value));
  };

  const handleNewMessage = async (
    message: string
  ): Promise<string | undefined> => {
    if ((!message.trim() && filesState.length === 0) || isSearching) return;

    const newAbortController = new AbortController();
    setAbortController(newAbortController);

    const imageMime = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const previewImages = filesState
      .filter((f) => imageMime.includes(f.type))
      .map((f) => URL.createObjectURL(f));

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
      images: previewImages,
    };

    dispatch(
      addMessageToChat({ chatKey: activeChatKey, message: userMessage })
    );

    setMessage("");
    setIsSearching(true);
    setStreamingText("");
    setError(null);

    const {
      images,
      pdf,
      errors: fileErrors,
    } = await SearchService.prepareFilesForSearch(filesState);

    if (fileErrors.length > 0) {
      setError(fileErrors.join("\n"));
      setIsSearching(false);
      return;
    }

    let accumulatedText = "";
    const replyChunks: string[] = [];
    let returnedChatId = currentChatId;
    let str = "";

    try {
      const isLearn = isSwitch(SWITCH_KEYS.LEARN);

      const processChunk = (chunk: StreamChunk) => {
        if (!chunk.reply) return;

        if (isLearn && chunk.reply.includes("Relevant Content")) {
          str = chunk.reply;
          return;
        }

        if (isLearn) {
          replyChunks.push(chunk.reply);
          const joined = joinReplyChunksSafely(replyChunks);
          setStreamingText(joined);
        } else {
          accumulatedText += chunk.reply;
          setStreamingText(accumulatedText);
        }
      };

      const processFinal = (finalData: any) => {
        setIsSearching(false);
        if (deleteSelectedText) deleteSelectedText();

        const chatId =
          finalData?.searched_result_id ||
          finalData?.chat_id ||
          finalData?.chatId ||
          "";
        dispatch(setLastChatId(chatId));

        const aiMessage: Message = {
          id: chatId || Date.now().toString(),
          type: "ai",
          content: isLearn
            ? joinReplyChunksSafely(replyChunks)
            : accumulatedText,
          timestamp: new Date(),
          document: str,
        };

        dispatch(
          addMessageToChat({ chatKey: activeChatKey, message: aiMessage })
        );
        setVoiceContent(extractVoiceText(aiMessage.content));
        setStreamingText("");

        if (!lastId && chatId && chatId !== currentChatId) {
          setCurrentChatId(chatId);
          returnedChatId = chatId;
        }

        if (finalData?.chat_title) {
          setChatTitle(finalData.chat_title);
        }
      };

      if (isSwitch(SWITCH_KEYS.CREATE)) {
        const res = await CoachService.aiLearningSearch(
          {
            user_prompt: message,
            is_new: !currentChatId,
            chat_id: currentChatId,
            regenerate_id: null,
            chat_title: "",
            instructions: instruction,
          },
          folderState!,
          images,
          pdf,
          clientId,
          newAbortController.signal,
          processChunk,
          processFinal
        );
        dispatch(setLastChatId(res.documentId));
        await loadExistingSession(res.documentId);

        if (res.chatId && res.documentId) {
          navigate(
            `/content-manager/library/folder/${folderState}/document/${res.documentId}`,
            {
              state: {
                selectedSwitch: SWITCH_KEYS.CREATE,
                lastId: res.chatId,
                docId: res.documentId,
              },
            }
          );
        }
      } else if (isSwitch(SWITCH_KEYS.CASE)) {
        const res = await CoachService.aiLearningSearch(
          {
            user_prompt: message,
            is_new: !currentChatId,
            chat_id: currentChatId,
            regenerate_id: null,
            chat_title: "",
            instructions: instruction,
          },
          folderState!,
          images,
          pdf,
          clientId,
          newAbortController.signal,
          processChunk,
          processFinal
        );

        if (res.chatId && res.documentId) {
          navigate(
            `/content-manager/library/folder/${folderState}/document/${res.documentId}`,
            {
              state: {
                selectedSwitch: SWITCH_KEYS.CASE,
                lastId: res.chatId,
                docId: res.documentId,
              },
            }
          );
        }
      } else if (isSwitch(SWITCH_KEYS.CONTENT) && documentId) {
        await ClientService.aiPersonalizedSearch(
          JSON.stringify({
            user_prompt: message,
            is_new: !currentChatId,
            chat_id: currentChatId,
            regenerate_id: null,
            personalize: false,
            text_quote: selectedText,
          }),
          documentId,
          images,
          pdf,
          processChunk,
          processFinal,
          newAbortController.signal
        );
      } else if (isSwitch(SWITCH_KEYS.RESEARCH)) {
        await SearchService.aiCoachResearchStream(
          {
            chat_message: JSON.stringify({
              user_prompt: message,
              is_new: !currentChatId,
              chat_id: currentChatId,
              text_quote: selectedText,
            }),
            images,
            pdf,
            contentId: documentId,
            clientId: clientId ?? undefined,
          },
          processChunk,
          processFinal,
          (error) => {
            setIsSearching(false);
            setError(error.message);
            console.error("Search error:", error);
          },
          newAbortController.signal
        );
      } else {
        await SearchService.aiSearchStream(
          {
            chat_message: JSON.stringify({
              user_prompt: message,
              is_new: !currentChatId,
              chat_id: currentChatId,
              regenerate_id: null,
              personalize: false,
              text_quote: selectedText,
            }),
            ...(images && { images }),
            ...(pdf && { pdf }),
          },
          processChunk,
          processFinal,
          (error) => {
            setIsSearching(false);
            setError(error.message);
            console.error("Search error:", error);
          },
          isSwitch(SWITCH_KEYS.LEARN),
          newAbortController.signal
        );
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Search failed");
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }

    return returnedChatId;
  };

  const handleNewChatOpen = () => {
    setCurrentChatId("");
    setStreamingText("");
    setChatTitle("");
    setError(null);
    setClientId(null);
  };

  const handleSetFiles = (files: File[]) => {
    dispatch(setFilesToChat(files));
  };

  const handleSetFolder = (folder: string | null) => {
    dispatch(setFolderToChat(folder));
  };

  return (
    <>
      <div className="xl:hidden mb-[16px]">
        <ChatBreadcrumb
          displayChatTitle={chatTitle}
          path={"/content-manager/create"}
          pathTitle={"Ask Tolu"}
        />
      </div>
      {isSwitch(SWITCH_KEYS.CASE) ? (
        <Card className="relative flex flex-col w-full h-full overflow-auto border-none rounded-2xl">
          <CardHeader className="relative flex flex-col items-center gap-4">
            <div className="p-1.5 bg-[#1C63DB] rounded-lg text-white font-[500] text-[18px] flex items-center justify-center font-open">
              {selectedSwitch}
            </div>
            <button
              className="xl:absolute right-[24px] top-[18px] flex flex-row items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#1C63DB] bg-[#DDEBF6] rounded-full w-full md:w-fit"
              onClick={handleNewChatOpen}
            >
              <MagnifyingGlassPlusIcon width={24} height={24} /> New Search
            </button>
          </CardHeader>
          <div className="border-t border-[#DDEBF6] w-full mb-[24px]" />
          <CardContent className="flex flex-1 w-full h-full px-6 pb-0 overflow-auto">
            {chatState.length > 0 && (
              <div className="w-fit h-fit">
                <ChatActions
                  isSearching={isSearching}
                  hasMessages={chatState.length >= 2}
                  isHistoryPopup
                  fromPath={location.state?.from?.pathname ?? null}
                  initialRating={
                    chat.length ? (chat[0].liked ? 5 : undefined) : undefined
                  }
                  onReadAloud={handleReadAloud}
                  isReadingAloud={isReadingAloud}
                  currentChatId={
                    (chat && chat[0]?.id) || currentChatId || undefined
                  }
                />
              </div>
            )}
            <div className="p-[24px] border border-[#008FF6] rounded-[20px] overflow-auto mt-auto ml-[16px]">
              {!isCreatePage && (
                <p className="text-[24px] text-[#1D1D1F] font-[500]">
                  Case Search
                </p>
              )}
              <form onSubmit={(e) => e.preventDefault()}>
                <CaseSearchForm form={caseForm} />
              </form>
            </div>
          </CardContent>
          <CardFooter className="w-full p-0">
            <LibraryChatInput
              setFiles={handleSetFiles}
              files={filesState}
              className="w-full p-6 border-none rounded-t-none rounded-b-2xl"
              onSend={handleNewMessage}
              disabled={isSearching}
              switchOptions={config.options}
              selectedSwitch={selectedSwitch}
              setSelectedSwitch={(value) => {
                handleNewChatOpen();
                handleSwitchChange(value);
              }}
              deleteSelectedText={deleteSelectedText}
              message={message}
              footer={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[10px]">
                    <PopoverAttach
                      files={filesState}
                      setFiles={handleSetFiles}
                      existingFiles={existingFiles}
                      disabled={!folderState}
                      customTrigger={
                        <Button
                          variant="ghost"
                          className="relative text-[#1D1D1F] bg-[#F3F6FB] rounded-full w-12 h-12 hover:bg-secondary/80"
                        >
                          <Paperclip size={24} />
                          {filesState.length > 0 && (
                            <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -right-1">
                              {filesState.length > 99
                                ? "99+"
                                : filesState.length}
                            </span>
                          )}
                        </Button>
                      }
                    />
                    <PopoverClient
                      setClientId={setClientId}
                      documentName={chatTitle}
                    />
                    <PopoverFolder
                      folderId={folderState || undefined}
                      setFolderId={handleSetFolder}
                      setExistingFiles={setExistingFiles}
                      setExistingInstruction={setExistingInstruction}
                    />
                    <PopoverInstruction
                      customTrigger={
                        <Button
                          variant="ghost"
                          className="relative text-[#1D1D1F] bg-[#F3F6FB] rounded-full w-12 h-12 hover:bg-secondary/80"
                          disabled={!folderState}
                        >
                          <Settings />
                          {instruction?.length > 0 && (
                            <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -right-1">
                              1
                            </span>
                          )}
                        </Button>
                      }
                      existingInstruction={existingInstruction}
                      setInstruction={setInstruction}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      handleNewMessage(message);
                    }}
                    disabled={isSearching || !folderState || message === ""}
                    className="w-6 h-6 p-0 rounded-full disabled:opacity-[0.5] disabled:cursor-not-allowed"
                  >
                    <Send size={24} color="black" />
                  </Button>
                </div>
              }
              isLoading={isLoading}
            />
          </CardFooter>
        </Card>
      ) : (
        <Card className="relative flex flex-col w-full h-full border-none rounded-2xl">
          <CardHeader className="relative flex flex-col items-center gap-2">
            <div className="p-1.5 bg-[#1C63DB] rounded-lg text-white font-[500] text-[18px] flex items-center justify-center font-open">
              {selectedSwitch}
            </div>
            {isSwitch(SWITCH_KEYS.DEF) && (
              <p className="text-[18px] text-[#1D1D1F] font-[600]">
                Get Personalized Answers
              </p>
            )}
            {isSwitch(SWITCH_KEYS.LEARN) && (
              <p className="text-[18px] text-[#1D1D1F] font-[600]">
                Get Expert-verified Guidance You Can Trust
              </p>
            )}
            <button
              className="md:absolute right-[24px] top-[18px] flex flex-row items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#1C63DB] bg-[#DDEBF6] rounded-full w-full md:w-fit"
              onClick={handleNewChatOpen}
            >
              <MagnifyingGlassPlusIcon width={24} height={24} />{" "}
              {isSwitch(SWITCH_KEYS.CREATE) ? "New content" : "New Search"}
            </button>
          </CardHeader>
          <CardContent
            className={`flex flex-1 w-full h-full min-h-0 overflow-y-auto ${isCoach ? "pb-0" : ""}`}
          >
            {chatState.length > 0 && isCoach && !isMobileOrTablet && (
              <div className="w-fit h-fit">
                <ChatActions
                  isSearching={isSearching}
                  hasMessages={chatState.length >= 2}
                  isHistoryPopup
                  fromPath={location.state?.from?.pathname ?? null}
                  initialRating={
                    chat.length ? (chat[0].liked ? 5 : undefined) : undefined
                  }
                  onReadAloud={handleReadAloud}
                  isReadingAloud={isReadingAloud}
                  currentChatId={
                    (chat && chat[0]?.id) || currentChatId || undefined
                  }
                />
              </div>
            )}
            {loading || isLoading || isSwitchLoading || isLoadingSession ? (
              <MessageLoadingSkeleton />
            ) : chatState.length ? (
              <MessageList
                messages={chatState}
                isSearching={isSearching}
                streamingText={streamingText}
                error={error}
              />
            ) : (
              <div></div>
            )}
          </CardContent>
          {chatState.length > 0 && isCoach && isMobileOrTablet && (
            <div className="w-fit mx-auto h-fit mb-[16px]">
              <ChatActions
                isSearching={isSearching}
                hasMessages={chatState.length >= 2}
                isHistoryPopup
                fromPath={location.state?.from?.pathname ?? null}
                initialRating={
                  chat.length ? (chat[0].liked ? 5 : undefined) : undefined
                }
                onReadAloud={handleReadAloud}
                isReadingAloud={isReadingAloud}
                currentChatId={
                  (chat && chat[0]?.id) || currentChatId || undefined
                }
              />
            </div>
          )}
          <CardFooter className="w-full p-0">
            <LibraryChatInput
              files={filesState}
              setFiles={handleSetFiles}
              className="w-full p-6 border-t rounded-t-none rounded-b-2xl"
              onSend={handleNewMessage}
              disabled={
                isSearching ||
                (isSwitch(SWITCH_KEYS.CREATE) && !folderState) ||
                message === ""
              }
              selectedText={selectedText}
              message={message}
              deleteSelectedText={deleteSelectedText}
              switchOptions={config.options}
              selectedSwitch={selectedSwitch}
              setSelectedSwitch={(value) => {
                handleNewChatOpen();
                handleSwitchChange(value);
              }}
              setNewMessage={setMessage}
              footer={
                isSwitch(SWITCH_KEYS.CREATE) ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[10px]">
                      <PopoverAttach
                        files={filesState}
                        setFiles={handleSetFiles}
                        existingFiles={existingFiles}
                        disabled={!folderState}
                        customTrigger={
                          <Button
                            variant="ghost"
                            className="relative text-[#1D1D1F] bg-[#F3F6FB] rounded-full w-12 h-12 hover:bg-secondary/80"
                          >
                            <Paperclip size={24} />
                            {filesState.length > 0 && (
                              <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -right-1">
                                {filesState.length > 99
                                  ? "99+"
                                  : filesState.length}
                              </span>
                            )}
                          </Button>
                        }
                      />
                      <PopoverClient
                        setClientId={setClientId}
                        documentName={chatTitle}
                      />
                      <PopoverFolder
                        folderId={folderState || undefined}
                        setFolderId={handleSetFolder}
                        setExistingFiles={setExistingFiles}
                        setExistingInstruction={setExistingInstruction}
                      />
                      <PopoverInstruction
                        customTrigger={
                          <Button
                            variant="ghost"
                            className="relative text-[#1D1D1F] bg-[#F3F6FB] rounded-full w-12 h-12 hover:bg-secondary/80"
                            disabled={!folderState}
                          >
                            <Settings />
                            {instruction?.length > 0 && (
                              <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -right-1">
                                1
                              </span>
                            )}
                          </Button>
                        }
                        existingInstruction={existingInstruction}
                        setInstruction={setInstruction}
                      />
                    </div>
                    <Button
                      onClick={() => {
                        handleNewMessage(message);
                      }}
                      disabled={isSearching || !folderState || message === ""}
                      className="w-6 h-6 p-0 rounded-full disabled:opacity-[0.5] disabled:cursor-not-allowed"
                    >
                      <Send size={24} color="black" />
                    </Button>
                  </div>
                ) : isSwitch(SWITCH_KEYS.RESEARCH) ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[10px]">
                      <PopoverAttach
                        files={filesState}
                        setFiles={handleSetFiles}
                        existingFiles={existingFiles}
                        disabled={false}
                        customTrigger={
                          <Button
                            variant="ghost"
                            className="relative text-[#1D1D1F] bg-[#F3F6FB] rounded-full w-12 h-12 hover:bg-secondary/80"
                          >
                            <Paperclip size={24} />
                            {filesState.length > 0 && (
                              <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -right-1">
                                {filesState.length > 99
                                  ? "99+"
                                  : filesState.length}
                              </span>
                            )}
                          </Button>
                        }
                      />
                      <PopoverClient
                        setClientId={setClientId}
                        documentName={chatTitle}
                      />
                    </div>
                    <Button
                      onClick={() => {
                        handleNewMessage(message);
                      }}
                      disabled={isSearching || message === ""}
                      className="w-6 h-6 p-0 rounded-full disabled:opacity-[0.5] disabled:cursor-not-allowed"
                    >
                      <Send size={24} color="black" />
                    </Button>
                  </div>
                ) : undefined
              }
              isLoading={isLoading}
            />
          </CardFooter>
        </Card>
      )}
    </>
  );
};
