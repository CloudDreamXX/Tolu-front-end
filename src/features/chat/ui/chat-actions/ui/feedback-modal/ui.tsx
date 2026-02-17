import { useAddContentFeedbackMutation, Feedback } from "entities/content";
import { RootState } from "entities/store";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib/utils";
import { Button, Input, RadioGroup, RadioGroupItem } from "shared/ui";

interface FeedbackModalProps {
  initialRating: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  setNewRating: React.Dispatch<React.SetStateAction<number | undefined>>;
  currentChatId?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  initialRating,
  isOpen,
  onOpenChange,
  setNewRating,
  currentChatId,
}) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [feedback, setFeedback] = useState<string>("");
  const [contentPreference, setContentPreference] = useState<string>("");
  const { documentId } = useParams();
  const chat = useSelector((state: RootState) => state.client.chat);
  const chatId = chat.length > 0 ? chat[0].id : null;
  const [addContentFeedback] = useAddContentFeedbackMutation();

  const handleSave = async () => {
    if (currentChatId || documentId || chatId) {
      const feedbackRequest: Feedback = {
        source_id: currentChatId || documentId || chatId || "",
        satisfaction_score: String(rating),
        comments: feedback,
        content_preference: contentPreference,
        location: "",
        feedback_type: "",
        membership_type: "",
        severity: "",
        device: "",
      };
      const res = await addContentFeedback(feedbackRequest).unwrap();
      setNewRating(res.data.satisfaction_score);
      setRating(res.data.satisfaction_score);
      onOpenChange(false);
    } else {
      setNewRating(rating);
    }

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
        className="relative bg-white rounded-[18px] w-full max-w-3xl p-[16px] xl:p-6 flex flex-col gap-6 max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Was this helpful for you?</h2>
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            onClick={() => onOpenChange(false)}
            className="absolute text-gray-500 top-4 right-4 hover:text-gray-900"
          >
            <MaterialIcon iconName="close" size={24} />
          </Button>
        </div>
        <div className="flex flex-col gap-6 overflow-y-auto">
          <p className="text-gray-600">
            Your input helps us improve our answers and better support your
            needs.
          </p>

          <div className="flex flex-col items-center gap-4 p-6 border rounded-lg">
            <span className="ml-2 text-2xl">{getRatingText()}</span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  variant={"unstyled"}
                  size={"unstyled"}
                  key={star}
                  onClick={() => setRating(star)}
                  className={`${star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                >
                  <MaterialIcon
                    iconName="star"
                    className="cursor-pointer w-14 h-14"
                  />
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Your comments <span className="text-gray-500">(Optional)</span>
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
              Would you like to see more answers like this?
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
                <RadioGroupItem
                  value="show me something new"
                  id="show me something new"
                />
                <label htmlFor="show me something new" className="font-medium">
                  Show me something new
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button
          variant={"brightblue"}
          onClick={handleSave}
          className="ml-auto w-fit min-w-32"
        >
          Save
        </Button>
      </div>
    </div>
  );
};
