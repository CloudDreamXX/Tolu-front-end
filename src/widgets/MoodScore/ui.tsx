import { RootState } from "entities/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import InfoIcon from "shared/assets/icons/info-icon";
import Pencil from "shared/assets/icons/pencil";
import Angry from "shared/assets/images/Angry.svg";
import Happy from "shared/assets/images/Excellent.svg";
import Neutral from "shared/assets/images/Neutrak.svg";
import Sad from "shared/assets/images/Sad.svg";
import Smile from "shared/assets/images/Smile.svg";
import Smiley from "shared/assets/images/Smiley.svg";
import { MoodModal } from "./MoodModal";
import { MoodSelector } from "./MoodSelector";

export const moodMap = {
  Angry: Angry,
  Sad: Sad,
  Neutral: Neutral,
  Stable: Smile,
  Happy: Smiley,
  Excellent: Happy,
} as const;

export type MoodLabel = keyof typeof moodMap;
export const moodLabels: MoodLabel[] = Object.keys(moodMap) as MoodLabel[];

export const MoodScore: React.FC = () => {
  const lastMood = useSelector((state: RootState) => state.clientMood.lastMood);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [rawValue, setRawValue] = useState(0);

  const moodIndexFromRedux = lastMood
    ? moodLabels.findIndex((m) => m.toLowerCase() === lastMood.toLowerCase())
    : -1;

  const isLocked = moodIndexFromRedux !== -1;
  const moodIndex = isLocked ? moodIndexFromRedux : Math.floor(rawValue / 10);

  return (
    <>
      {!lastMood ? (
        <div className="relative gap-4 p-[16px] md:p-6 flex flex-col items-start self-stretch bg-[#F3F7FD] rounded-2xl w-full 3xl:w-[492px]">
          <div className="flex items-center self-stretch justify-between">
            <div className="flex items-center gap-1">
              <h3 className="font-[Nunito] text-[16px] md:text-[18px]/[24px] font-semibold text-[#1D1D1F]">
                Mood score
              </h3>
              <span className="w-[20px] h-[20px]">
                <InfoIcon />
              </span>
            </div>
            <button
              aria-label="Edit mood"
              onClick={() => setShowMoodModal(true)}
              className="rounded-full bg-[#DDEBF6] p-2 hover:bg-[#B9D5F3] transition"
            >
              <Pencil />
            </button>
          </div>

          <p className="text-[#1D1D1F] text-[14px]/[20px] font-semibold">
            No data entered
          </p>

          {/* Container for bars and emojis */}
          <div className="relative w-full h-12 px-3 mt-4">
            {/* Gray bars positioned absolutely on top */}
            <div
              className="absolute inset-0 flex items-center justify-between pointer-events-none"
              style={{ height: "32px" }}
            >
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-1/6 mx-[2px] bg-[#ECEFF4] rounded h-4 mb-14"
                />
              ))}
            </div>

            {/* Emojis below */}
            <div className="flex items-center justify-between h-12">
              {moodLabels.map((label) => (
                <div key={label} className="flex justify-center w-1/6">
                  <img
                    src={moodMap[label]}
                    alt={`Mood ${label}`}
                    className="h-5"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="gap-4 p-6 flex flex-col items-start self-stretch bg-[#F3F7FD] rounded-2xl w-[492px]">
          <div className="flex items-center self-stretch gap-1">
            <h3 className="font-[Nunito] text-[18px]/[24px] font-semibold text-[#1D1D1F]">
              Mood score
            </h3>
            <span className="w-[20px] h-[20px]">
              <InfoIcon />
            </span>
          </div>

          <div className="flex flex-col items-start gap-4 h-[80px] self-stretch">
            <div className="flex items-center self-stretch gap-2">
              <img
                src={moodMap[moodLabels[moodIndex]]}
                alt={moodLabels[moodIndex]}
              />
              <h2 className="text-[#1B2559] font-[Nunito] text-[14px]/[20px] font-medium">
                {moodLabels[moodIndex]}
              </h2>
              <span className="w-[20px] h-[20px]">
                <InfoIcon />
              </span>
            </div>
          </div>

          <MoodSelector
            value={rawValue}
            onChange={setRawValue}
            isLocked={isLocked}
          />
        </div>
      )}

      {/* Modal */}
      {showMoodModal && <MoodModal onClose={() => setShowMoodModal(false)} />}
    </>
  );
};
