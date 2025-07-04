import { zodResolver } from "@hookform/resolvers/zod";
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
import { HealthHistory, HealthHistoryService } from "entities/health-history";
import { mapFormToPostData, mapHealthHistoryToFormDefaults } from "./lib";
import { SymptomsForm } from "./components/symptoms-form";

const steps = [
  "Symptoms",
  "Your Health History",
  "Your Lifestyle",
  "Your Goals",
];

export const baseSchema = z.object({
  age: z.string(),
  maritalStatus: z.string(),
  job: z.string(),
  children: z.string(),
  menopauseStatus: z.string(),
  mainSymptoms: z.string(),
  otherChallenges: z.string(),
  strategiesTried: z.string(),
  diagnosedConditions: z.string(),
  geneticTraits: z.string(),
  maternalSide: z.string(),
  paternalSide: z.string(),
  notableConcern: z.string(),
  stressLevel: z.string(),
  takeout: z.string(),
  homeCooked: z.string(),
  dietType: z.string(),
  exercise: z.string(),
  limitations: z.string(),
  medications: z.string(),
  period: z.string(),
  sexLife: z.string(),
  supportSystem: z.string(),
  goals: z.string(),
});

type Props = {
  healthHistory?: HealthHistory;
};

export const LibrarySmallChat: React.FC<Props> = ({ healthHistory }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [streamingText, setStreamingText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [chatTitle, setChatTitle] = useState<string>("");
  const [personalize, setPersonalize] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isContentMode, setIsContentMode] = useState(false);
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
      navigate(`/library/${currentChatId}`);
    } else {
      const newChatId = `new_chat_${Date.now()}`;
      navigate(`/library/${newChatId}`);
    }
  };

  const togglePersonalize = () => {
    setPersonalize(!personalize);
  };

  const handleNewMessage = async (
    message: string,
    files: File[]
  ): Promise<string | undefined> => {
    if ((!message.trim() && files.length === 0) || isSearching) return;

    if (personalize) {
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
            personalize: personalize,
          }),
          ...(image && { image }),
          ...(pdf && { pdf }),
        },
        async (chunk: StreamChunk) => {
          if (isContentMode && chunk.content) {
            if (chunk.content.includes("Relevant Content")) {
              str = chunk.content;
            } else {
              accumulatedText += chunk.content + " ";
              setStreamingText(accumulatedText);
            }
          }
          if (chunk.reply) {
            accumulatedText += chunk.reply + " ";
            setStreamingText(accumulatedText);
          }
        },
        async (finalData) => {
          setIsSearching(false);

          const aiMessage: Message = {
            id: finalData.chat_id || Date.now().toString(),
            type: "ai",
            content: accumulatedText
              .replace(/^#{1,6}\s*/g, "")
              .replace(/^Conversational Response:?\s*/i, "")
              .trim(),
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
        isContentMode
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
      "stressLevel",
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
      const message = `Hi Tolu. I’m a ${values.age}-year-old ${values.maritalStatus} woman working ${values.job}, and I have ${values.children} children. I’m ${values.menopauseStatus} but lately I’ve been dealing with ${values.mainSymptoms}. I’ve also noticed ${values.otherChallenges}, and it feels like no matter ${values.strategiesTried}, things aren’t getting better. My health history includes ${values.diagnosedConditions}, and I have ${values.geneticTraits}. In my family, there’s a history of ${values.maternalSide} on my mom’s side and ${values.paternalSide} on my dad’s side. Someone in my family was recently diagnosed with ${values.notableConcern}, which has me thinking more about prevention. Right now, my lifestyle includes ${values.stressLevel}, eating about ${values.takeout} takeout and ${values.homeCooked} home-cooked meals. I usually follow a ${values.dietType} diet. I ${values.exercise} get time to exercise or relax, and ${values.limitations}. I’m currently taking ${values.medications}, my periods are ${values.period}, and my sex life is ${values.sexLife}. I usually rely on ${values.supportSystem} for emotional support. What I really want is to ${values.goals}.`;

      setPersonalize(false);
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
      {personalize && healthHistory ? (
        <Card className="flex flex-col w-full border-none h-fit rounded-2xl">
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
          <CardContent className="px-6 pb-0">
            <div className="p-[24px] border border-[#008FF6] rounded-[20px]">
              <p className="text-[24px] text-[#1D1D1F] font-[500]">
                Personal story
              </p>
              <Steps
                steps={steps}
                stepWidth={"w-[462px]"}
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
              personalize={personalize}
              disabled={isSearching}
              togglePersonalize={togglePersonalize}
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
              personalize={personalize}
              togglePersonalize={togglePersonalize}
              healthHistory={healthHistory}
              isContentMode={isContentMode}
              toggleIsContentMode={() => setIsContentMode((prev) => !prev)}
            />
          </CardFooter>
        </Card>
      )}
    </>
  );
};
