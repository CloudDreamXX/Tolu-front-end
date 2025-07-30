import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import BookMark from "shared/assets/icons/book-mark";
import BookMarkFilled from "shared/assets/icons/book-mark-filled";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "shared/ui";
import LightIcon from "shared/assets/icons/light";
import { useParams } from "react-router-dom";
import { DocumentsService } from "entities/document";

type Props = {
  onStatusChange?: (status: string) => void;
};

const SaveModal: React.FC<Props> = ({ onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { documentId } = useParams();
  const [status, setStatus] = useState<string>("saved_for_later");

  useEffect(() => {
    const fetchContent = async () => {
      if (documentId) {
        const response = await DocumentsService.getDocumentById(documentId);
        if (response) {
          setStatus(response.readStatus);
        }
      }
    };

    fetchContent();
  }, []);

  const handleSkip = () => {
    setIsOpen(false);
  };

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked);
  };

  const onDocumentStatusChange = async () => {
    const isSaved = status === "saved_for_later";
    const newStatus = isSaved ? "read" : "saved_for_later";

    setStatus(newStatus);

    if (onStatusChange) {
      onStatusChange(newStatus);
    }

    if (documentId) {
      const response = await DocumentsService.getDocumentById(documentId);
      if (response) {
        setStatus(response.readStatus);
      }
    }
  };

  return (
    <>
      <button
        className="bg-[#DDEBF6] rounded-full p-[8px] flex items-center justify-center cursor-pointer"
        onClick={
          documentId && onStatusChange
            ? onDocumentStatusChange
            : () => setIsOpen(true)
        }
      >
        {(documentId && onStatusChange && status === "saved_for_later") ||
        isBookmarked ? (
          <BookMarkFilled width={16} height={16} />
        ) : (
          <BookMark width={16} height={16} />
        )}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="hidden"></Button>
        </DialogTrigger>

        <DialogContent className="max-w-3xl gap-6 p-6 md:w-[calc(100%-32px)] lg:w-full">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Saved searches</h2>
            </div>

            <p className="text-gray-600">
              Your favorite searches, saved for quick access anytime.
            </p>
          </div>

          <div className="flex flex-row p-4 border rounded-lg items-center gap-[16px]">
            {isBookmarked ? (
              <TooltipProvider delayDuration={500} disableHoverableContent>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={handleBookmarkClick}>
                      <BookMarkFilled width={32} height={32} />
                    </button>
                  </TooltipTrigger>

                  <TooltipContent
                    side="top"
                    className="z-50 p-[16px] w-[309px]"
                  >
                    <div className="flex flex-col items-center gap-2 max-w-[240px]">
                      <h3 className="flex gap-2 text-[#1B2559] text-sm leading-[1.4]">
                        <span className="w-5 h-5 shrink-0">
                          <LightIcon className="text-[#1B2559] w-5 h-5" />
                        </span>
                        Click to remove this topic from saved searches
                      </h3>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <button onClick={handleBookmarkClick}>
                <BookMark width={32} height={32} />
              </button>
            )}

            <div className="flex flex-col gap-1">
              <span className="text-lg font-bold leading-none text-gray-800">
                Labs to track during menopause
              </span>
              <span className="text-xs text-gray-500">
                May 9, 2025 12:00 pm
              </span>
            </div>
            <Button
              className="ml-auto rounded-full bg-[#DDEBF6] hover:bg-[#CFE2F3] p-2"
              onClick={() => {}}
            >
              <ArrowRightIcon className="text-[#1C63DB]" size={24} />
            </Button>
          </div>

          <div className="flex justify-center">
            <Button
              variant="blue2"
              onClick={handleSkip}
              className="py-[11px] px-[39px] text-[#1C63DB]"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SaveModal;
