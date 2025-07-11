import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { SearchService, StreamChunk } from "entities/search/api";
import { SearchResultResponseItem } from "entities/search/model";
import { MessageList } from "widgets/message-list";
import { LibraryChatInput } from "entities/search";
import { RootState } from "entities/store";
import {
  ChatActions,
  ChatBreadcrumb,
  ChatHeader,
  ChatLoading,
  Message,
} from "features/chat";
import {
  SWITCH_CONFIG,
  SWITCH_KEYS,
  SwitchValue,
} from "widgets/library-small-chat/switch-config";
import { Card, CardContent } from "shared/ui";
import { SymptomsForm } from "widgets/library-small-chat/components/symptoms-form";
import { MenopauseForm } from "widgets/library-small-chat/components/menopause-form/ui";
import { HealthHistoryForm } from "widgets/library-small-chat/components/health-history-form";
import { LifestyleForm } from "widgets/library-small-chat/components/lifestyle-form";
import { GoalsForm } from "widgets/library-small-chat/components/goals-form";
import { Steps } from "features/steps/ui";
import {
  baseSchema,
  mapHealthHistoryToFormDefaults,
} from "widgets/library-small-chat/lib";
import { useForm } from "react-hook-form";
import z from "zod";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";

const steps = [
  "Demographic",
  "Menopause Status",
  "Health history",
  "Your Lifestyle",
  "Your Goals",
];

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

  const initialSearchDone = useRef(false);
  const sessionLoadDone = useRef(false);

  const initialMessage = location.state?.message;
  const searchType = location.state?.searchType;
  const files = location.state?.files;

  const isExistingChat = chatId && !chatId.startsWith("new_chat_");
  const config = SWITCH_CONFIG.default;
  const [selectedSwitch, setSelectedSwitch] = useState<string>(
    config.options[0] as string
  );
  const isSwitch = (value: SwitchValue) => selectedSwitch === value;
  const [currentStep, setCurrentStep] = useState(0);
  const healthHistory = useSelector(
    (state: RootState) => state.healthHistory.data
  );

  const form = useForm<z.infer<typeof baseSchema>>({
    resolver: zodResolver(baseSchema),
    defaultValues: mapHealthHistoryToFormDefaults(healthHistory),
  });

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
          navigate(`/library/${newChatId}`, {
            replace: true,
            state: { message: initialMessage, searchType },
          });
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
            chatMessages.push({
              id: `ai-${item.id}`,
              type: "ai",
              content: item.answer,
              timestamp: new Date(item.created_at),
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
              navigate(`/library/${finalData.chat_id}`, { replace: true });
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

  const handleNewMessage = async (message: string, files: File[]) => {
    if (!message.trim() || isSearching) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsSearching(true);
    setStreamingText("");
    setError(null);

    let accumulatedText = "";

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

    try {
      await SearchService.aiSearchStream(
        {
          chat_message: JSON.stringify({
            user_prompt: message,
            is_new: false,
            chat_id: currentChatId.startsWith("new_chat_")
              ? undefined
              : currentChatId,
            regenerate_id: null,
          }),
          ...(image && { image }),
          ...(pdf && { pdf }),
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
          console.error("Search error:", error);
        }
      );
    } catch (error) {
      setIsSearching(false);
      setError(error instanceof Error ? error.message : "Search failed");
      console.error("Search error:", error);
    }
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

  const goToStep = async (nextStep: number) => {
    if (nextStep >= steps.length) {
      const values = form.getValues();
      const message = `Hi Tolu, I'm a ${values.age}-year-old and I'm ${values.maritalStatus}. 
I work as a ${values.job} and I have ${values.children} children. 
I live in ${values.location} and I'm a ${values.religion}. 
I consider my financial ability ${values.financialStatus}. 
I was born a ${values.genderAssignedAtBirth} and I identify as a ${values.genderIdentity}. 

I am in ${values.menopauseStatus} and my common symptoms are ${values.mainSymptoms}. 
I ${values.symptomTracking} my symptoms often using ${values.trackingDevice}. 
My biggest challenge is ${values.biggestChallenge}. 
Currently I ${values.successManaging} successful managing my symptoms.

I have a history of ${values.diagnosedConditions}. 
My genetic test indicates I have ${values.geneticTraits}. 
In my family there's history of ${values.maternalSide}. 
I take ${values.medications} to support my condition.

Right now I have a ${values.lifestyleInfo} lifestyle. 
I eat about ${values.takeout}% takeout food and ${values.homeCooked}% home-cooked food. 
My diet is ${values.dietType} and I exercise ${values.exercise} days during a week. 
My sex life is ${values.sexLife} and my emotional support network is usually ${values.supportSystem}.

My goal is to ${values.goals}.`;

      setSelectedSwitch(config.defaultOption);
      await handleNewMessage(message, []);
      form.reset();
      setCurrentStep(0);
    } else {
      setCurrentStep(nextStep);
    }
  };

  const handleNextStep = () => goToStep(currentStep + 1);

  const handleStepClick = async (stepIndex: number) => {
    await goToStep(stepIndex);
  };

  return (
    <div className="flex flex-col w-full h-full gap-6 p-6 overflow-y-auto xl:overflow-y-none">
      <ChatBreadcrumb displayChatTitle={displayChatTitle} />
      <div className="flex flex-row w-full h-full gap-6 max-h-[calc(100vh-6rem)] md:relative">
        <div className="hidden xl:block">
          <ChatActions
            onRegenerate={handleRegenerateResponse}
            isSearching={isSearching}
            hasMessages={messages.length >= 2}
            isHistoryPopup
          />
        </div>
        {isLoadingSession ? (
          <ChatLoading />
        ) : (
          <div className="flex flex-col w-full h-full overflow-clip">
            <ChatHeader
              displayChatTitle={displayChatTitle}
              isExistingChat={!!isExistingChat}
              onNewSearch={() => {
                const newChatId = `new_chat_${Date.now()}`;
                navigate(`/library/${newChatId}`);
              }}
            />

            {isEmpty && !isSwitch(SWITCH_KEYS.PERSONALIZE) ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center bg-white rounded-b-xl">
                <div className="max-w-md space-y-4 px-[16px]">
                  <h3 className="text-xl font-semibold text-gray-700">
                    Start a new conversation
                  </h3>
                  <p className="text-gray-500">
                    Ask me anything about your health, nutrition, or wellness
                    goals. I'm here to help with personalized insights and
                    recommendations.
                  </p>
                </div>
              </div>
            ) : (isSwitch(SWITCH_KEYS.PERSONALIZE) && healthHistory) ||
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
                  <CardContent className="w-full px-6 mt-auto rounded-0">
                    <div className="p-[24px] border border-[#008FF6] rounded-[20px] overflow-y-auto">
                      <p className="text-[24px] text-[#1D1D1F] font-[500]">
                        Personal story
                      </p>
                      <Steps
                        steps={steps}
                        stepWidth={"w-full"}
                        currentStep={currentStep}
                        ordered
                        onStepClick={handleStepClick}
                      />
                      <form onSubmit={(e) => e.preventDefault()}>
                        {currentStep === 0 && <SymptomsForm form={form} />}
                        {currentStep === 1 && <MenopauseForm form={form} />}
                        {currentStep === 2 && <HealthHistoryForm form={form} />}
                        {currentStep === 3 && <LifestyleForm form={form} />}
                        {currentStep === 4 && <GoalsForm form={form} />}
                      </form>
                      <div className="flex justify-end gap-2 mt-6">
                        <button
                          type="button"
                          className={`py-[11px] px-[30px] rounded-full text-[16px] font-semibold transition-colors duration-200 bg-[#1C63DB] text-white`}
                          onClick={handleNextStep}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <MessageList
                messages={messages}
                isSearching={isSearching}
                streamingText={streamingText}
                error={error}
              />
            )}

            <div className="xl:hidden block mt-[16px]">
              <ChatActions
                onRegenerate={handleRegenerateResponse}
                isSearching={isSearching}
                hasMessages={messages.length >= 2}
                isHistoryPopup
              />
            </div>

            <LibraryChatInput
              className="mt-4"
              onSend={handleNewMessage}
              disabled={isSearching}
              switchOptions={config.options}
              selectedSwitch={selectedSwitch}
              setSelectedSwitch={setSelectedSwitch}
            />
          </div>
        )}
      </div>
    </div>
  );
};
