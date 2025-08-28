import React, { useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Popover, PopoverContent, PopoverTrigger } from "shared/ui";

interface RatePopupProps {
  contentId: string;
  ratingsMap: Record<
    string,
    {
      rating: number;
      comment: string;
    }
  >;
  handleRateClick: (
    id: string,
    rating: number,
    comment: string,
    down: boolean
  ) => Promise<void>;
}

export const RatePopup: React.FC<RatePopupProps> = ({
  contentId,
  ratingsMap,
  handleRateClick,
}) => {
  const data = ratingsMap[contentId] ?? { rating: 0, comment: "" };
  const [rating, setRating] = useState<number>(data.rating);
  const [comment, setComment] = useState<string>(data.comment);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    await handleRateClick(contentId, rating, comment, false);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-8 h-8 md:p-[8px] rounded-full bg-[#DDEBF6] flex items-center justify-center">
          <MaterialIcon
            iconName={!ratingsMap[contentId] ? "star" : "star_half"}
            className="text-blue-500"
          />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[425px] md:w-[239px] xl:w-[203px] p-4 shadow-[2px_2px_10px_0px_rgba(0,0,0,0.15)]">
        <div className="mb-4 text-center">
          <h3 className="text-[20px] md:text-[18px] xl:text-[16px] text-[#1D1D1F] font-[500] leading-[140%]">
            Please rate the quality
          </h3>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => setRating(val)}
                onMouseEnter={() => setHoveredRating(val)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-[#5F5F65] w-[24px] h-[24px] focus:outline-none"
              >
                <MaterialIcon
                  iconName="star"
                  className={
                    val <= (hoveredRating || rating)
                      ? "text-blue-500"
                      : "text-gray-400"
                  }
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <div className="w-full space-y-4">
              <textarea
                placeholder="Describe your issue here.."
                className="w-full h-[185px] md:h-[74px] text-[12px] text-[#1D1D1F] border border-[#5F5F65] rounded-[8px] p-[8px] outline-none focus:border-[#1C63DB] resize-none"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button
                onClick={handleSubmit}
                className="w-full bg-[#1C63DB] text-white font-semibold text-[16px] py-[4px] rounded-full hover:bg-[#1556c1] transition-colors"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RatePopup;
