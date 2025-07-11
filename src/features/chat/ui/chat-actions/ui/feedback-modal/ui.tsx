import { StarIcon } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import { Button, Input, RadioGroup, RadioGroupItem } from "shared/ui";
import { X } from "lucide-react";
import { cn } from "shared/lib/utils";

interface FeedbackModalProps {
  initialRating: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  initialRating,
  isOpen,
  onOpenChange,
}) => {
  const [rating, setRating] = useState(initialRating);
  const [feedback, setFeedback] = useState("");
  const [contentPreference, setContentPreference] = useState("");

  const handleSave = () => {
    onOpenChange(false);
  };

  const handleSkip = () => {
    onOpenChange(false);
  };

  const getRatingText = () => {
    switch (rating) {
      case 1:
        return "😔 Not Helpful";
      case 2:
        return "😕 Somewhat Helpful";
      case 3:
        return "😐 Neutral";
      case 4:
        return "🙂 Helpful";
      case 5:
        return "😊 Very Helpful";
      default:
        return "Very Helpful";
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-[16px]",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative bg-white rounded-[18px] w-full max-w-3xl p-[16px] xl:p-6 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Was this helpful for you?</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-600">
          Your input helps us improve our content and better support your needs.
        </p>

        <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
          <span className="ml-2 text-2xl">{getRatingText()}</span>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                <StarIcon weight="fill" className="cursor-pointer w-14 h-14" />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">
            What did you like or not like?{" "}
            <span className="text-gray-500">(Optional)</span>
          </label>
          <Input
            placeholder="Leave your short feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="text-base"
          />
        </div>

        <div className="mb-6">
          <p className="mb-3 font-medium">
            Would you like to see more content like this?
          </p>
          <RadioGroup
            value={contentPreference}
            onValueChange={setContentPreference}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <label htmlFor="yes" className="font-medium">
                Yes
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <label htmlFor="no" className="font-medium">
                No
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <label htmlFor="new" className="font-medium">
                Show me something new
              </label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between gap-3">
          <Button
            variant="blue2"
            onClick={handleSkip}
            className="w-fit text-[#1C63DB]"
          >
            Skip Feedback
          </Button>
          <Button
            variant={"brightblue"}
            onClick={handleSave}
            className="w-fit min-w-32"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
