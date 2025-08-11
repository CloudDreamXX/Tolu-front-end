import { zodResolver } from "@hookform/resolvers/zod";
import { setChat } from "entities/client/lib";
import { HealthHistoryService } from "entities/health-history";
import { setHealthHistory, setLoading } from "entities/health-history/lib";
import { LibraryChatInput } from "entities/search";
import { SearchService, StreamChunk } from "entities/search/api";
import { SearchResultResponseItem } from "entities/search/model";
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

// const steps = [
//   "Demographic",
//   "Menopause Status",
//   "Health history",
//   "Your Lifestyle",
//   "Your Goals",
// ];

export const LibraryChat = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [streamingText, setStreamingText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [chatTitle, setChatTitle] = useState<string>("");
  const [currentChatId, setCurrentChatId] = useState<string>(chatId ?? "");
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const isMobileChatOpen = useSelector(
    (state: RootState) => state.client.isMobileChatOpen
  );
  const { isMobile } = usePageWidth();

  const initialSearchDone = useRef(false);
  const sessionLoadDone = useRef(false);

  const initialMessage = location.state?.message;
  const searchType = location.state?.searchType;
  const files = location.state?.files;

  const isExistingChat = chatId && !chatId.startsWith("new_chat_");
  const chat = useSelector((state: RootState) => state.client.chat);

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

  const { documentId } = useParams();

  const config = isCoach
    ? SWITCH_CONFIG.coach
    : documentId
      ? SWITCH_CONFIG.personalize
      : SWITCH_CONFIG.default;
  const [selectedSwitch, setSelectedSwitch] = useState<string>(
    config.options[0] as string
  );
  const isSwitch = (value: SwitchValue) => selectedSwitch === value;
  const dispatch = useDispatch();

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
        setError("Failed to load user health history");
        console.error("Health history fetch error:", error);
      }
    };

    fetchHealthHistory();
  }, [dispatch]);

  useEffect(() => {
    const initialize = async () => {
      if (initialMessage && location.state?.message) {
        setMessages([]);
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

        setMessages([userMessage]);

        if (isExistingChat && location.state?.isNewSearch) {
          const newChatId = `new_chat_${Date.now()}`;
          setCurrentChatId(newChatId);
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
        await loadExistingSession();
      }
    };

    initialize();
  }, [chatId, initialMessage, location.state]);

  const loadExistingSession = async () => {
    if (!chatId) return;

    setIsLoadingSession(true);
    setError(null);

    try {
      const sessionData = await SearchService.getSession(chatId);
      const newChat = sessionData.filter((item) => item.chat_id === chatId);
      dispatch(setChat(newChat));

      if (sessionData && sessionData.length > 0) {
        const chatMessages: Message[] = [];

        sessionData.forEach((item: SearchResultResponseItem) => {
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
              content: content,
              timestamp: new Date(item.created_at),
              document: document,
            });
          }
        });

        chatMessages.sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        );

        setMessages(chatMessages);

        if (sessionData[0]?.chat_title) {
          setChatTitle(sessionData[0].chat_title);
        }
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
            is_new: true,
            chat_id: currentChatId.startsWith("new_chat_")
              ? undefined
              : currentChatId,
            regenerate_id: null,
          }),
          ...(files?.length > 0 ? { image: files } : {}),
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

          setMessages((prev) => [...prev, aiMessage]);
          setStreamingText("");

          if (finalData.chat_id && finalData.chat_id !== currentChatId) {
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

    // if (isSwitch(SWITCH_KEYS.PERSONALIZE)) {
    //   try {
    //     const formValues = form.getValues();
    //     const postData = mapFormToPostData(formValues);

    //     await HealthHistoryService.createHealthHistory(postData);
    //   } catch (error) {
    //     console.error("Failed to save health history:", error);
    //     setError("Failed to save health history before starting the chat.");
    //     return;
    //   }
    // }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsSearching(true);
    setStreamingText("");
    setTextContent("");
    setError(null);

    const {
      image,
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

    const processChunk = (chunk: StreamChunk) => {
      if (!chunk.reply) return;

      if (isSwitch(SWITCH_KEYS.LEARN)) {
        if (chunk.reply.includes("Relevant Content")) {
          str = chunk.reply;
        } else {
          replyChunks.push(chunk.reply);
          const joined = joinReplyChunksSafely(replyChunks);
          setStreamingText(joined);
        }
      } else {
        accumulatedText += chunk.reply;
        setStreamingText(accumulatedText);
      }
    };

    const processFinalData = async (finalData: any) => {
      setIsSearching(false);

      const aiMessage: Message = {
        id: finalData.chat_id || Date.now().toString(),
        type: "ai",
        content: isSwitch(SWITCH_KEYS.LEARN)
          ? joinReplyChunksSafely(replyChunks)
          : accumulatedText,
        timestamp: new Date(),
        document: str,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setStreamingText("");

      if (finalData.chat_id && finalData.chat_id !== currentChatId) {
        setCurrentChatId(finalData.chat_id);
        returnedChatId = finalData.chat_id;
      }

      if (finalData.chat_title) {
        setChatTitle(finalData.chat_title);
      }
    };

    try {
      if (isCoach) {
        await SearchService.aiCoachResearchStream(
          {
            chat_message: JSON.stringify({
              user_prompt: message,
              is_new: false,
            }),
            image,
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
            ...(image && { image }),
            ...(pdf && { pdf }),
          },
          processChunk,
          processFinalData,
          (error) => {
            setIsSearching(false);
            setError(error.message);
            console.error("Search error:", error);
          },
          isSwitch(SWITCH_KEYS.LEARN)
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
    if (messages.length < 2 || isSearching) return;

    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.type === "user");
    if (!lastUserMessage) return;

    setMessages((prev) => {
      const lastAiIndex = prev.map((msg) => msg.type).lastIndexOf("ai");
      if (lastAiIndex !== -1) {
        return prev.slice(0, lastAiIndex);
      }
      return prev;
    });

    setIsSearching(true);
    setStreamingText("");
    setError(null);

    let accumulatedText = "";

    try {
      await SearchService.aiSearchStream(
        {
          chat_message: JSON.stringify({
            user_prompt: lastUserMessage.content,
            is_new: false,
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

          setMessages((prev) => [...prev, aiMessage]);
          setStreamingText("");
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
    messages.length === 0 &&
    !isSearching &&
    !streamingText &&
    !isLoadingSession;

  //   const goToStep = async (nextStep: number) => {
  //     if (nextStep >= steps.length) {
  //       const values = form.getValues();
  //       const message = `Hi Tolu, I'm a ${values.age}-year-old and I'm ${values.maritalStatus}.
  // I work as a ${values.job} and I have ${values.children} children.
  // I live in ${values.location} and I'm a ${values.religion}.
  // I consider my financial ability ${values.financialStatus}.
  // I was born a ${values.genderAssignedAtBirth} and I identify as a ${values.genderIdentity}.

  // I am in ${values.menopauseStatus} and my common symptoms are ${values.mainSymptoms}.
  // I ${values.symptomTracking} my symptoms often using ${values.trackingDevice}.
  // My biggest challenge is ${values.biggestChallenge}.
  // Currently I ${values.successManaging} successful managing my symptoms.

  // I have a history of ${values.diagnosedConditions}.
  // My genetic test indicates I have ${values.geneticTraits}.
  // In my family there's history of ${values.maternalSide}.
  // I take ${values.medications} to support my condition.

  // Right now I have a ${values.lifestyleInfo} lifestyle.
  // I eat about ${values.takeout}% takeout food and ${values.homeCooked}% home-cooked food.
  // My diet is ${values.dietType} and I exercise ${values.exercise} days during a week.
  // My sex life is ${values.sexLife} and my emotional support network is usually ${values.supportSystem}.

  // My goal is to ${values.goals}.`;

  //       setSelectedSwitch(config.defaultOption);
  //       await handleNewMessage(message, []);
  //       form.reset();
  //       setCurrentStep(0);
  //     } else {
  //       setCurrentStep(nextStep);
  //     }
  //   };

  // const handleNextStep = () => goToStep(currentStep + 1);

  // const handleStepClick = async (stepIndex: number) => {
  //   await goToStep(stepIndex);
  // };

  const handleNewChatOpen = () => {
    const newChatId = `new_chat_${Date.now()}`;

    setCurrentChatId(newChatId);
    setMessages([]);
    setStreamingText("");
    setChatTitle("");
    setError(null);
    initialSearchDone.current = false;
    sessionLoadDone.current = false;

    navigate(
      isCoach
        ? `/content-manager/library/${newChatId}`
        : `/library/${newChatId}`,
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
      className={`flex flex-col w-full h-screen gap-6 ${isCoach ? "p-6 bg-[#F2F4F6]" : "md:p-6 bg-white md:bg-[#F2F4F6]"} overflow-y-auto xl:overflow-y-none`}
    >
      <div className={`${isCoach ? "" : "hidden md:block"}`}>
        <ChatBreadcrumb displayChatTitle={displayChatTitle} />
      </div>
      <div className="flex flex-row w-full h-full gap-6 md:relative">
        <div className="hidden xl:block">
          <ChatActions
            onRegenerate={handleRegenerateResponse}
            isSearching={isSearching}
            hasMessages={messages.length >= 2}
            isHistoryPopup
            fromPath={location.state?.from?.pathname ?? null}
            initialRating={chat.length ? (chat[0].liked ? 5 : 1) : undefined}
            onReadAloud={handleReadAloud}
            isReadingAloud={isReadingAloud}
          />
        </div>
        {isLoadingSession ? (
          <ChatLoading />
        ) : (
          <div className="flex flex-col w-full h-full overflow-clip">
            <ChatHeader
              displayChatTitle={displayChatTitle}
              isExistingChat={!!isExistingChat}
              isCoach={isCoach}
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
            {isEmpty &&
            // !isSwitch(SWITCH_KEYS.PERSONALIZE) &&
            !isSwitch(SWITCH_KEYS.CASE) ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center bg-white rounded-b-xl p-[24px]">
                {isCoach ? (
                  <div className="flex flex-col items-center justify-center text-center gap-[8px] p-[16px] bg-[#F3F6FB] border border-[#1C63DB] rounded-[16px] w-full h-fit mt-auto">
                    <h2 className="text-[18px] md:text-[24px] text-[#1B2559] font-[700]">
                      Start a conversation
                    </h2>
                    <p className="text-[16px] md:text-[18px] text-[#1C63DB] max-w-[464px]">
                      Select an action below and enter a query to start a
                      conversation with Tolu.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="md:hidden flex flex-col items-center justify-center flex-1">
                      <div className="max-w-[300px] sm:max-w-[360px] mx-auto">
                        <h2 className="text-[24px] leading-tight font-[700] text-[#1D1D1F]">
                          Hey, what’s going on in your world today?
                        </h2>
                        <p className="mt-3 text-[14px] leading-[1.45] text-[#5F5F65]">
                          Tell me what’s feeling off or what you’re working on.
                          I’ll help you make sense of it and find your next
                          step.
                        </p>
                      </div>
                    </div>

                    <div className="hidden md:flex flex-col items-center justify-center text-center gap-[8px] p-[16px] bg-[#F3F6FB] border border-[#1C63DB] rounded-[16px] w-full h-fit mt-auto">
                      <h2 className="text-[18px] md:text-[24px] text-[#1B2559] font-[700]">
                        Start a conversation
                      </h2>
                      <div className="flex flex-col items-baseline justify-center">
                        <p className="text-[16px] md:text-[18px] text-[#1C63DB]">
                          Activate{" "}
                          <span className="font-bold">Smart Search</span> for
                          personalized health answers.
                        </p>
                        <p className="text-[16px] md:text-[18px] text-[#1C63DB]">
                          Activate <span className="font-bold">Learn</span> for
                          expert-verified guidance you can trust.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : // isSwitch(SWITCH_KEYS.PERSONALIZE) && healthHistory ? (
            //   <>
            //     <MessageList
            //       messages={messages}
            //       isSearching={isSearching}
            //       streamingText={streamingText}
            //       error={error}
            //     />
            //     <Card className="flex flex-col w-full overflow-auto border-none rounded-0 rounded-b-xl">
            //       <div className="w-full mb-[24px]" />
            //       <CardContent
            //         className={`w-full ${isMobileChatOpen ? "px-0" : "px-6"} mt-auto rounded-0`}
            //       >
            //         <div className="p-[24px] border border-[#008FF6] rounded-[20px] overflow-y-auto">
            //           <p className="text-[24px] text-[#1D1D1F] font-[500]">
            //             Personal story
            //           </p>
            //           <Steps
            //             steps={steps}
            //             stepWidth={"w-full"}
            //             currentStep={currentStep}
            //             ordered
            //             onStepClick={handleStepClick}
            //           />
            //           <form onSubmit={(e) => e.preventDefault()}>
            //             {currentStep === 0 && <SymptomsForm form={form} />}
            //             {currentStep === 1 && <MenopauseForm form={form} />}
            //             {currentStep === 2 && <HealthHistoryForm form={form} />}
            //             {currentStep === 3 && <LifestyleForm form={form} />}
            //             {currentStep === 4 && <GoalsForm form={form} />}
            //           </form>
            //           <div className="flex justify-end gap-2 mt-6">
            //             <button
            //               type="button"
            //               className={`py-[11px] px-[30px] rounded-full text-[16px] font-semibold transition-colors duration-200 bg-[#1C63DB] text-white`}
            //               onClick={handleNextStep}
            //             >
            //               Continue
            //             </button>
            //           </div>
            //         </div>
            //       </CardContent>
            //     </Card>
            //   </>
            // ) :
            isSwitch(SWITCH_KEYS.CASE) ? (
              <>
                <MessageList
                  messages={messages}
                  isSearching={isSearching}
                  streamingText={streamingText}
                  error={error}
                />
                <Card className="flex flex-col w-full overflow-auto border-none rounded-0 rounded-b-xl">
                  <div className="w-full mb-[24px]" />
                  <CardContent
                    className={`w-full ${isMobileChatOpen ? "px-0" : "px-6"} mt-auto rounded-0`}
                  >
                    <div className="p-[24px] border border-[#008FF6] rounded-[20px] overflow-y-auto">
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
              <div className={`${isCoach ? "" : "px-[16px] md:px-0 h-full"}`}>
                <MessageList
                  messages={messages}
                  isSearching={isSearching}
                  streamingText={streamingText}
                  error={error}
                />
              </div>
            )}

            <div
              className={`xl:hidden block mt-[16px] ${isCoach ? "" : "px-[16px] w-fit mx-auto md:px-0 md:w-full md: mx-0"}`}
            >
              <ChatActions
                onRegenerate={handleRegenerateResponse}
                isSearching={isSearching}
                hasMessages={messages.length >= 2}
                isHistoryPopup
                initialRating={
                  chat.length ? (chat[0].liked ? 5 : 1) : undefined
                }
                onReadAloud={handleReadAloud}
                isReadingAloud={isReadingAloud}
              />
            </div>

            <LibraryChatInput
              className={`mt-4 xl:border-0 xl:border-t xl:rounded-none ${
                !isCoach
                  ? "border border-[#DBDEE1] bg-white box-shadow-input rounded-t-[16px] rounded-b-none"
                  : "border xl:border-0"
              }`}
              onSend={handleNewMessage}
              disabled={isSearching}
              switchOptions={
                isCoach ? config.options.slice(0, -1) : config.options
              }
              selectedSwitch={selectedSwitch}
              setSelectedSwitch={(value) => {
                handleNewChatOpen();
                setSelectedSwitch(value);
              }}
              message={textContent}
              setNewMessage={setTextContent}
              setClientId={setClientId}
              placeholder={
                isCoach || !isMobile ? "Your message" : "I'm listening..."
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
