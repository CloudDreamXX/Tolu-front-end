import { ISessionResult } from "entities/coach";
import { useDocumentState } from "features/document-management";
import React, { useEffect, useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "shared/ui";

interface ConversationItemActionsProps {
  pair: ISessionResult;
  ratingsMap: Record<string, { rating: number; comment: string }>;
  index: number;
  compareIndex: number | null;
  onCompareToggle: (index: number) => void;
  onEditToggle: (pair: ISessionResult, document: any) => void;
  setSelectedDocumentId: (id: string) => void;
  setIsBadResponseOpen: (open: boolean) => void;
  setIsDeleteOpen: (open: boolean) => void;
  setIsMoveOpen: (open: boolean) => void;
  setIsMarkAsOpen: (open: boolean) => void;
  handleDublicateClick: (id: string) => Promise<void>;
  handleMarkAsClick: () => void;
  handleDelete: (id: string) => void;
  onMarkAsFinalHandler: (contentId?: string | undefined) => Promise<void>;
  setStatusPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ConversationItemActions: React.FC<
  ConversationItemActionsProps
> = ({
  pair,
  handleMarkAsClick,
  onEditToggle,
  setSelectedDocumentId,
  setIsBadResponseOpen,
  setIsMoveOpen,
  handleDublicateClick,
  setIsDeleteOpen,
  onMarkAsFinalHandler,
  setStatusPopup,
}) => {
    const { document } = useDocumentState();
    const [textContent, setTextContent] = useState("");
    const [selectedVoice, setSelectedVoice] =
      useState<SpeechSynthesisVoice | null>(null);
    const [isReadingAloud, setIsReadingAloud] = useState<boolean>(false);

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
      if (document) {
        const strippedText = document.content.replace(/<\/?[^>]+(>|$)/g, "");
        setTextContent(strippedText);
      }
    }, [document]);

    useEffect(() => {
      return () => {
        if (speechSynthesis.speaking) {
          speechSynthesis.cancel();
          setIsReadingAloud(false);
        }
      };
    }, [document]);

    const handleReadAloud = () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        setIsReadingAloud(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(textContent);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.onend = () => {
          setIsReadingAloud(false);
        };

        speechSynthesis.speak(utterance);
        setIsReadingAloud(true);
      }
    };

    return (
      <div className="flex items-start gap-2 md:flex-col">
        <div className="flex items-center gap-2 md:flex-col">
          <TooltipProvider delayDuration={500}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
                  onClick={() => onEditToggle(pair, null)}
                >
                  <MaterialIcon iconName="edit" size={20} fill={1} />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="z-50 py-[4px] px-[16px] w-fit text-[16px] font-semibold text-[#1D1D1F] ml-0"
              >
                Edit
              </TooltipContent>
            </Tooltip>

            {document?.status !== "Rejected" && <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
                  onClick={() => {
                    setSelectedDocumentId(pair.id);
                    setIsMoveOpen(true);
                  }}
                >
                  <MaterialIcon iconName="arrow_right_alt" size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="z-50 py-[4px] px-[16px] w-fit text-[16px] font-semibold text-[#1D1D1F] ml-0"
              >
                Move
              </TooltipContent>
            </Tooltip>}

            {document?.status !== "Rejected" && <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
                  onClick={() => handleDublicateClick(pair.id)}
                >
                  <MaterialIcon iconName="stack" size={20} fill={1} />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="z-50 py-[4px] px-[16px] w-fit text-[16px] font-semibold text-[#1D1D1F] ml-0"
              >
                Duplicate
              </TooltipContent>
            </Tooltip>}

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
                  onClick={handleReadAloud}
                >
                  <MaterialIcon
                    iconName="volume_up"
                    size={20}
                    fill={isReadingAloud ? 1 : 0}
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="z-50 py-[4px] px-[16px] w-fit text-[16px] font-semibold text-[#1D1D1F] ml-0"
              >
                Read aloud
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
                  onClick={() => {
                    setSelectedDocumentId(pair.id);
                    setIsBadResponseOpen(true);
                  }}
                >
                  {document?.thumbsDown ? (
                    <MaterialIcon iconName="thumb_up" size={20} fill={1} />
                  ) : (
                    <MaterialIcon iconName="thumb_down" size={20} fill={1} />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="z-50 py-[4px] px-[16px] w-fit text-[16px] font-semibold text-[#1D1D1F] ml-0"
              >
                Bad response
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    setSelectedDocumentId(pair.id);
                    setIsDeleteOpen(true);
                  }}
                  className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
                >
                  <MaterialIcon iconName="delete" size={20} fill={1} />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="z-50 py-[4px] px-[16px] w-fit text-[16px] font-semibold text-[#1D1D1F] ml-0"
              >
                Delete
              </TooltipContent>
            </Tooltip>

            {document?.status !== "Rejected" && <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => handleMarkAsClick()}
                  className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
                >
                  <MaterialIcon iconName="compare_arrows" size={20} />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="z-50 py-[4px] px-[16px] w-fit text-[16px] font-semibold text-[#1D1D1F] ml-0"
              >
                Mark as
              </TooltipContent>
            </Tooltip>}

            {document?.status === "Raw" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
                    onClick={() => onMarkAsFinalHandler(pair.id)}
                  >
                    <MaterialIcon iconName="check" size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="z-50 py-[4px] px-[16px] w-fit text-[16px] font-semibold text-[#1D1D1F] ml-0"
                >
                  Mark as final
                </TooltipContent>
              </Tooltip>
            )}

            {document?.status === "Rejected" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] text-blue-500 flex items-center justify-center"
                    onClick={() => setStatusPopup(true)}
                  >
                    <MaterialIcon iconName="check_circle_unread" size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="z-50 py-[4px] px-[16px] w-fit text-[16px] font-semibold text-[#1D1D1F] ml-0"
                >
                  Change status to "Waiting"
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      </div>
    );
  };
