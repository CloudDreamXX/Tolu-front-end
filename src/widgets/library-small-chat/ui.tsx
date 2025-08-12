import { zodResolver } from "@hookform/resolvers/zod";
import { ClientService } from "entities/client";
import { CoachService } from "entities/coach";
import { LibraryChatInput } from "entities/search";
import { SearchService, StreamChunk } from "entities/search/api";
import { RootState } from "entities/store";
import { ChatBreadcrumb, Message } from "features/chat";
import { joinReplyChunksSafely } from "features/chat/ui/message-bubble/lib";
import { Expand, Paperclip, Send, Settings } from "lucide-react";
import { caseBaseSchema } from "pages/content-manager";
import {
  CaseSearchForm,
  FormValues,
} from "pages/content-manager/create/case-search";
import { useEffect, useState } from "react";
import { useForm, useFormState, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "shared/ui";
import {
  PopoverAttach,
  PopoverClient,
  PopoverFolder,
  PopoverInstruction,
} from "widgets/content-popovers";
import { MessageList } from "widgets/message-list";
import { SWITCH_CONFIG, SWITCH_KEYS, SwitchValue } from "./switch-config";
// const steps = [
//   "Demographic",
//   "Menopause Status",
//   "Health history",
//   "Your Lifestyle",
//   "Your Goals",
// ];

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
  const navigate = useNavigate();
  const location = useLocation();
  const isCreatePage = location.pathname === "/content-manager/create";
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { documentId } = useParams();
  const config = isCoach
    ? SWITCH_CONFIG.coach
    : documentId
      ? SWITCH_CONFIG.personalize
      : SWITCH_CONFIG.default;
  const selectedSwitchFromState = location.state?.selectedSwitch;
  const isValidSwitch = Object.values(SWITCH_KEYS).includes(
    selectedSwitchFromState
  );

  const [selectedSwitch, setSelectedSwitch] = useState<string>(
    selectedSwitchFromState && isValidSwitch
      ? selectedSwitchFromState
      : isCreatePage
        ? SWITCH_KEYS.RESEARCH
        : config.options[0]
  );

  const isSwitch = (value: SwitchValue) => selectedSwitch === value;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [streamingText, setStreamingText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [chatTitle, setChatTitle] = useState<string>("");
  // const [currentStep, setCurrentStep] = useState(0);
  const [message, setMessageState] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [existingInstruction, setExistingInstruction] = useState<string>("");
  const [instruction, setInstruction] = useState<string>("");
  const loading = useSelector((state: RootState) => state.client.loading);
  const chat = useSelector((state: RootState) => state.client.chat);
  const [isLoadingSession, setIsLoadingSession] = useState(false);

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
    if (
      chat.length &&
      !chat[0].chat_id.startsWith("new_chat_") &&
      !messages.length
    ) {
      loadExistingSession(chat[0].chat_id);
    }
  }, []);

  useEffect(() => {
    if (isValid) {
      const message = generateCaseStory();
      setMessageState?.(message);
    }
  }, [isValid]);

  const loadExistingSession = async (chatId: string) => {
    setIsLoadingSession(true);
    setError(null);

    try {
      const sessionData = await SearchService.getSession(chatId);

      if (sessionData && sessionData.length > 0) {
        const chatMessages: Message[] = [];

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

        chatMessages.sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        );

        setMessages(chatMessages);

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

    setSelectedSwitch(value);

    setIsSwitchLoading(false);
  };

  const handleExpandClick = () => {
    if (isSearching) return;

    const basePath = isCoach ? "/content-manager" : "";
    const chatId = currentChatId || `new_chat_${Date.now()}`;

    navigate(`${basePath}/library/${chatId}`, {
      state: {
        from: location,
      },
    });
  };

  const MessageLoadingSkeleton = () => {
    const Bubble = ({
      align = "left",
      lines = 3,
    }: {
      align?: "left" | "right";
      lines?: number;
    }) => {
      const isRight = align === "right";

      const getRandomWidth = (min: number, max: number) =>
        `${Math.floor(Math.random() * (max - min + 1)) + min}px`;

      return (
        <div
          className={`flex ${isRight ? "justify-end" : "justify-start"} w-full`}
        >
          <div
            className={`flex flex-col gap-[8px] p-[16px] bg-[#F6F6F6] rounded-[8px] max-w-[90%] w-fit`}
          >
            <div className="flex justify-between items-center w-full mb-[6px]">
              <div
                className="h-[10px] skeleton-gradient rounded-[24px]"
                style={{ width: getRandomWidth(60, 100) }}
              />
              <div
                className="h-[10px] skeleton-gradient rounded-[24px]"
                style={{ width: getRandomWidth(60, 100) }}
              />
            </div>

            {[...Array(lines)].map((_, i) => (
              <div
                key={i}
                className="h-[12px] skeleton-gradient rounded-[24px]"
                style={{ width: getRandomWidth(160, 300) }}
              />
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="flex flex-col w-full gap-6 animate-pulse">
        <Bubble align="left" lines={2} />
        <Bubble align="right" lines={3} />
        <Bubble align="left" lines={5} />
      </div>
    );
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

    setMessageState("");
    setIsSearching(true);
    setStreamingText("");
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

        const chatId = (finalData?.chat_id || finalData?.chatId) ?? "";

        const aiMessage: Message = {
          id: chatId || Date.now().toString(),
          type: "ai",
          content: isLearn
            ? joinReplyChunksSafely(replyChunks)
            : accumulatedText,
          timestamp: new Date(),
          document: str,
        };

        setMessages((prev) => [...prev, aiMessage]);
        setStreamingText("");

        if (chatId && chatId !== currentChatId) {
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
          folderId!,
          files,
          clientId,
          processChunk,
          processFinal
        );

        if (res.documentId) {
          navigate(
            `/content-manager/library/folder/${folderId}/document/${res.documentId}`,
            {
              state: {
                selectedSwitch: SWITCH_KEYS.CREATE,
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
          folderId!,
          files,
          clientId,
          processChunk,
          processFinal
        );

        if (res.documentId) {
          navigate(
            `/content-manager/library/folder/${folderId}/document/${res.documentId}`,
            {
              state: {
                selectedSwitch: SWITCH_KEYS.CASE,
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
          image,
          pdf,
          processChunk,
          processFinal
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
            image,
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
          }
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
              // personalize: isSwitch(SWITCH_KEYS.PERSONALIZE),
            }),
            ...(image && { image }),
            ...(pdf && { pdf }),
          },
          processChunk,
          processFinal,
          (error) => {
            setIsSearching(false);
            setError(error.message);
            console.error("Search error:", error);
          }
        );
      }
    } catch (error) {
      setIsSearching(false);
      setError(error instanceof Error ? error.message : "Search failed");
      console.error("Search error:", error);
    }

    return returnedChatId;
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

    return `
    This case involves a ${age}-year-old ${employmentStatus} woman in the ${menopausePhase} phase, presenting with ${symptoms}.
    Her health history includes ${diagnosedConditions}, and she is currently taking ${medication}.
    Lifestyle factors such as ${lifestyleFactors} may be contributing.
    Previous interventions have included ${previousInterventions}, with ${interventionOutcome}.
    The suspected root causes include ${suspectedRootCauses}.
    This case is being used to create a ${protocol} aimed at ${goal}.
  `;
  };

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

  //       handleSwitchChange(config.defaultOption);
  //       await handleNewMessage(message, []);
  //       form.reset();
  //       // setCurrentStep(0);
  //     } else {
  //       // setCurrentStep(nextStep);
  //     }
  //   };

  const handleNewChatOpen = () => {
    setCurrentChatId("");
    setMessages([]);
    setStreamingText("");
    setChatTitle("");
    setError(null);
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
      {/* {isSwitch(SWITCH_KEYS.PERSONALIZE) && healthHistory ? (
        <Card className="flex flex-col w-full h-full overflow-auto border-none rounded-2xl">
          <CardHeader className="relative flex flex-col items-center gap-4">
            <div className="p-2.5 bg-[#1C63DB] w-[70px] h-[40px] rounded-lg text-white font-semibold text-[24px] flex items-center justify-center font-open">
              Tolu
            </div>
            {loading || isLoading || isSwitchLoading || isLoadingSession ? (
              <div className="h-[12px] skeleton-gradient rounded-[24px] w-[218px]" />
            ) : (
              <CardTitle>Creator Studio</CardTitle>
            )}
            <button
              className="hidden xl:block xl:absolute top-4 left-4"
              onClick={handleExpandClick}
              title="Expand chat"
            >
              <Expand className="w-6 h-6 text-[#5F5F65]" />
            </button>
          </CardHeader>
          <div className="border-t border-[#DDEBF6] w-full mb-[24px]" />
          <CardContent className="w-full h-full px-6 pb-0">
            <div className="p-[24px] border border-[#008FF6] rounded-[20px] overflow-auto mt-auto">
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
          <CardFooter className="w-full p-0">
            <LibraryChatInput
              className="w-full p-6 border-none rounded-t-none rounded-b-2xl"
              onSend={handleNewMessage}
              disabled={isSearching}
              switchOptions={
                isDraft ? config.options : config.options.slice(0, -1)
              }
              selectedSwitch={selectedSwitch}
              setSelectedSwitch={(value) => {
                handleNewChatOpen();
                handleSwitchChange(value);
              }}
              footer={footer}
              isLoading={isLoading}
            />
          </CardFooter>
        </Card>
      ) :  */}
      {isSwitch(SWITCH_KEYS.CASE) ? (
        <Card className="flex flex-col w-full h-full overflow-auto border-none rounded-2xl">
          <CardHeader className="relative flex flex-col items-center gap-4">
            <div className="p-2.5 bg-[#1C63DB] w-[70px] h-[40px] rounded-lg text-white font-semibold text-[24px] flex items-center justify-center font-open">
              Tolu
            </div>
            {loading || isLoading || isSwitchLoading || isLoadingSession ? (
              <div className="h-[12px] skeleton-gradient rounded-[24px] w-[218px]" />
            ) : (
              <CardTitle>
                {isCoach ? "Creator Studio" : "[user's name] AI assistant"}
              </CardTitle>
            )}
            <button
              className="hidden xl:block xl:absolute top-4 left-4"
              onClick={handleExpandClick}
              title="Expand chat"
            >
              <Expand className="w-6 h-6 text-[#5F5F65]" />
            </button>
          </CardHeader>
          <div className="border-t border-[#DDEBF6] w-full mb-[24px]" />
          <CardContent className="w-full h-full px-6 pb-0 overflow-auto">
            <div className="p-[24px] border border-[#008FF6] rounded-[20px] overflow-auto mt-auto">
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
              className="w-full p-6 border-none rounded-t-none rounded-b-2xl"
              onSend={() => handleNewMessage(message, files)}
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
                      setFiles={setFiles}
                      existingFiles={existingFiles}
                      disabled={!folderId}
                      customTrigger={
                        <Button
                          variant="ghost"
                          className="relative text-[#1D1D1F] bg-[#F3F6FB] rounded-full w-12 h-12 hover:bg-secondary/80"
                        >
                          <Paperclip size={24} />
                          {files.length > 0 && (
                            <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -right-1">
                              {files.length > 99 ? "99+" : files.length}
                            </span>
                          )}
                        </Button>
                      }
                    />
                    <PopoverClient setClientId={setClientId} />
                    <PopoverFolder
                      setFolderId={setFolderId}
                      setExistingFiles={setExistingFiles}
                      setExistingInstruction={setExistingInstruction}
                    />
                    <PopoverInstruction
                      customTrigger={
                        <Button
                          variant="ghost"
                          className="relative text-[#1D1D1F] bg-[#F3F6FB] rounded-full w-12 h-12 hover:bg-secondary/80"
                          disabled={!folderId}
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
                      handleSwitchChange(SWITCH_KEYS.CREATE);
                      handleNewMessage(message, files);
                    }}
                    disabled={isSearching || !folderId || message === ""}
                    className="w-12 h-12 p-0 bg-[#1D1D1F] rounded-full hover:bg-black disabled:opacity-[0.5] disabled:cursor-not-allowed"
                  >
                    <Send size={28} color="white" />
                  </Button>
                </div>
              }
              isLoading={isLoading}
            />
          </CardFooter>
        </Card>
      ) : (
        <Card className="flex flex-col w-full h-full border-none rounded-2xl">
          <CardHeader className="relative flex flex-col items-center gap-4">
            <div className="p-2.5 bg-[#1C63DB] w-[70px] h-[40px] rounded-lg text-white font-semibold text-[24px] flex items-center justify-center font-open">
              Tolu
            </div>
            {loading || isLoading || isSwitchLoading || isLoadingSession ? (
              <div className="h-[12px] skeleton-gradient rounded-[24px] w-[218px]" />
            ) : (
              <CardTitle>Creator Studio</CardTitle>
            )}
            {!isSwitch(SWITCH_KEYS.CONTENT) && (
              <button
                className="hidden xl:block xl:absolute top-4 left-4"
                onClick={handleExpandClick}
                title="Expand chat"
              >
                <Expand className="w-6 h-6 text-[#5F5F65]" />
              </button>
            )}
          </CardHeader>
          <CardContent className="flex flex-1 w-full h-full min-h-0 overflow-y-auto">
            {loading || isLoading || isSwitchLoading || isLoadingSession ? (
              <MessageLoadingSkeleton />
            ) : messages.length ? (
              <MessageList
                messages={messages}
                isSearching={isSearching}
                streamingText={streamingText}
                error={error}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center gap-[8px] p-[16px] bg-[#F3F6FB] border border-[#1C63DB] rounded-[16px] w-full h-fit mt-auto">
                <h2 className="text-[18px] md:text-[24px] text-[#1B2559] font-[700]">
                  Start a conversation
                </h2>
                {isCoach ? (
                  <p className="text-[16px] md:text-[18px] text-[#1C63DB] max-w-[464px]">
                    Select an action below and enter a query to start a
                    conversation with Tolu.
                  </p>
                ) : (
                  <div className="flex flex-col items-baseline justify-center">
                    <p className="text-[16px] md:text-[18px] text-[#1C63DB]">
                      Activate <span className="font-bold">Smart Search</span>{" "}
                      for personalized health answers.
                    </p>

                    <p className="text-[16px] md:text-[18px] text-[#1C63DB]">
                      Activate <span className="font-bold">Learn</span> for
                      expert‑verified guidance you can trust.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="w-full p-0">
            <LibraryChatInput
              className="w-full p-6 border-t rounded-t-none rounded-b-2xl"
              onSend={() => handleNewMessage(message, files)}
              disabled={
                isSearching ||
                (isSwitch(SWITCH_KEYS.CREATE) && !folderId) ||
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
              setNewMessage={setMessageState}
              footer={
                isSwitch(SWITCH_KEYS.CREATE) ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[10px]">
                      <PopoverAttach
                        setFiles={setFiles}
                        existingFiles={existingFiles}
                        disabled={!folderId}
                        customTrigger={
                          <Button
                            variant="ghost"
                            className="relative text-[#1D1D1F] bg-[#F3F6FB] rounded-full w-12 h-12 hover:bg-secondary/80"
                          >
                            <Paperclip size={24} />
                            {files.length > 0 && (
                              <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -right-1">
                                {files.length > 99 ? "99+" : files.length}
                              </span>
                            )}
                          </Button>
                        }
                      />
                      <PopoverClient setClientId={setClientId} />
                      <PopoverFolder
                        setFolderId={setFolderId}
                        setExistingFiles={setExistingFiles}
                        setExistingInstruction={setExistingInstruction}
                      />
                      <PopoverInstruction
                        customTrigger={
                          <Button
                            variant="ghost"
                            className="relative text-[#1D1D1F] bg-[#F3F6FB] rounded-full w-12 h-12 hover:bg-secondary/80"
                            disabled={!folderId}
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
                        handleNewMessage(message, files);
                      }}
                      disabled={isSearching || !folderId || message === ""}
                      className="w-12 h-12 p-0 bg-[#1D1D1F] rounded-full hover:bg-black disabled:opacity-[0.5] disabled:cursor-not-allowed"
                    >
                      <Send size={28} color="white" />
                    </Button>
                  </div>
                ) : isSwitch(SWITCH_KEYS.RESEARCH) ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[10px]">
                      <PopoverAttach
                        setFiles={setFiles}
                        existingFiles={existingFiles}
                        disabled={false}
                        customTrigger={
                          <Button
                            variant="ghost"
                            className="relative text-[#1D1D1F] bg-[#F3F6FB] rounded-full w-12 h-12 hover:bg-secondary/80"
                          >
                            <Paperclip size={24} />
                            {files.length > 0 && (
                              <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full -top-1 -right-1">
                                {files.length > 99 ? "99+" : files.length}
                              </span>
                            )}
                          </Button>
                        }
                      />
                      <PopoverClient setClientId={setClientId} />
                    </div>
                    <Button
                      onClick={() => {
                        handleNewMessage(message, files);
                      }}
                      disabled={isSearching || message === ""}
                      className="w-12 h-12 p-0 bg-[#1D1D1F] rounded-full hover:bg-black disabled:opacity-[0.5] disabled:cursor-not-allowed"
                    >
                      <Send size={28} color="white" />
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
