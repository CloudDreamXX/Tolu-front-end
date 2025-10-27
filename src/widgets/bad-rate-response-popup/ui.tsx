import React, { useEffect, useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

const reasons = [
  "Information was incorrect",
  "Response was irrelevant",
  "Response was incomplete",
  "Response was unclear",
  "Content was inappropriate or offensive",
  "Other issue",
];

type Props = {
  contentId: string;
  handleRateClick: (
    id: string,
    rating: number,
    comment: string,
    down: boolean
  ) => Promise<void>;
  onClose: () => void;
};

export const BadRateResponse: React.FC<Props> = ({
  contentId,
  handleRateClick,
  onClose,
}) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey, { capture: true });
    return () =>
      document.removeEventListener("keydown", onKey, { capture: true });
  }, [onClose]);

  const handleBackdropMouseDown = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async () => {
    const details =
      selectedReason && comment
        ? `${selectedReason}, ${comment}`
        : selectedReason || comment || "";
    await handleRateClick(contentId, 0, details, true);

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        className="bg-[#F9FAFB] rounded-[18px] w-[742px] px-[24px] py-[24px] flex flex-col gap-[24px] relative mx-[16px] max-h-[95vh]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-[16px] right-[16px]"
          aria-label="Close modal"
          onClick={onClose}
        >
          <MaterialIcon iconName="close" />
        </button>

        <h3
          id="modal-title"
          className="text-[24px] font-semibold text-[#1D1D1F]"
        >
          What was wrong with this response?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[8px] overflow-y-auto">
          {reasons.map((reason) => (
            <button
              key={reason}
              onClick={() => setSelectedReason(reason)}
              className={`border rounded-[8px] px-[16px] py-[12px] text-left text-[14px] font-medium bg-white ${
                selectedReason === reason
                  ? "border-[#1C63DB] text-[#676767]"
                  : "border-[#E3E3E3] text-[#676767]"
              }`}
            >
              {reason}
            </button>
          ))}
        </div>

        <textarea
          className="w-full h-[100px] border border-[#DDE3E9] rounded-[8px] p-[12px] text-[14px] text-[#1D1D1F] placeholder:text-[#8F9094] resize-none focus:outline-none focus:border-[#1C63DB]"
          placeholder="Please provide additional details about your feedback (optional)…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex flex-col flex-col-reverse gap-[8px] md:flex-row md:justify-between mt-[24px] w-full">
          <button
            className="px-[16px] py-[11px] rounded-full bg-[#DDEBF6] text-[#1C63DB] text-[16px] font-[600] md:w-[128px]"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason}
            className="px-[16px] py-[11px] rounded-full text-[16px] font-[600] bg-[#1C63DB] text-white disabled:opacity-50 md:w-[180px]"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
};
