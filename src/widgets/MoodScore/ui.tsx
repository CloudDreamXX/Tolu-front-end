import React, { useState } from "react";
import InfoIcon from "shared/assets/icons/info-icon";
import Pencil from "shared/assets/icons/pencil";
import Smile from "shared/assets/images/Smile.svg";
import Angry from "shared/assets/images/Angry.svg";
import Sad from "shared/assets/images/Sad.svg";
import Happy from "shared/assets/images/Excellent.svg";
import Neutral from "shared/assets/images/Neutrak.svg";
import Smiley from "shared/assets/images/Smiley.svg";
import { Slider } from "shared/ui/slider";
import { RootState } from "entities/store";
import { useSelector } from "react-redux";
import { MoodModal } from "./MoodModal";

const moodLabels = ["Angry", "Sad", "Neutral", "Stable", "Happy", "Excellent"];
const moodImages = [Angry, Sad, Neutral, Smile, Smiley, Happy];

export const MoodScore: React.FC = () => {
  const lastMood = useSelector((state: RootState) => state.clientMood.lastMood);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [rawValue, setRawValue] = useState(0);

  const moodIndexFromRedux = lastMood
    ? moodLabels.findIndex((m) => m.toLowerCase() === lastMood.toLowerCase())
    : -1;

  const isLocked = moodIndexFromRedux !== -1;
  const moodIndex = isLocked ? moodIndexFromRedux : Math.floor(rawValue / 10);

  const onValueChange = isLocked
    ? () => {}
    : ([val]: number[]) => {
        setRawValue(val);
      };

  return (
    <>
      {!lastMood ? (
        <div className="relative gap-4 p-6 flex flex-col items-start self-stretch bg-[#F3F7FD] rounded-2xl w-[492px]">
          <div className="flex items-center justify-between self-stretch">
            <div className="flex gap-1 items-center">
              <h3 className="font-[Nunito] text-[18px]/[24px] font-semibold text-[#1D1D1F]">
                Mood score
              </h3>
              <InfoIcon />
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
          <div className="relative w-full px-3 mt-4 h-12">
            {/* Gray bars positioned absolutely on top */}
            <div
              className="absolute inset-0 flex justify-between items-center pointer-events-none"
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
            <div className="flex justify-between items-center h-12">
              {moodImages.map((img, idx) => (
                <div key={idx} className="w-1/6 flex justify-center">
                  <img
                    src={img}
                    alt={`Mood ${moodLabels[idx]}`}
                    className="h-8"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="gap-4 p-6 flex flex-col items-start self-stretch bg-[#F3F7FD] rounded-2xl w-[492px]">
          <div className="flex gap-1 items-center self-stretch">
            <h3 className="font-[Nunito] text-[18px]/[24px] font-semibold text-[#1D1D1F]">
              Mood score
            </h3>
            <InfoIcon />
          </div>

          <div className="flex flex-col items-start gap-4 h-[80px] self-stretch">
            <div className="flex gap-2 items-center self-stretch">
              <img src={moodImages[moodIndex]} alt={moodLabels[moodIndex]} />
              <h2 className="text-[#1B2559] font-[Nunito] text-[14px]/[20px] font-medium">
                {moodLabels[moodIndex]}
              </h2>
              <InfoIcon />
            </div>

            <Slider
              min={0}
              max={59}
              step={1}
              value={[moodIndex * 10 + 5]}
              onValueChange={onValueChange}
              colors={[
                "#FF1F0F",
                "#F6B448",
                "#F5D094",
                "#BCE2C8",
                "#80D19A",
                "#51C776",
              ]}
              className={isLocked ? "pointer-events-none" : ""}
            />

            <div className="flex justify-between items-center w-full px-3">
              {moodImages.map((img, idx) => (
                <div key={idx} className="w-1/6 flex justify-center">
                  <img src={img} alt={`Mood ${idx}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showMoodModal && <MoodModal onClose={() => setShowMoodModal(false)} />}
    </>
  );
};
