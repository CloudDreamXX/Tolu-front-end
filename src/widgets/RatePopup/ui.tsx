import React, { useRef, useState, useEffect } from "react";
import BlueStar from "shared/assets/icons/blue-star";
import GreyStar from "shared/assets/icons/grey-star";

interface RatePopupProps {
  contentId: string;
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
  handleRateClick,
  onClose,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

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
      ref={popupRef}
      onMouseDown={() => (ignoreClickRef.current = true)}
      className="flex flex-col items-center bg-white p-4 shadow-md border border-[#C7D7F9] rounded-[8px] z-10 absolute top-[-100px] w-[197px]"
    >
      <p className="text-[16px] text-[#1D1D1F] font-[500] mb-[8px] leading-[140%]">
        Please rate the quality
      </p>

      <div className="flex gap-2 mb-[16px]">
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
            className="w-full h-[74px] text-[12px] text-[#1D1D1F] border border-[#5F5F65] rounded-[8px] p-[8px] outline-none focus:border-[#1C63DB]"
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
  );
};
