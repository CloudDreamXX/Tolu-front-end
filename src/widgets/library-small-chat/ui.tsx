import { zodResolver } from "@hookform/resolvers/zod";
import { ClientService } from "entities/client";
import {
  addMessageToChat,
  clearActiveChatHistory,
  clearAllChatHistory,
  setActiveChat,
  setFilesToChat,
  setFolderId,
  setFolderToChat,
  setLastChatId,
  setMessagesToChat,
} from "entities/client/lib";
import { CoachService } from "entities/coach";
import { IDocument } from "entities/document";
import { LibraryChatInput } from "entities/search";
import { SearchService, StreamChunk } from "entities/search/api";
import { RootState } from "entities/store";
import {
  ChatActions,
  ChatBreadcrumb,
  HistoryPopup,
  Message,
} from "features/chat";
import { joinReplyChunksSafely } from "features/chat/ui/message-bubble/lib";
import { caseBaseSchema } from "pages/content-manager";
import {
  CaseSearchForm,
  FormValues,
} from "pages/content-manager/create/case-search";
import { useEffect, useRef, useState } from "react";
import { useForm, useFormState, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { usePageWidth } from "shared/lib";
import { Button, Card, CardContent, CardFooter, CardHeader } from "shared/ui";
import {
  PopoverAttach,
  PopoverClient,
  PopoverFolder,
  PopoverInstruction,
} from "widgets/content-popovers";
import { MessageList } from "widgets/message-list";
import { MessageLoadingSkeleton } from "./components/MessageLoadingSkeleton";
import { extractVoiceText, generateCaseStory, subTitleSwitch } from "./helpers";
import { SWITCH_CONFIG, SWITCH_KEYS, SwitchValue } from "./switch-config";

interface LibrarySmallChatProps {
  isCoach?: boolean;
  isDraft?: boolean;
  footer?: React.ReactNode;
  setMessage?: React.Dispatch<React.SetStateAction<string>>;
  isLoading?: boolean;
  selectedText?: string;
  deleteSelectedText?: () => void;
  onDocumentRefresh?: (docId: string, chatId?: string) => void;
  initialDocument?: IDocument | null;
}

export const LibrarySmallChat: React.FC<LibrarySmallChatProps> = ({
  isCoach,
  isLoading,
  selectedText,
  deleteSelectedText,
  onDocumentRefresh,
  initialDocument,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isCreatePage = location.pathname === "/content-manager/create";
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [sourceId, setSourceId] = useState<string | null>(null);

  const [isSearching, setIsSearching] = useState(false);
  const { loading, chat, lastChatId, activeChatKey } = useSelector(
    (state: RootState) => state.client
  );
  const [currentChatId, setCurrentChatId] = useState<string>(lastChatId || "");
  const currentKey = (currentChatId || lastChatId || activeChatKey) as string;

  const chatState = useSelector(
    (state: RootState) => state.client.chatHistory[currentKey] || []
  );
  const folderState = useSelector(
    (state: RootState) => state.client.selectedChatFolder || null
  );
  const filesState = useSelector(
    (state: RootState) => state.client.selectedChatFiles || []
  );
  const filesFromLibrary = useSelector(
    (state: RootState) => state.client.selectedFilesFromLibrary || []
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
  const isNew = location.state?.isNew;
  const folderId = location.state?.folderId;
  const isSwitch = (value: SwitchValue) => selectedSwitch === value;

  const [streamingText, setStreamingText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [clientId, setClientId] = useState<string | null>(null);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [existingInstruction, setExistingInstruction] = useState<string>(
    initialDocument?.originalInstructions || ""
  );
  const [instruction, setInstruction] = useState<string>("");
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [voiceContent, setVoiceContent] = useState<string>("");
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const prevSearchingRef = useRef(isSearching);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    scrollRef.current?.scrollIntoView({ block: "end", behavior });
  };

  useEffect(() => {
    const wasSearching = prevSearchingRef.current;
    prevSearchingRef.current = isSearching;

    if (wasSearching && !isSearching) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToBottom("smooth");
        });
      });
    }
  }, [isSearching, chatState.length]);

  useEffect(() => {
    if (folderId) {
      setFolderToChat(folderId);
    }
  }, [folderId]);

  useEffect(() => {
    if (isNew) {
      setCurrentChatId("");
    }
  }, [isNew]);

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

  const htmlToText = (html: string) => {
    if (!html) return "";
    const withBreaks = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6]|blockquote)>/gi, "\n");
    const el = document.createElement("div");
    el.innerHTML = withBreaks;
    const text = el.textContent || el.innerText || "";
    return text
      .replace(/\u00A0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .trim();
  };

  useEffect(() => {
    if (!Array.isArray(chatState) || chatState.length === 0) {
      setVoiceContent("");
      return;
    }

    const joined = chatState
      .map((m) => htmlToText(String(m.content ?? "")))
      .filter(Boolean)
      .join("\n\n");

    setVoiceContent(joined);
  }, [chatState.length]);

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
  }, [lastChatId]);

  useEffect(() => {
    if (isValid) {
      const message = generateCaseStory(watchedCaseValues);
      setMessage?.(message);
    }
  }, [isValid]);

  const loadExistingSession = async (chatId: string) => {
    setIsLoadingSession(true);
    setError(null);
    const chatMessages: Message[] = [];

    try {
      if (activeChatKey === "Create content") {
        const sessionData = await CoachService.getSessionById(chatId);

        if (sessionData && sessionData.search_results.length > 0) {
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
        }
      } else {
        const sessionData = await SearchService.getSession(chatId);

        if (sessionData && sessionData.length > 0) {
          sessionData.forEach((item) => {
            if (item.query) {
              chatMessages.push({
                id: `user-${item.id}`,
                type: "user",
                content: item.query,
                timestamp: new Date(item.created_at),
              });
            }

            if (item.answer) {
              let content = item.answer;
              let document = item.answer;

              if (item.answer.includes("Relevant Content")) {
                const parts = item.answer.split("Relevant Content");
                content = parts[0].trim();
                document = item.answer;
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
        }

        if (chatMessages.length > 0) {
          chatMessages.sort(
            (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
          );
          dispatch(
            setMessagesToChat({ chatKey: chatId, messages: chatMessages })
          );
        }

        if (sessionData[0]?.chat_title) {
          setChatTitle(sessionData[0].chat_title);
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

    if (abortController) abortController.abort();

    const preservedFiles = filesState;

    setCurrentChatId("");
    setStreamingText("");
    setChatTitle("");
    setError(null);
    setClientId(null);

    dispatch(clearActiveChatHistory());

    handleSetFolder(null);
    dispatch(setFolderToChat(null));
    dispatch(setFolderId(""));
    setInstruction("");
    setExistingInstruction("");

    setIsSearching(false);
    setSelectedSwitch(value);
    dispatch(setActiveChat(value));
    setIsSwitchLoading(false);

    if (!filesState?.length && preservedFiles?.length) {
      dispatch(setFilesToChat(preservedFiles));
    }
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

    const writeKeyForUser = currentChatId || lastChatId || activeChatKey;

    dispatch(
      addMessageToChat({ chatKey: writeKeyForUser, message: userMessage })
    );

    setMessage("");
    setIsSearching(true);
    setStreamingText("");
    setError(null);

    const {
      files: images,
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
          finalData?.chat_id ||
          finalData?.searched_result_id ||
          finalData?.chatId ||
          "";

        setSourceId(finalData?.searched_result_id || null);
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

        if (!currentChatId && chatId) {
          dispatch(addMessageToChat({ chatKey: chatId, message: userMessage }));
        }

        dispatch(addMessageToChat({ chatKey: chatId, message: aiMessage }));
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
          filesFromLibrary,
          newAbortController.signal,
          processChunk,
          processFinal
        );
        await loadExistingSession(res.documentId);

        if (res.chatId && res.documentId) {
          const targetPath = `/content-manager/library/folder/${folderState}/chat/${res.chatId}`;

          if (location.pathname === targetPath) {
            onDocumentRefresh?.(res.documentId, res.chatId);
          } else {
            navigate(targetPath, {
              state: {
                selectedSwitch: SWITCH_KEYS.CREATE,
                lastId: res.chatId,
                docId: res.documentId,
                folderId: folderState,
              },
            });
          }
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
          undefined,
          newAbortController.signal,
          processChunk,
          processFinal
        );

        if (res.chatId && res.documentId) {
          navigate(
            `/content-manager/library/folder/${folderState}/chat/${res.chatId}`,
            {
              state: {
                selectedSwitch: SWITCH_KEYS.CASE,
                lastId: res.chatId,
                docId: res.documentId,
                folderId: folderState,
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
              library_files: filesFromLibrary,
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
            contentId: documentId,
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
    dispatch(clearAllChatHistory());
    dispatch(clearActiveChatHistory());
    handleSetFolder(null);
    dispatch(setFolderToChat(null));
    dispatch(setFolderId(""));
    setInstruction("");
    setExistingInstruction("");
    dispatch(setFilesToChat([]));
    navigate("/content-manager/create");
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
            <div className="p-1.5 bg-[#1C63DB] rounded-lg text-white font-[500] text-[18px] flex items-center justify-center ">
              {selectedSwitch}
            </div>
            {chatState.length > 0 && (
              <button
                className="xl:absolute right-[24px] top-[18px] flex flex-row items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#1C63DB] bg-[#DDEBF6] rounded-full w-full md:w-fit"
                onClick={handleNewChatOpen}
              >
                <MaterialIcon iconName="search" size={24} /> New Search
              </button>
            )}
          </CardHeader>
          <div className="border-t border-[#DDEBF6] w-full mb-[24px]" />
          <CardContent className="flex flex-1 w-full h-full px-6 pb-0 overflow-auto">
            {chatState.length > 0 && (
              <div className="w-fit h-fit">
                <ChatActions
                  isSearching={isSearching}
                  hasMessages={chatState.length >= 2}
                  isHistoryPopup
                  initialRating={
                    chat.length ? (chat[0].liked ? 5 : undefined) : undefined
                  }
                  onReadAloud={handleReadAloud}
                  isReadingAloud={isReadingAloud}
                  currentChatId={sourceId || undefined}
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
                          <MaterialIcon
                            iconName="attach_file"
                            size={24}
                            fill={1}
                          />
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
                      folderId={folderState || folderId || undefined}
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
                          <MaterialIcon iconName="settings" size={24} />
                          {(instruction?.length > 0 ||
                            existingInstruction?.length > 0) && (
                            <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -right-1">
                              1
                            </span>
                          )}
                        </Button>
                      }
                      folderInstruction={existingInstruction}
                      setInstruction={setInstruction}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      handleNewMessage(message);
                    }}
                    variant="brightblue"
                    disabled={isSearching || !folderState || message === ""}
                    className="w-12 h-12 p-0 rounded-full bg-[#1C63DB] disabled:opacity-[0.5] disabled:cursor-not-allowed"
                  >
                    <MaterialIcon iconName="send" size={24} />
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
            <div className="flex flex-col items-center gap-2">
              <div className="p-1.5 bg-[#1C63DB] rounded-lg text-white font-[500] text-[18px] flex items-center justify-center ">
                {selectedSwitch}
              </div>
              {subTitleSwitch(selectedSwitch as SwitchValue) && (
                <p className=" text-[#1D1D1F] ">
                  {subTitleSwitch(selectedSwitch as SwitchValue)}
                </p>
              )}
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
              className="absolute right-[24px] top-[18px] flex flex-row items-center justify-center gap-2 h-8 w-8 text-sm font-medium text-[#1C63DB] bg-[#DDEBF6] rounded-full"
              onClick={handleNewChatOpen}
            >
              <MaterialIcon iconName="add" />
            </button>
            {activeChatKey !== "Create content" && (
              <HistoryPopup
                fromPath={location.state?.from?.pathname ?? null}
                className="absolute md:flex right-[24px] top-[64px]"
                smallChat
              />
            )}
          </CardHeader>
          <CardContent
            className={`flex flex-1 w-full h-full min-h-0 overflow-y-auto ${isCoach ? "pb-0" : ""}`}
          >
            {!isMobileOrTablet && (
              <div className="w-fit h-fit">
                <ChatActions
                  chatState={chatState}
                  isSearching={isSearching}
                  hasMessages={chatState.length >= 2}
                  isHistoryPopup
                  initialRating={
                    chat.length ? (chat[0].liked ? 5 : undefined) : undefined
                  }
                  onReadAloud={handleReadAloud}
                  isReadingAloud={isReadingAloud}
                  currentChatId={sourceId || undefined}
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
          {isMobileOrTablet && (
            <div className="w-fit mx-auto h-fit mb-[16px]">
              <ChatActions
                chatState={chatState}
                isSearching={isSearching}
                hasMessages={chatState.length >= 2}
                isHistoryPopup
                initialRating={
                  chat.length ? (chat[0].liked ? 5 : undefined) : undefined
                }
                onReadAloud={handleReadAloud}
                isReadingAloud={isReadingAloud}
                currentChatId={sourceId || undefined}
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
                            <MaterialIcon
                              iconName="attach_file"
                              size={24}
                              fill={1}
                            />
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
                        folderId={folderState || folderId || undefined}
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
                            <MaterialIcon iconName="settings" size={24} />
                            {(instruction?.length > 0 ||
                              existingInstruction?.length > 0) && (
                              <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -right-1">
                                1
                              </span>
                            )}
                          </Button>
                        }
                        setInstruction={setInstruction}
                        folderInstruction={existingInstruction}
                      />
                    </div>
                    <Button
                      onClick={() => {
                        handleNewMessage(message);
                      }}
                      disabled={isSearching || !folderState || message === ""}
                      className="w-12 h-12 p-0 rounded-full bg-[#1C63DB] disabled:opacity-[0.5] disabled:cursor-not-allowed"
                    >
                      <MaterialIcon iconName="send" size={24} />
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
                            <MaterialIcon iconName="attach_file" size={24} />
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
                      variant="brightblue"
                      disabled={isSearching || message === ""}
                      className="w-12 h-12 p-0 rounded-full bg-[#1C63DB] disabled:opacity-[0.5] disabled:cursor-not-allowed"
                    >
                      <MaterialIcon iconName="send" size={24} />
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
