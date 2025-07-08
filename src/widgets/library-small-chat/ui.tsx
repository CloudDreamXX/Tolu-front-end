import { zodResolver } from "@hookform/resolvers/zod";
import { HealthHistory, HealthHistoryService } from "entities/health-history";
import { LibraryChatInput } from "entities/search";
import { SearchService, StreamChunk } from "entities/search/api";
import { RootState } from "entities/store";
import { Message } from "features/chat";
import { Steps } from "features/steps/ui";
import { Expand } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Tolu from "shared/assets/icons/tolu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "shared/ui";
import { MessageList } from "widgets/message-list";
import z from "zod";
import { GoalsForm } from "./components/goals-form";
import { HealthHistoryForm } from "./components/health-history-form";
import { LifestyleForm } from "./components/lifestyle-form";
import { SymptomsForm } from "./components/symptoms-form";
import {
  baseSchema,
  mapFormToPostData,
  mapHealthHistoryToFormDefaults,
} from "./lib";
import { SWITCH_CONFIG, SWITCH_KEYS, SwitchValue } from "./switch-config";

const steps = [
  "Symptoms",
  "Your Health History",
  "Your Lifestyle",
  "Your Goals",
];

interface LibrarySmallChatProps {
  healthHistory?: HealthHistory;
  isCoach?: boolean;
}

