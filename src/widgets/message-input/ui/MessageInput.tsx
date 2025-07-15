import { Send } from "lucide-react";
import React, { useState, useEffect } from "react";
import Attach from "shared/assets/icons/attach";
import { Button, Textarea } from "shared/ui";
import { PopoverAttach, PopoverClient } from "widgets/content-popovers";
import { useForm, useFormState, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  CaseSearchForm,
  FormValues,
} from "pages/content-manager/create/case-search";

interface MessageInputProps {
  message: string;
  isSendingMessage: boolean;
  folderId?: string;
  documentId?: string;
  onMessageChange: (message: string) => void;
  onSendMessage: (messageToSend: string) => Promise<void>;
  setFiles: (files: File[]) => void;
  setClientId: (clientId: string | null) => void;
}

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

export const MessageInput: React.FC<MessageInputProps> = ({
  message,
  isSendingMessage,
  folderId,
  documentId,
  onMessageChange,
  onSendMessage,
  setFiles,
  setClientId,
}) => {
  const [enabled, setEnabled] = useState(false);

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
      Her health history includes ${diagnosedConditions || "no known conditions"}, and she is currently taking ${medication || "no medication"}.
      Lifestyle factors such as ${lifestyleFactors || "unspecified"} may be contributing.
      Previous interventions have included ${previousInterventions || "none"}, with ${interventionOutcome || "no recorded outcome"}.
      The suspected root causes include ${suspectedRootCauses || "not specified"}.
      This case is being used to create a ${protocol} aimed at ${goal}.
    `;
  };

  const handleSendMessage = async () => {
    let finalMessage = message;

    if (enabled) {
      const isFormValid = await form.trigger();
      if (!isFormValid) return;

      finalMessage = generateStory();
      onMessageChange(finalMessage); // sync to parent
    }

    if (finalMessage.trim() === "" || !folderId) return;

    await onSendMessage(finalMessage);
  };

  return (
    <Textarea
      value={message}
      onChange={(e) => onMessageChange(e.target.value)}
      placeholder="Let's start with a subject or writing request..."
      disabled={isSendingMessage}
      containerClassName="w-full rounded-3xl overflow-hidden border border-[#008FF6] mt-auto mb-10"
      className="h-20 text-lg font-medium text-gray-900 resize-none placeholder:text-gray-500"
      footerClassName="rounded-b-[18px] border-[#008FF6] border-t-0"
      footer={
        <div className="flex flex-col gap-[8px] w-full">
          <div className="flex flex-row w-full gap-[10px]">
            <PopoverAttach
              setFiles={setFiles}
              disabled={!folderId}
              customTrigger={
                <button className="flex items-center justify-center w-[48px] h-[48px] rounded-full bg-[#F3F6FB]">
                  <Attach />
                </button>
              }
            />
            <PopoverClient setClientId={setClientId} documentId={documentId} />
            <div className="flex items-center gap-[32px] ml-auto">
              <div className="items-center hidden gap-2 md:flex">
                <button
                  type="button"
                  aria-pressed={enabled}
                  onClick={() => setEnabled(!enabled)}
                  className={`relative inline-flex items-center w-[57.6px] h-[32px] rounded-[80px] border-2 ${
                    enabled
                      ? "bg-[#1C63DB] border-[#1C63DB]"
                      : "bg-[#B0B0B5] border-[#B0B0B5]"
                  } transition-colors duration-300`}
                >
                  <span
                    className={`inline-block w-[28.8px] h-[28.8px] rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                      enabled ? "translate-x-[25px]" : "translate-x-0"
                    }`}
                  />
                </button>
                <span
                  className={`font-semibold text-[16px] ${enabled ? "text-[#1C63DB]" : "text-[#5F5F65]"}`}
                >
                  Case Search
                </span>
              </div>
              <Button
                variant="black"
                className="ml-auto w-12 h-12 p-[10px] rounded-full"
                onClick={handleSendMessage}
                disabled={
                  isSendingMessage ||
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
              onClick={() => setEnabled(!enabled)}
              className={`relative inline-flex items-center w-[57.6px] h-[32px] rounded-[80px] border-2 ${
                enabled
                  ? "bg-[#1C63DB] border-[#1C63DB]"
                  : "bg-[#B0B0B5] border-[#B0B0B5]"
              } transition-colors duration-300`}
            >
              <span
                className={`inline-block w-[28.8px] h-[28.8px] rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  enabled ? "translate-x-[25px]" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`font-semibold text-[16px] ${enabled ? "text-[#1C63DB]" : "text-[#5F5F65]"}`}
            >
              Case Search
            </span>
          </div>
        </div>
      }
    >
      {" "}
      {enabled && (
        <form onSubmit={(e) => e.preventDefault()}>
          <CaseSearchForm form={form} />
        </form>
      )}
    </Textarea>
  );
};
