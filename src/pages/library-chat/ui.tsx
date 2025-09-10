import { zodResolver } from "@hookform/resolvers/zod";
import {
  addMessageToChat,
  clearActiveChatHistory,
  handleRegenerateAiLastMessage,
  setActiveChat,
  setLastChatId,
  setMessagesToChat,
} from "entities/client/lib";
import { CoachService } from "entities/coach";
import { HealthHistoryService } from "entities/health-history";
import { setHealthHistory, setLoading } from "entities/health-history/lib";
import { LibraryChatInput } from "entities/search";
import { SearchService, StreamChunk } from "entities/search/api";
import { RootState } from "entities/store";
import {
  ChatActions,
  ChatBreadcrumb,
  ChatHeader,
  ChatLoading,
  Message,
} from "features/chat";
import { joinReplyChunksSafely } from "features/chat/ui/message-bubble/lib";
import { caseBaseSchema } from "pages/content-manager";
import {
  CaseSearchForm,
  FormValues,
} from "pages/content-manager/create/case-search";
import { useTextSelectionTooltip } from "pages/content-manager/document/lib";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { usePageWidth } from "shared/lib";
import { Card, CardContent } from "shared/ui";
import {
  SWITCH_CONFIG,
  SWITCH_KEYS,
  SwitchValue,
} from "widgets/library-small-chat/switch-config";
import { MessageList } from "widgets/message-list";

