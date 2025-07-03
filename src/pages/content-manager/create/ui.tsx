import { Send } from "lucide-react";
import { Textarea, Button } from "shared/ui";
import {
  PopoverClient,
  PopoverFolder,
  PopoverAttach,
  PopoverInstruction,
} from "widgets/content-popovers";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormState, useWatch } from "react-hook-form";
import { CaseSearchForm, FormValues } from "./case-search";

export const baseSchema = z.object({
  age: z
    .string()
    .min(1, "Age is required")
    .regex(/^\d+$/, "Age must be a number"),
  employmentStatus: z.string().min(1, "Employment status is required"),
  menopausePhase: z.string().min(1, "Menopause phase is required"),
  symptoms: z.string().min(1, "Symptoms are required"),
  diagnosedConditions: z.string().optional(),
  medication: z.string().optional(),
  lifestyleFactors: z.string().optional(),
  previousInterventions: z.string().optional(),
  interventionOutcome: z.string().optional(),
  suspectedRootCauses: z.string().optional(),
  protocol: z.string().min(1, "Protocol is required"),
  goal: z.string().min(1, "Goal is required"),
});

export const ContentManagerCreatePage: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [folderId, setFolderId] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [instruction, setInstruction] = useState<string>("");
  const [clientId, setClientId] = useState<string | null>(null);
  const nav = useNavigate();
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [existingInstruction, setExistingInstruction] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(baseSchema),
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

  const watchedValues = useWatch({ control: form.control });
  const { isValid } = useFormState({ control: form.control });

  useEffect(() => {
    if (enabled) {
      form.trigger();
    }
  }, [enabled, form]);

  const generateStory = () => {
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
    } = watchedValues;

    return `
      This case involves a ${age}-year-old ${employmentStatus} woman in the ${menopausePhase} phase, presenting with ${symptoms}.
      Her health history includes ${diagnosedConditions}, and she is currently taking ${medication}.
      Lifestyle factors such as ${lifestyleFactors} may be contributing.
      Previous interventions have included ${previousInterventions}, with ${interventionOutcome}.
      The suspected root causes include ${suspectedRootCauses}.
      This case is being used to create a ${protocol} aimed at ${goal}.
    `;
  };

  const updateMessage = () => {
    const story = generateStory();
    setMessage(story);
  };

  const handleSendMessage = async () => {
    if (enabled) {
      updateMessage();
    }

    if (message.trim() === "" || !folderId) return;

    setIsSending(true);

    const tempDocumentId = `temp_${Date.now()}`;

    nav(
      `/content-manager/library/folder/${folderId}/document/${tempDocumentId}`,
      {
        state: {
          isNewDocument: true,
          chatMessage: {
            user_prompt: message,
            is_new: true,
            regenerate_id: null,
            chat_title: title,
          },
          folderId,
          files,
          instruction,
          clientId,
          originalMessage: message,
          originalTitle: title,
        },
      }
    );
  };

  return (
    <div
      className={`flex flex-col gap-[48px] md:gap-[24px] px-[16px] py-[24px] md:px-[24px] md:py-[48px] xl:px-[48px] ${enabled ? "xl:py-0" : "xl:py-[150px]"} mt-auto md:mb-auto xl:mt-0`}
    >
      <h1 className="text-[24px] md:text-[40px] xl:text-[36px] font-semibold text-center">
        Hi, how can I help you?
      </h1>
      <div className="flex flex-col-reverse md:flex-col gap-[8px] md:gap-[16px] xl:gap-[24px] xl:w-[1070px] m-auto">
        <Textarea
          isTitleVisible={true}
          titleValue={title}
          onTitleChange={(e) => setTitle(e.target.value)}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Let's start with a subject or writing request..."
          containerClassName="border-[#008FF6]"
          className="h-20 text-[14px] md:text-lg font-medium resize-none placeholder:text-[#1D1D1F80] text-[#1D1D1F]"
          footer={
            <div className="flex flex-col gap-[8px] w-full">
              <div className="flex flex-row w-full gap-[10px]">
                <PopoverClient setClientId={setClientId} />
                <PopoverFolder
                  setFolderId={setFolderId}
                  setExistingFiles={setExistingFiles}
                  setExistingInstruction={setExistingInstruction}
                />
                <div className="flex items-center gap-[32px] ml-auto">
                  <div className="items-center hidden gap-2 md:flex">
                    <button
                      type="button"
                      aria-pressed={enabled}
                      onClick={() => {
                        setEnabled(!enabled);
                        setTitle("Hormonal Health Case Template");
                      }}
                      className={`relative inline-flex items-center w-[57.6px] h-[32px] rounded-[80px] border-2 ${enabled ? "bg-[#1C63DB] border-[#1C63DB]" : "bg-[#B0B0B5] border-[#B0B0B5]"} transition-colors duration-300`}
                    >
                      <span
                        className={`inline-block w-[28.8px] h-[28.8px] rounded-full bg-white shadow-md ${enabled ? "translate-x-[25px]" : "translate-x-0"} transform transition-transform duration-300`}
                      />
                    </button>
                    <span
                      className={`${enabled ? "text-[#1C63DB]" : "text-[#5F5F65]"} font-semibold text-[16px]`}
                    >
                      Case Search
                    </span>
                  </div>
                  <Button
                    variant={"black"}
                    className="ml-auto w-12 h-12 p-[10px] rounded-full"
                    onClick={handleSendMessage}
                    disabled={
                      isSending ||
                      !folderId ||
                      (!enabled && !message.trim()) ||
                      (enabled && !isValid)
                    }
                  >
                    <Send color="#fff" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 md:hidden">
                <button
                  type="button"
                  aria-pressed={enabled}
                  onClick={() => {
                    setEnabled(!enabled);
                    setTitle("Hormonal Health Case Template");
                  }}
                  className={`relative inline-flex items-center w-[57.6px] h-[32px] rounded-[80px] border-2 ${enabled ? "bg-[#1C63DB] border-[#1C63DB]" : "bg-[#B0B0B5] border-[#B0B0B5]"} transition-colors duration-300`}
                >
                  <span
                    className={`inline-block w-[28.8px] h-[28.8px] rounded-full bg-white shadow-md ${enabled ? "translate-x-[25px]" : "translate-x-0"} transform transition-transform duration-300`}
                  />
                </button>
                <span
                  className={`${enabled ? "text-[#1C63DB]" : "text-[#5F5F65]"} font-semibold text-[16px]`}
                >
                  Case Search
                </span>
              </div>
            </div>
          }
          footerClassName="rounded-b-[18px] border-[#008FF6] border-t-0"
        >
          {enabled && (
            <form onSubmit={(e) => e.preventDefault()}>
              <CaseSearchForm form={form} />
            </form>
          )}
        </Textarea>
        <div className="flex flex-col md:flex-row gap-[8px] md:gap-[16px] xl:gap-[24px]">
          <PopoverAttach
            setFiles={setFiles}
            existingFiles={existingFiles}
            disabled={!folderId}
          />
          <PopoverInstruction
            setInstruction={setInstruction}
            disabled={!folderId}
            existingInstruction={existingInstruction}
          />
        </div>
      </div>
    </div>
  );
};
