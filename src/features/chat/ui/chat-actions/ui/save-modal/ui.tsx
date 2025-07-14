import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import BookMark from "shared/assets/icons/book-mark";
import BookMarkFilled from "shared/assets/icons/book-mark-filled"; // Assuming you have this icon
import { Button, Dialog, DialogContent, DialogTrigger } from "shared/ui";

const SaveModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false); // State to track if bookmarked

  const handleSkip = () => {
    setIsOpen(false);
  };

  const handleBookmarkClick = () => {
    setIsBookmarked(!isBookmarked); // Toggle the bookmark state
  };

  return (
    <>
      <button
        className="bg-[#DDEBF6] rounded-full p-[8px] flex items-center justify-center cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        {isBookmarked ? (
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
            <button onClick={handleBookmarkClick}>
              {isBookmarked ? (
                <BookMarkFilled width={32} height={32} />
              ) : (
                <BookMark width={32} height={32} />
              )}
            </button>
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