export const LibraryChat = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { documentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSearching, setIsSearching] = useState(false);
  const [streamingText, setStreamingText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState<string>("");
  const [currentChatId, setCurrentChatId] = useState<string>(chatId ?? "");
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const { isMobile } = usePageWidth();
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [existingInstruction, setExistingInstruction] = useState<string>("");
  const [instruction, setInstruction] = useState<string>("");

  const initialSearchDone = useRef(false);
  const sessionLoadDone = useRef(false);

  const initialMessage = location.state?.message;
  const searchType = location.state?.searchType;
  const files = location.state?.files;

  const isExistingChat = chatId && !chatId.startsWith("new_chat_");
  const chat = useSelector((state: RootState) => state.client.chat);
  const activeChatKey = useSelector(
    (state: RootState) => state.client.activeChatKey
  );
  const lastChatId = useSelector((state: RootState) => state.client.lastChatId);

  const folderState = useSelector(
    (state: RootState) => state.client.selectedChatFolder || null
  );
  const filesFromLibrary = useSelector(
    (state: RootState) => state.client.selectedFilesFromLibrary || []
  );

  const resolvedChatKey =
    (isSearching ? activeChatKey : lastChatId) || activeChatKey;
  const chatState = useSelector(
    (state: RootState) => state.client.chatHistory[resolvedChatKey] || []
  );

  const userPersisted = localStorage.getItem("persist:user");
  let isCoach = false;

  if (userPersisted) {
    try {
      const parsed = JSON.parse(userPersisted);
      const user = parsed?.user ? JSON.parse(parsed.user) : null;
      const roleID = user?.roleID;
      isCoach = roleID === 2;
    } catch (error) {
      console.error("Failed to parse persisted user:", error);
    }
  }

  const config = isCoach
    ? SWITCH_CONFIG.coach
    : documentId
      ? SWITCH_CONFIG.personalize
      : SWITCH_CONFIG.default;

  const [selectedSwitch, setSelectedSwitch] = useState<string>(
    config.defaultOption
  );
  const isSwitch = (value: SwitchValue) => selectedSwitch === value;
  const dispatch = useDispatch();

  useEffect(() => {
    if (activeChatKey) {
      setSelectedSwitch(activeChatKey);
    } else {
      const switchKey = documentId
        ? SWITCH_CONFIG.personalize.options[0]
        : SWITCH_CONFIG.default.options[0];
      dispatch(setActiveChat(switchKey));
      setSelectedSwitch(switchKey);
    }
  }, [activeChatKey, dispatch, documentId]);

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

  const [textContent, setTextContent] = useState("");
  const [voiceContent, setVoiceContent] = useState("");
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const [isReadingAloud, setIsReadingAloud] = useState(false);

  const { tooltipPosition, showTooltip, handleTooltipClick } =
    useTextSelectionTooltip();

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
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        setIsReadingAloud(false);
      }
    };
  }, [chatId]);

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

  useEffect(() => {
    const fetchHealthHistory = async () => {
      try {
        dispatch(setLoading(true));
        const data = await HealthHistoryService.getUserHealthHistory();
        dispatch(setHealthHistory(data));
      } catch (error: any) {
        setError("Failed to load user health history");
        console.error("Health history fetch error:", error);
      }
    };

    fetchHealthHistory();
  }, [dispatch]);

  useEffect(() => {
    const initialize = async () => {
      if (initialMessage && location.state?.message) {
        setError(null);
        setChatTitle("");
        initialSearchDone.current = false;
        sessionLoadDone.current = false;

        const userMessage: Message = {
          id: Date.now().toString(),
          type: "user",
          content: initialMessage,
          timestamp: new Date(),
        };

        dispatch(
          addMessageToChat({ chatKey: activeChatKey, message: userMessage })
        );

        if (isExistingChat && location.state?.isNewSearch) {
          const newChatId = `new_chat_${Date.now()}`;
          setCurrentChatId(newChatId);
          dispatch(setLastChatId(newChatId));
          if (isCoach) {
            navigate(`/content-manager/library/${newChatId}`, {
              replace: true,
              state: { message: initialMessage, searchType },
            });
          } else {
            navigate(`/library/${newChatId}`, {
              replace: true,
              state: { message: initialMessage, searchType },
            });
          }
          return;
        }

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );

        if (!initialSearchDone.current) {
          initialSearchDone.current = true;
          await handleInitialSearch(initialMessage);
        }
      } else if (isExistingChat) {
        sessionLoadDone.current = true;
        await loadExistingSession(chatId!);
      }
    };

    initialize();
  }, [
    chatId,
    initialMessage,
    location.state,
    isExistingChat,
    activeChatKey,
    dispatch,
    navigate,
    searchType,
    isCoach,
  ]);

  useEffect(() => {
    const fetchChat = async () => {
      if (lastChatId) {
        await loadExistingSession(lastChatId);
      }
    };
    fetchChat();
  }, [lastChatId]);

  const loadExistingSession = async (id: string) => {
    setIsLoadingSession(true);
    setError(null);
    const chatMessages: Message[] = [];

    try {
      if (activeChatKey === "Create content") {
        const sessionData = await CoachService.getSessionById(id);

        if (sessionData && sessionData.search_results.length > 0) {
          sessionData.search_results.forEach((item: any) => {
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
        const sessionData = await SearchService.getSession(id);

        if (sessionData && sessionData.length > 0) {
          sessionData.forEach((item: any) => {
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

        chatMessages.sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        );

        dispatch(setMessagesToChat({ chatKey: id, messages: chatMessages }));

        if (sessionData?.[0]?.chat_title) {
          setChatTitle(sessionData[0].chat_title);
        }

        setCurrentChatId(id);
        dispatch(setLastChatId(id));
      }
    } catch (error) {
      console.error("Error loading chat session:", error);
      setError("Failed to load chat session");
    } finally {
      setIsLoadingSession(false);
    }
  };

  const handleInitialSearch = async (message: string) => {
    if (isSearching) return;

    setIsSearching(true);
    setStreamingText("");
    setError(null);

    let accumulatedText = "";

    try {
      await SearchService.aiSearchStream(
        {
          chat_message: JSON.stringify({
            user_prompt: message,
            is_new: currentChatId.startsWith("new_chat_"),
            chat_id: currentChatId.startsWith("new_chat_")
              ? undefined
              : currentChatId,
            regenerate_id: null,
          }),
          ...(files?.length > 0 ? { images: files } : {}),
        },
        (chunk: StreamChunk) => {
          if (chunk.reply) {
            accumulatedText += chunk.reply;
            setStreamingText(accumulatedText);
          }
        },
        (finalData) => {
          setIsSearching(false);

          const aiMessage: Message = {
            id: finalData.chat_id || Date.now().toString(),
            type: "ai",
            content: accumulatedText,
            timestamp: new Date(),
          };

          dispatch(
            addMessageToChat({ chatKey: activeChatKey, message: aiMessage })
          );
          setStreamingText("");

          if (finalData.chat_id) {
            dispatch(setLastChatId(finalData.chat_id));
            setCurrentChatId(finalData.chat_id);

            if (currentChatId.startsWith("new_chat_")) {
              if (isCoach) {
                navigate(`/content-manager/library/${finalData.chat_id}`, {
                  replace: true,
                });
              } else {
                navigate(`/library/${finalData.chat_id}`, { replace: true });
              }
            }
          }

          if (finalData.chat_title) {
            setChatTitle(finalData.chat_title);
          }
        },
        (error) => {
          setIsSearching(false);
          setError(error.message);
          console.error("Search error:", error);
        }
      );
    } catch (error) {
      setIsSearching(false);
      setError(error instanceof Error ? error.message : "Search failed");
      console.error("Search error:", error);
    }
  };

  const generateCaseStory = () => {
    const {
      age,
      employmentStatus,
      menopausePhase,
      symptoms,
      diagnosedConditions,
      medication,
      lifestyleFactors,
      previousInterventions,
      interventionOutcome,
      suspectedRootCauses,
      protocol,
      goal,
    } = watchedCaseValues;

    return `This case involves a ${age}-year-old ${employmentStatus} woman in the ${menopausePhase} phase, presenting with ${symptoms}.
Her health history includes ${diagnosedConditions}, and she is currently taking ${medication}.
Lifestyle factors such as ${lifestyleFactors} may be contributing.
Previous interventions have included ${previousInterventions}, with ${interventionOutcome}.
The suspected root causes include ${suspectedRootCauses}.
This case is being used to create a ${protocol} aimed at ${goal}.`;
  };

  const handleNewMessage = async (
    message: string,
    files: File[]
  ): Promise<string | undefined> => {
    if ((!message.trim() && files.length === 0) || isSearching) return;

    const imageMime = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const previewImages = files
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

    setIsSearching(true);
    setStreamingText("");
    setTextContent("");
    setError(null);

    const {
      files: images,
      pdf,
      errors: fileErrors,
    } = await SearchService.prepareFilesForSearch(files);

    if (fileErrors.length > 0) {
      setError(fileErrors.join("\n"));
      setIsSearching(false);
      return;
    }

    let accumulatedText = "";
    let returnedChatId = currentChatId;
    let str = "";
    const replyChunks: string[] = [];

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

    const processFinalData = async (finalData: any) => {
      setIsSearching(false);

      const aiMessage: Message = {
        id:
          finalData?.chat_id ||
          finalData?.searched_result_id ||
          finalData?.chatId ||
          Date.now().toString(),
        type: "ai",
        content: isLearn ? joinReplyChunksSafely(replyChunks) : accumulatedText,
        timestamp: new Date(),
        document: str,
      };

      dispatch(
        addMessageToChat({ chatKey: activeChatKey, message: aiMessage })
      );
      setStreamingText("");

      const newId =
        finalData?.chat_id ||
        finalData?.searched_result_id ||
        finalData?.chatId;

      if (newId && newId !== currentChatId) {
        setCurrentChatId(newId);
        returnedChatId = newId;
        dispatch(setLastChatId(newId));
      }

      if (finalData?.chat_title) {
        setChatTitle(finalData.chat_title);
      }
    };

    try {
      if (isSwitch(SWITCH_KEYS.CREATE)) {
        if (!folderState) {
          setIsSearching(false);
          setError("Please select a target folder before using Create.");
          return;
        }

        const res = await CoachService.aiLearningSearch(
          {
            user_prompt: message,
            is_new: currentChatId.startsWith("new_chat_") || !currentChatId,
            chat_id: currentChatId.startsWith("new_chat_")
              ? undefined
              : currentChatId,
            regenerate_id: null,
            chat_title: "",
            instructions: instruction,
          },
          folderState,
          images,
          pdf,
          clientId ?? undefined,
          filesFromLibrary,
          undefined,
          processChunk,
          processFinalData
        );

        if (res.chatId && res.documentId) {
          const targetPath = `/content-manager/library/folder/${folderState}/chat/${res.chatId}`;
          navigate(targetPath, {
            state: {
              selectedSwitch: SWITCH_KEYS.CREATE,
              lastId: res.chatId,
              docId: res.documentId,
              folderId: folderState,
            },
          });
        }
      } else if (isSwitch(SWITCH_KEYS.RESEARCH)) {
        await SearchService.aiCoachResearchStream(
          {
            chat_message: JSON.stringify({
              user_prompt: message,
              is_new: currentChatId.startsWith("new_chat_") || !currentChatId,
              chat_id: currentChatId.startsWith("new_chat_")
                ? undefined
                : currentChatId,
              text_quote: undefined,
              library_files: filesFromLibrary,
            }),
            images,
            pdf,
            contentId: documentId,
            clientId: clientId ?? undefined,
          },
          processChunk,
          processFinalData,
          (error) => {
            setIsSearching(false);
            setError(error.message);
            console.error("Search error:", error);
          }
        );
      } else {
        await SearchService.aiSearchStream(
          {
            chat_message: JSON.stringify({
              user_prompt: message,
              is_new: currentChatId.startsWith("new_chat_"),
              chat_id: currentChatId.startsWith("new_chat_")
                ? undefined
                : currentChatId,
              regenerate_id: null,
              personalize: false,
            }),
            ...(images && { images }),
            ...(pdf && { pdf }),
          },
          processChunk,
          processFinalData,
          (error) => {
            setIsSearching(false);
            setError(error.message);
            console.error("Search error:", error);
          },
          isLearn
        );
      }
    } catch (error) {
      setIsSearching(false);
      setError(error instanceof Error ? error.message : "Search failed");
      console.error("Search error:", error);
    }

    return returnedChatId;
  };

  const handleRegenerateResponse = async () => {
    if (chatState.length < 2 || isSearching) return;

    const lastUserMessage = [...chatState]
      .reverse()
      .find((msg) => msg.type === "user");
    if (!lastUserMessage) return;

    dispatch(handleRegenerateAiLastMessage());

    setIsSearching(true);
    setStreamingText("");
    setError(null);

    let accumulatedText = "";

    try {
      await SearchService.aiSearchStream(
        {
          chat_message: JSON.stringify({
            user_prompt: lastUserMessage.content,
            is_new: currentChatId.startsWith("new_chat_"),
            chat_id: currentChatId.startsWith("new_chat_")
              ? undefined
              : currentChatId,
            regenerate_id: Date.now().toString(),
          }),
        },
        (chunk: StreamChunk) => {
          if (chunk.reply) {
            accumulatedText += chunk.reply;
            setStreamingText(accumulatedText);
          }
        },
        (finalData) => {
          setIsSearching(false);

          const aiMessage: Message = {
            id: finalData.chat_id || Date.now().toString(),
            type: "ai",
            content: accumulatedText,
            timestamp: new Date(),
          };

          dispatch(
            addMessageToChat({ chatKey: activeChatKey, message: aiMessage })
          );
          setStreamingText("");

          if (finalData.chat_id) {
            dispatch(setLastChatId(finalData.chat_id));
          }
        },
        (error) => {
          setIsSearching(false);
          setError(error.message);
          console.error("Regenerate error:", error);
        }
      );
    } catch (error) {
      setIsSearching(false);
      setError(error instanceof Error ? error.message : "Regenerate failed");
      console.error("Regenerate error:", error);
    }
  };

  const displayChatTitle =
    chatTitle ||
    (currentChatId ? `Chat ${currentChatId.slice(0, 8)}...` : "New Chat");

  const isEmpty =
    chatState.length === 0 &&
    !isSearching &&
    !streamingText &&
    !isLoadingSession;

  const handleNewChatOpen = () => {
    const newId = `new_chat_${Date.now()}`;
    setCurrentChatId(newId);
    dispatch(clearActiveChatHistory());
    setStreamingText("");
    setChatTitle("");
    setError(null);
    dispatch(setLastChatId(newId));
    initialSearchDone.current = false;
    sessionLoadDone.current = false;

    navigate(
      isCoach ? `/content-manager/library/${newId}` : `/library/${newId}`,
      {
        replace: true,
        state: {
          message: "",
          isNewSearch: true,
          searchType: searchType ?? undefined,
        },
      }
    );
  };

  return (
    <div
      className={`flex flex-col w-full gap-6 flex-1 md:p-6 bg-white md:bg-[#F2F4F6]`}
    >
      <div className={`hidden md:block`}>
        <ChatBreadcrumb displayChatTitle={displayChatTitle} />
      </div>
      <div className="flex flex-row flex-1 w-full h-full gap-6 md:relative">
        <div className="hidden xl:block">
          <ChatActions
            chatState={chatState}
            onRegenerate={handleRegenerateResponse}
            isSearching={isSearching}
            hasMessages={chatState.length >= 2}
            isHistoryPopup
            initialRating={
              chat.length ? (chat[0].liked ? 5 : undefined) : undefined
            }
            onReadAloud={handleReadAloud}
            isReadingAloud={isReadingAloud}
          />
        </div>
        {isLoadingSession ? (
          <ChatLoading />
        ) : (
          <div className="flex flex-col flex-1 w-full min-h-0 overflow-clip">
            <ChatHeader
              displayChatTitle={displayChatTitle}
              isExistingChat={!!isExistingChat}
              isSwitch={isSwitch}
              selectedSwitch={selectedSwitch}
              onNewSearch={handleNewChatOpen}
              onClose={() => {
                const fromPath =
                  location.state?.from?.pathname ||
                  location.state?.from ||
                  null;
                if (fromPath) {
                  navigate(fromPath);
                } else {
                  navigate(-1);
                }
              }}
            />
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
            {isEmpty && !isSwitch(SWITCH_KEYS.CASE) ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center bg-white rounded-b-xl p-[24px] overflow-y-auto md:mb-[16px] xl:mb-0">
                <div className="flex flex-col items-center justify-center flex-1 md:hidden">
                  <div className="max-w-[300px] sm:max-w-[360px] mx-auto">
                    <h2 className="text-[24px] leading-tight font-[700] text-[#1D1D1F]">
                      {isCoach
                        ? "Start a conversation"
                        : "Hey, what’s going on in your world today?"}
                    </h2>
                    <p className="mt-3 text-[14px] leading-[1.45] text-[#5F5F65]">
                      {isCoach
                        ? "Select an action below and enter a query to start a conversation with Tolu."
                        : "Tell me what’s feeling off or what you’re working on. I’ll help you make sense of it and find your next step."}
                    </p>
                  </div>
                </div>
              </div>
            ) : isSwitch(SWITCH_KEYS.CASE) ? (
              <>
                <MessageList
                  messages={chatState}
                  isSearching={isSearching}
                  streamingText={streamingText}
                  error={error}
                />
                <Card className="flex flex-col w-full overflow-auto border-none rounded-0 rounded-b-xl">
                  <div className="w-full mb-[24px]" />
                  <CardContent className={`w-full px-6 mt-auto rounded-0`}>
                    <div className="p-[24px] border border-[#008FF6] rounded-[20px]">
                      <p className="text-[24px] text-[#1D1D1F] font-[500]">
                        Case Story
                      </p>
                      <form onSubmit={(e) => e.preventDefault()}>
                        <CaseSearchForm form={caseForm} />
                      </form>
                      <div className="flex justify-end gap-2 mt-6">
                        <button
                          type="button"
                          className="py-[11px] px-[30px] rounded-full text-[16px] font-semibold transition-colors duration-200 bg-[#1C63DB] text-white"
                          onClick={async () => {
                            setSelectedSwitch(config.defaultOption);
                            await handleNewMessage(generateCaseStory(), []);
                          }}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div
                className={`overflow-y-auto h-full px-[16px] md:px-0 md:mb-[16px] xl:mb-0`}
              >
                <MessageList
                  messages={chatState}
                  isSearching={isSearching}
                  streamingText={streamingText}
                  error={error}
                />
              </div>
            )}
            <div className={`xl:hidden block px-[16px] w-fit mx-auto`}>
              <ChatActions
                chatState={chatState}
                onRegenerate={handleRegenerateResponse}
                isSearching={isSearching}
                hasMessages={chatState.length >= 2}
                isHistoryPopup
                initialRating={
                  chat.length ? (chat[0].liked ? 5 : undefined) : undefined
                }
                onReadAloud={handleReadAloud}
                isReadingAloud={isReadingAloud}
              />
            </div>

            <LibraryChatInput
              className={`mt-4 xl:border-0 xl:border-t xl:rounded-none border border-[#DBDEE1] bg-white box-shadow-input rounded-t-[16px] rounded-b-none`}
              onSend={handleNewMessage}
              disabled={isSearching}
              switchOptions={config.options}
              selectedSwitch={selectedSwitch}
              setSelectedSwitch={(value) => {
                handleNewChatOpen();
                setSelectedSwitch(value);
                dispatch(setActiveChat(value));
              }}
              message={textContent}
              setNewMessage={setTextContent}
              setClientId={setClientId}
              placeholder={
                isCoach || !isMobile ? "Your message" : "I'm listening..."
              }
              files={newFiles}
              setFiles={setNewFiles}
              setExistingFiles={setExistingFiles}
              existingFiles={existingFiles}
              existingInstruction={existingInstruction}
              setExistingInstruction={setExistingInstruction}
              setInstruction={setInstruction}
              instruction={instruction}
            />
          </div>
        )}
      </div>
    </div>
  );
};