export const LibrarySmallChat: React.FC<LibrarySmallChatProps> = ({
  healthHistory,
  isCoach,
}) => {
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const config = isCoach ? SWITCH_CONFIG.coach : SWITCH_CONFIG.default;
  const [selectedSwitch, setSelectedSwitch] = useState<string>(
    config.options[0] as string
  );
  const isSwitch = (value: SwitchValue) => selectedSwitch === value;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [streamingText, setStreamingText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [chatTitle, setChatTitle] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<z.infer<typeof baseSchema>>({
    resolver: zodResolver(baseSchema),
    defaultValues: mapHealthHistoryToFormDefaults(healthHistory),
  });

  useEffect(() => {
    if (healthHistory) {
      const defaults = mapHealthHistoryToFormDefaults(healthHistory);
      form.reset(defaults);
    }
  }, [healthHistory, form]);

  const handleExpandClick = () => {
    if (isSearching) return;

    if (currentChatId) {
      navigate(`${isCoach ? "/content-manager" : ""}/library/${currentChatId}`);
    } else {
      const newChatId = `new_chat_${Date.now()}`;
      navigate(`${isCoach ? "/content-manager" : ""}/library/${newChatId}`);
    }
  };

  const handleNewMessage = async (
    message: string,
    files: File[]
  ): Promise<string | undefined> => {
    if ((!message.trim() && files.length === 0) || isSearching) return;

    if (isSwitch(SWITCH_KEYS.PERSONALIZE)) {
      try {
        const formValues = form.getValues();
        const postData = mapFormToPostData(formValues);

        await HealthHistoryService.createHealthHistory(postData);
      } catch (error) {
        console.error("Failed to save health history:", error);
        setError("Failed to save health history before starting the chat.");
        return;
      }
    }

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

    try {
      await SearchService.aiSearchStream(
        {
          chat_message: JSON.stringify({
            user_prompt: message,
            is_new: !currentChatId,
            chat_id: currentChatId,
            regenerate_id: null,
            personalize: isSwitch(SWITCH_KEYS.PERSONALIZE),
          }),
          ...(image && { image }),
          ...(pdf && { pdf }),
        },
        async (chunk: StreamChunk) => {
          if (isSwitch(SWITCH_KEYS.CONTENT) && chunk.content) {
            if (chunk.content.includes("Relevant Content")) {
              str = chunk.content;
            } else {
              accumulatedText += chunk.content;
              setStreamingText(accumulatedText);
            }
          }
          if (chunk.reply) {
            accumulatedText += chunk.reply;
            setStreamingText(accumulatedText);
          }
        },
        async (finalData) => {
          setIsSearching(false);

          const aiMessage: Message = {
            id: finalData.chat_id || Date.now().toString(),
            type: "ai",
            content: accumulatedText,
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
        },
        (error) => {
          setIsSearching(false);
          setError(error.message);
          console.error("Search error:", error);
        },
        isSwitch(SWITCH_KEYS.CONTENT)
      );
    } catch (error) {
      setIsSearching(false);
      setError(error instanceof Error ? error.message : "Search failed");
      console.error("Search error:", error);
    }

    return returnedChatId;
  };

  const stepFields: (keyof z.infer<typeof baseSchema>)[][] = [
    [
      "age",
      "maritalStatus",
      "job",
      "children",
      "menopauseStatus",
      "mainSymptoms",
      "otherChallenges",
      "strategiesTried",
    ],
    [
      "diagnosedConditions",
      "geneticTraits",
      "maternalSide",
      "paternalSide",
      "notableConcern",
    ],
    [
      "lifestyleInfo",
      "takeout",
      "homeCooked",
      "dietType",
      "exercise",
      "limitations",
      "medications",
      "period",
      "sexLife",
      "supportSystem",
    ],
    ["goals"],
  ];

  const goToStep = async (nextStep: number) => {
    if (nextStep > currentStep) {
      const isValid = await form.trigger(stepFields[currentStep]);
      if (!isValid) return;
    }

    if (nextStep >= steps.length) {
      const values = form.getValues();
      const message = `Hi Tolu. I’m a ${values.age}-year-old ${values.maritalStatus} woman working ${values.job}, 
                      and I have ${values.children} children. I’m ${values.menopauseStatus} but lately I’ve been dealing with ${values.mainSymptoms}. 
                      I’ve also noticed ${values.otherChallenges}, and it feels like no matter ${values.strategiesTried}, things aren’t getting better. 
                      My health history includes ${values.diagnosedConditions}, and I have ${values.geneticTraits}. 
                      In my family, there’s a history of ${values.maternalSide} on my mom’s side and ${values.paternalSide} on my dad’s side. 
                      Someone in my family was recently diagnosed with ${values.notableConcern}, which has me thinking more about prevention. Right now, 
                      my lifestyle includes ${values.lifestyleInfo}, eating about ${values.takeout} takeout and ${values.homeCooked} home-cooked meals. 
                      I usually follow a ${values.dietType} diet. I ${values.exercise} get time to exercise or relax, and ${values.limitations}. 
                      I’m currently taking ${values.medications}, my periods are ${values.period}, and my sex life is ${values.sexLife}. 
                      I usually rely on ${values.supportSystem} for emotional support. What I really want is to ${values.goals}.`;

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
    <>
      {(isSwitch(SWITCH_KEYS.PERSONALIZE) && healthHistory) ||
      isSwitch(SWITCH_KEYS.CASE) ? (
        <Card className="flex flex-col w-full overflow-auto border-none h-fit rounded-2xl">
          <CardHeader className="relative flex flex-col items-center gap-4">
            <div className="p-2.5 bg-[#1C63DB] w-fit rounded-lg">
              <Tolu />
            </div>
            <CardTitle>{chatTitle || `${user?.name} AI assistant`}</CardTitle>
            <button
              className="absolute top-4 left-4"
              onClick={handleExpandClick}
              title="Expand chat"
            >
              <Expand className="w-6 h-6 text-[#5F5F65]" />
            </button>
          </CardHeader>
          <div className="border-t border-[#DDEBF6] w-full mb-[24px]" />
          <CardContent className="w-full px-6 pb-0">
            <div className="p-[24px] border border-[#008FF6] rounded-[20px] h-[calc(100vh-490.57px)] overflow-y-auto">
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
                {currentStep === 1 && <HealthHistoryForm form={form} />}
                {currentStep === 2 && <LifestyleForm form={form} />}
                {currentStep === 3 && <GoalsForm form={form} />}
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
              switchOptions={config.options}
              selectedSwitch={selectedSwitch}
              setSelectedSwitch={setSelectedSwitch}
            />
          </CardFooter>
        </Card>
      ) : (
        <Card className="flex flex-col w-full h-full border-none rounded-2xl">
          <CardHeader className="relative flex flex-col items-center gap-4">
            <div className="p-2.5 bg-[#1C63DB] w-fit rounded-lg">
              <Tolu />
            </div>
            <CardTitle>{chatTitle || `${user?.name} AI assistant`}</CardTitle>
            <button
              className="absolute top-4 left-4"
              onClick={handleExpandClick}
              title="Expand chat"
            >
              <Expand className="w-6 h-6 text-[#5F5F65]" />
            </button>
          </CardHeader>
          <CardContent className="flex flex-1 w-full h-full min-h-0 overflow-y-auto">
            <MessageList
              messages={messages}
              isSearching={isSearching}
              streamingText={streamingText}
              error={error}
            />
          </CardContent>
          <CardFooter className="w-full p-0">
            <LibraryChatInput
              className="w-full p-6 border-t rounded-t-none rounded-b-2xl"
              onSend={handleNewMessage}
              disabled={isSearching}
              switchOptions={config.options}
              selectedSwitch={selectedSwitch}
              setSelectedSwitch={setSelectedSwitch}
              healthHistory={healthHistory}
            />
          </CardFooter>
        </Card>
      )}
    </>
  );
};
