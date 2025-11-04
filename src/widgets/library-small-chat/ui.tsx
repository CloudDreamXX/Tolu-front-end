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
import { CoachService, useLazyGetSessionByIdQuery } from "entities/coach";
import { IDocument } from "entities/document";
import { LibraryChatInput } from "entities/search";
import {
  SearchService,
  StreamChunk,
  useLazyGetSessionQuery,
} from "entities/search/api";
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
import SwitchDropdown from "./components/switch-dropdown/ui";
import { pickPreferredMaleEnglishVoice } from "pages/library-chat/lib";

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

  const [voiceFile, setVoiceFile] = useState<File | null>(null);

  const { isMobileOrTablet } = usePageWidth();

  const { documentId } = useParams();
  const config = isCoach
    ? SWITCH_CONFIG.coach
    : documentId
      ? SWITCH_CONFIG.personalize
      : SWITCH_CONFIG.default;

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
  const [selectedSwitch, setSelectedSwitch] = useState<string>("");

  useEffect(() => {
    setSelectedSwitch(config.defaultOption);
  }, [config, isCoach]);

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
    let cancelled = false;
    let pollTimer: number | null = null;

    const setAndPersistVoice = (voice: SpeechSynthesisVoice | null) => {
      if (cancelled) return;
      setSelectedVoice(voice);
      if (voice) {
        localStorage.setItem(
          "selectedVoice",
          JSON.stringify({ name: voice.name, lang: voice.lang })
        );
      } else {
        localStorage.removeItem("selectedVoice");
      }
    };

    const resolveVoice = () => {
      const availableVoices = speechSynthesis.getVoices() || [];
      if (!availableVoices.length) return false;

      const stored = localStorage.getItem("selectedVoice");
      if (stored) {
        try {
          const { name, lang } = JSON.parse(stored);
          const match = availableVoices.find(
            (v) => v.name === name && v.lang === lang
          );
          if (match) {
            setAndPersistVoice(match);
            return true;
          } else {
            localStorage.removeItem("selectedVoice");
          }
        } catch {
          localStorage.removeItem("selectedVoice");
        }
      }

      const picked = pickPreferredMaleEnglishVoice(availableVoices);
      setAndPersistVoice(picked);
      return true;
    };

    const tryLoad = () => {
      if (!resolveVoice()) {
        if (pollTimer == null) {
          pollTimer = window.setInterval(() => {
            if (resolveVoice()) {
              if (pollTimer) {
                clearInterval(pollTimer);
                pollTimer = null;
              }
            }
          }, 250);
        }
      }
    };

    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = tryLoad;
      setTimeout(tryLoad, 100);
    } else {
      tryLoad();
    }

    return () => {
      cancelled = true;
      if (pollTimer) {
        clearInterval(pollTimer);
      }
      speechSynthesis.onvoiceschanged = null;
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
        if (selectedVoice.lang) utterance.lang = selectedVoice.lang;
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

  const [getSessionById] = useLazyGetSessionByIdQuery();
  const [getSearchSession] = useLazyGetSessionQuery();

  const loadExistingSession = async (chatId: string) => {
    setIsLoadingSession(true);
    setError(null);
    const chatMessages: Message[] = [];

    try {
      if (activeChatKey === "Create content") {
        const sessionData = await getSessionById(chatId);

        if (
          sessionData &&
          sessionData.data?.search_results &&
          sessionData.data?.search_results.length > 0
        ) {
          sessionData.data?.search_results.forEach((item) => {
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
        const sessionData = await getSearchSession(chatId).unwrap();

        const imageMime = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        const pdfMime = ["application/pdf"];

        // Only process items that actually have stored files
        const validFiles = sessionData.filter(
          (f) => Array.isArray(f.stored_files) && f.stored_files.length > 0
        );

        const imagePreviews = await Promise.all(
          validFiles
            .filter((f) => imageMime.includes(f.stored_files[0].content_type))
            .map(async (f) => {
              const file = f.stored_files[0];
              const res = await fetch(file.path);
              const blob = await res.blob();
              return URL.createObjectURL(blob);
            })
        );

        const pdfPreviews = await Promise.all(
          validFiles
            .filter((f) => pdfMime.includes(f.stored_files[0].content_type))
            .map(async (f) => {
              const file = f.stored_files[0];
              const res = await fetch(file.path);
              const blob = await res.blob();
              return {
                name: file.filename,
                url: URL.createObjectURL(blob),
                type: file.content_type,
              };
            })
        );

        if (sessionData && sessionData.length > 0) {
          sessionData.forEach((item) => {
            if (item.query) {
              chatMessages.push({
                id: `user-${item.id}`,
                type: "user",
                content: item.query,
                timestamp: new Date(item.created_at),
                images: imagePreviews,
                pdfs: pdfPreviews,
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
    if (
      (!voiceFile && !message.trim() && filesState.length === 0) ||
      isSearching
    )
      return;

    const newAbortController = new AbortController();
    setAbortController(newAbortController);

    const imageMime = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const pdfMime = ["application/pdf"];

    const imagePreviews = filesState
      .filter((f) => imageMime.includes(f.type))
      .map((f) => URL.createObjectURL(f));

    const pdfPreviews = filesState
      .filter((f) => pdfMime.includes(f.type))
      .map((f) => ({
        name: f.name,
        url: URL.createObjectURL(f),
        type: f.type,
      }));

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
      images: imagePreviews,
      pdfs: pdfPreviews,
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
    const returnedChatId = currentChatId;
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

        const fullAnswer =
          finalData?.answer || finalData?.content || accumulatedText;

        const aiMessage: Message = {
          id: chatId || Date.now().toString(),
          type: "ai",
          content: isLearn ? joinReplyChunksSafely(replyChunks) : fullAnswer,
          timestamp: new Date(),
          document: isLearn ? str : fullAnswer,
        };

        if (!currentChatId && chatId) {
          dispatch(addMessageToChat({ chatKey: chatId, message: userMessage }));
        }

        dispatch(addMessageToChat({ chatKey: chatId, message: aiMessage }));
        setVoiceContent(extractVoiceText(aiMessage.content));
        setStreamingText("");

        if (!lastId && chatId && chatId !== currentChatId) {
          setCurrentChatId(chatId);
        }

        if (finalData?.chat_title) {
          setChatTitle(finalData.chat_title);
        }
      };

      if (isSwitch(SWITCH_KEYS.CARD)) {
        const res = await CoachService.aiLearningCardSearch(
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
                selectedSwitch: SWITCH_KEYS.CARD,
                lastId: res.chatId,
                docId: res.documentId,
                folderId: folderState,
              },
            });
          }
        }
      } else if (isSwitch(SWITCH_KEYS.CREATE)) {
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
      } else if (isSwitch(SWITCH_KEYS.ASSISTANT)) {
        await SearchService.aiCoachAssistantStream(
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
              user_prompt: voiceFile && !message.trim() ? undefined : message,
              is_new: !currentChatId,
              chat_id: currentChatId,
              regenerate_id: null,
              personalize: false,
              text_quote: selectedText,
            }),
            ...(images && { images }),
            ...(pdf && { pdf }),
            contentId: documentId,
            audio: voiceFile ? voiceFile : undefined,
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

  const handleSend = () => {
    if (
      (!voiceFile && !message.trim() && filesState.length === 0) ||
      isSearching
    )
      return;
    handleNewMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (
      (isSwitch(SWITCH_KEYS.CREATE) || isSwitch(SWITCH_KEYS.CARD)) &&
      !folderState
    )
      return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      if (deleteSelectedText) deleteSelectedText();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const pasted: File[] = [];
    Array.from(items).forEach((it) => {
      if (it.kind === "file") {
        const f = it.getAsFile();
        if (f) {
          pasted.push(f);
        }
      }
    });

    handleSetFiles([...filesState, ...pasted]);
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
        <Card className="relative flex flex-col w-full h-full overflow-auto border-none rounded-none">
          <CardHeader
            className={`relative flex flex-col ${isCoach ? "items-baseline" : "items-center"} gap-4`}
          >
            <SwitchDropdown
              options={config.options}
              handleSwitchChange={handleSwitchChange}
              selectedSwitch={selectedSwitch}
              isCoach={isCoach}
            />
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
              selectedSwitch={selectedSwitch}
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
                          {(filesState.length > 0 ||
                            filesFromLibrary.length > 0) && (
                            <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -right-1">
                              {filesState.length + filesFromLibrary.length}
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
        <Card
          className={`relative flex flex-col w-full h-full border-none ${isCoach ? "rounded-none" : "rounded-2xl"}`}
        >
          <CardHeader
            className={`relative flex items-center ${isCoach ? "flex-row justify-between h-[100px]" : "flex-col"} gap-2`}
          >
            <div
              className={`flex ${isCoach ? "" : "flex-col"} items-center gap-2`}
            >
              <SwitchDropdown
                options={config.options}
                handleSwitchChange={handleSwitchChange}
                selectedSwitch={selectedSwitch}
                isCoach={isCoach}
              />
              {subTitleSwitch(selectedSwitch as SwitchValue) && (
                <p
                  className={`${isCoach ? "text-[#1C63DB] text-[16px] lg:text-[14px] 2xl:text-[18px]" : "text-[#1D1D1F]"} my-0`}
                >
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
            {isCoach && (
              <div className="flex items-center gap-[18px]">
                <HistoryPopup
                  fromPath={location.state?.from?.pathname ?? null}
                  smallChat={isCoach}
                />
                <Button
                  variant={"brightblue"}
                  onClick={handleNewChatOpen}
                  className="h-[32px] w-[92px] text-[14px] font-normal"
                >
                  Create
                </Button>
              </div>
            )}
            {!isCoach && (
              <button
                className="absolute right-[24px] top-[18px] flex flex-row items-center justify-center gap-2 h-8 w-8 text-sm font-medium text-[#1C63DB] bg-[#DDEBF6] rounded-full"
                onClick={handleNewChatOpen}
              >
                <MaterialIcon iconName="add" />
              </button>
            )}
            {activeChatKey !== "Create content" && !isCoach && (
              <HistoryPopup
                fromPath={location.state?.from?.pathname ?? null}
                className="absolute md:flex right-[24px] top-[64px]"
                smallChat={isCoach}
              />
            )}
          </CardHeader>
          <CardContent
            className={`flex flex-1 w-full h-full min-h-0 overflow-y-auto ${isCoach ? "pb-0" : ""}`}
          >
            {!isMobileOrTablet ||
              (!isCoach && (
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
              ))}
            {loading || isLoading || isSwitchLoading || isLoadingSession ? (
              <MessageLoadingSkeleton />
            ) : chatState.length ? (
              <MessageList
                messages={chatState}
                isSearching={isSearching}
                streamingText={streamingText}
                error={error}
                isHistoryPopup
                onReadAloud={handleReadAloud}
                isReadingAloud={isReadingAloud}
                currentChatId={sourceId || undefined}
                selectedSwitch={selectedSwitch}
              />
            ) : (
              <div></div>
            )}
          </CardContent>
          {isMobileOrTablet && !isCoach && (
            <div className={`mx-auto w-fit h-fit mb-[16px]`}>
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
              voiceFile={voiceFile}
              setVoiceFile={setVoiceFile}
              className={`w-full p-6 ${isCoach ? "border-none" : "border-t"} rounded-t-none rounded-b-2xl`}
              onSend={handleNewMessage}
              disabled={
                isSearching ||
                (isSwitch(SWITCH_KEYS.CREATE) && !folderState) ||
                (isSwitch(SWITCH_KEYS.CARD) && !folderState) ||
                (!voiceFile && message === "")
              }
              selectedText={selectedText}
              message={message}
              deleteSelectedText={deleteSelectedText}
              selectedSwitch={selectedSwitch}
              setNewMessage={setMessage}
              textarea={
                isSwitch(SWITCH_KEYS.RESEARCH) ||
                isSwitch(SWITCH_KEYS.CREATE) ||
                isSwitch(SWITCH_KEYS.CARD) ||
                isSwitch(SWITCH_KEYS.ASSISTANT) ? (
                  <div className="flex items-center mb-[10px] h-[48px] border-0 md:border border-[#1C63DB] rounded-lg px-[16px] focus:outline-none focus:ring-0 focus:border-transparent text-base sm:text-base md:text-base lg:text-base">
                    <textarea
                      placeholder={"How can I help you today?"}
                      value={message}
                      onPaste={handlePaste}
                      onChange={(e) => {
                        setMessage(e.target.value);
                      }}
                      onKeyDown={handleKeyPress}
                      className="w-full py-[11px] max-h-[46px] text-[14px] font-medium resize-none placeholder:text-black focus:outline-none focus:ring-0 focus:border-transparent"
                      style={{
                        WebkitTextSizeAdjust: "100%",
                        textSizeAdjust: "100%",
                      }}
                    />
                    <Button
                      onClick={() => {
                        handleNewMessage(message);
                      }}
                      disabled={
                        isSearching ||
                        (isSwitch(SWITCH_KEYS.CREATE) && !folderState) ||
                        (isSwitch(SWITCH_KEYS.CARD) && !folderState) ||
                        (!voiceFile && message === "")
                      }
                      className="h-[44px] w-[44px] p-0 rounded-full text-black disabled:opacity-[0.5] disabled:cursor-not-allowed"
                    >
                      <MaterialIcon iconName="send" fill={1} size={24} />
                    </Button>
                  </div>
                ) : undefined
              }
              footer={
                isSwitch(SWITCH_KEYS.CREATE) || isSwitch(SWITCH_KEYS.CARD) ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[10px]">
                      <PopoverAttach
                        files={filesState}
                        setFiles={handleSetFiles}
                        existingFiles={existingFiles}
                        disabled={!folderState}
                        customTrigger={
                          <Button className="relative text-[#1C63DB] rounded-full w-12 h-12 hover:bg-secondary/80">
                            <MaterialIcon
                              iconName="attach_file"
                              size={24}
                              fill={1}
                            />
                            {(filesState.length > 0 ||
                              filesFromLibrary.length > 0) && (
                              <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -right-1">
                                {filesState.length + filesFromLibrary.length}
                              </span>
                            )}
                          </Button>
                        }
                      />
                      <PopoverClient
                        setClientId={setClientId}
                        documentName={chatTitle}
                        smallChat
                      />
                      <PopoverFolder
                        folderId={folderState || folderId || undefined}
                        setFolderId={handleSetFolder}
                        setExistingFiles={setExistingFiles}
                        setExistingInstruction={setExistingInstruction}
                        smallChat
                      />
                      <PopoverInstruction
                        customTrigger={
                          <Button
                            className="relative text-[#1C63DB] rounded-full w-12 h-12 hover:bg-secondary/80"
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
                  </div>
                ) : isSwitch(SWITCH_KEYS.RESEARCH) ||
                  isSwitch(SWITCH_KEYS.ASSISTANT) ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[10px]">
                      <PopoverAttach
                        files={filesState}
                        setFiles={handleSetFiles}
                        existingFiles={existingFiles}
                        disabled={false}
                        hideFromLibrary={isCoach ? false : true}
                        customTrigger={
                          <Button className="relative text-[#1C63DB] rounded-full w-12 h-12">
                            <MaterialIcon iconName="attach_file" size={24} />
                            {(filesState.length > 0 ||
                              filesFromLibrary.length > 0) && (
                              <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -right-1">
                                {filesState.length + filesFromLibrary.length}
                              </span>
                            )}
                          </Button>
                        }
                      />
                      <PopoverClient
                        setClientId={setClientId}
                        documentName={chatTitle}
                        smallChat
                      />
                    </div>
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
