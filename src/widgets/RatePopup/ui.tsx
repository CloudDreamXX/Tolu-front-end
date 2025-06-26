import React, { useRef, useState, useEffect } from "react";
import BlueStar from "shared/assets/icons/blue-star";
import Close from "shared/assets/icons/close";
import GreyStar from "shared/assets/icons/grey-star";

interface RatePopupProps {
  contentId: string;
  ratingsMap: Record<string, {
    rating: number;
    comment: string;
  }>
  handleRateClick: (
    id: string,
    rating: number,
    comment: string,
    down: boolean
  ) => Promise<void>;
  onClose: () => void;
}

export const RatePopup: React.FC<RatePopupProps> = ({
  contentId,
  ratingsMap,
  handleRateClick,
  onClose,
}) => {
  const data = ratingsMap[contentId] ?? { rating: 0, comment: "" };
  const [rating, setRating] = useState<number>(data.rating);
  const [comment, setComment] = useState<string>(data.comment);
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const popupRef = useRef<HTMLDivElement>(null);
  const ignoreClickRef = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ignoreClickRef.current) {
        ignoreClickRef.current = false;
        return;
      }

      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm md:static"
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={popupRef}
        onMouseDown={() => (ignoreClickRef.current = true)}
        className={`
          relative flex flex-col bg-white shadow-md border border-[#C7D7F9] rounded-[20px] p-6 w-full mx-4 
          md:absolute z-[999] md:top-[-130px] md:left-[-50px] md:rounded-[8px] md:w-[239px] xl:w-[203px] md:p-4
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-[24px] right-[24px] text-[#5F5F65] md:hidden"
          aria-label="Close popup"
        >
          <Close />
        </button>
        <p className="text-[20px] md:text-[18px] xl:text-[16px] text-center text-[#1D1D1F] font-[500] mb-[16px] md:mb-[8px] leading-[140%]">
          Please rate the quality
        </p>

        <div className="flex justify-center gap-2 mb-[16px]">
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              onClick={() => setRating(val)}
              onMouseEnter={() => setHoveredRating(val)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-[#5F5F65] w-[24px] h-[24px]"
            >
              {val <= (hoveredRating || rating) ? <BlueStar /> : <GreyStar />}
            </button>
          ))}
        </div>

        {rating > 0 && (
          <div className="w-full">
            <textarea
              placeholder="Describe your issue here.."
              className="w-full h-[185px] md:h-[74px] text-[12px] text-[#1D1D1F] border border-[#5F5F65] rounded-[8px] p-[8px] outline-none focus:border-[#1C63DB]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button
              onClick={() => handleRateClick(contentId, rating, comment, false)}
              className="mt-[16px] w-full bg-[#1C63DB] text-white font-semibold text-[16px] py-[8px] rounded-full hover:bg-[#1556c1] transition-colors"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
