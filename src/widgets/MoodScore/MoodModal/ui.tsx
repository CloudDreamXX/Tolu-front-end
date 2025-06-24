import {
  lastMood,
  setLastLogIn,
  setLastMood,
} from "entities/store/clientMoodSlice";
import { X } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ArrowBack from "shared/assets/icons/arrowBack";
import InfoIcon from "shared/assets/icons/info-icon";
import Angry from "shared/assets/images/Angry.svg";
import Happy from "shared/assets/images/Excellent.svg";
import Neutral from "shared/assets/images/Neutrak.svg";
import Sad from "shared/assets/images/Sad.svg";
import Smile from "shared/assets/images/Smile.svg";
import Smiley from "shared/assets/images/Smiley.svg";
import { Input } from "shared/ui";
import { Slider } from "shared/ui/slider";

const moods: lastMood[] = [
  "Angry",
  "Sad",
  "Neutral",
  "Stable",
  "Happy",
  "Excellent",
];

const moodLabels = [
  "Angry",
  "Sad",
  "Neutral",
  "Balanced and steady",
  "Happy",
  "Excellent",
];

const moodImages = [Angry, Sad, Neutral, Smile, Smiley, Happy];

interface MoodModalProps {
  onClose: () => void;
}

export const MoodModal: React.FC<MoodModalProps> = ({ onClose }) => {
  const [rawValue, setRawValue] = useState(2.5);
  const dispatch = useDispatch();
  const moodIndex = Math.floor(rawValue);

  const handleSubmit = () => {
    dispatch(setLastMood(moods[moodIndex]));
    dispatch(setLastLogIn(new Date().toISOString()));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#F1F3F5] top-[70px] md:top-0 md:bg-black md:bg-opacity-40 flex items-center justify-center z-50">
      <span
        onClick={onClose}
        aria-label="Close modal"
        className="absolute z-10 top-[16px] left-[16px] md:hidden"
      >
        <ArrowBack />
      </span>
      <div className="bg-white absolute bottom-0 rounded-t-[16px] md:rounded-[16px] px-[16px] py-[24px] md:p-[24px] xl:p-8 w-full md:w-[742px] flex flex-col gap-8 md:relative shadow-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute text-gray-400 top-6 right-6 hover:text-gray-600"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center justify-center gap-6">
          {/* Header */}

          <div className="flex flex-col gap-2 text-left">
            <h2 className="font-[Nunito] text-[#1D1D1F] text-[22px] leading-[28px] font-semibold">
              How are you feeling today?
            </h2>
            <p className="font-[Nunito] text-[#5F5F65] text-[14px] leading-[20px] font-normal max-w-[600px]">
              Take a moment to check in with yourself. Your daily mood helps us
              personalize your experience and track what’s working for your
              well-being.
            </p>
          </div>

          {/* Mood slider section */}
          <div className="border-2 border-[#F3F7FD] rounded-2xl w-full max-w-[600px] p-6 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <img
                src={moodImages[moodIndex]}
                alt={moods[moodIndex]}
                className="w-8 h-8"
              />
              <h2 className="text-[#1C3C8D] font-[Nunito] text-[18px] font-semibold">
                {moodLabels[moodIndex]}
              </h2>
              <span className="w-[20px] h-[20px]">
                <InfoIcon />
              </span>
            </div>

            <Slider
              min={0.1}
              max={5.59}
              step={0.01}
              value={[rawValue]}
              onValueChange={([val]) => setRawValue(val)}
              onValueCommit={() => {
                const roundedValue = Math.ceil(rawValue) - 0.5;
                setRawValue(roundedValue);
              }}
              activeIndex={rawValue}
              colors={[
                "#FF1F0F",
                "#F6B448",
                "#F5D094",
                "#BCE2C8",
                "#80D19A",
                "#51C776",
              ]}
            />

            <div className="flex items-center justify-between w-full px-4">
              {moodImages.map((img, idx) => (
                <div key={idx} className="flex justify-center w-1/6">
                  <img
                    src={img}
                    alt={`Mood ${moods[idx]}`}
                    className="w-6 h-6"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Feedback textarea */}
          <div className="flex flex-col w-full max-w-[600px] gap-1">
            <label
              htmlFor="mood-feedback"
              className="font-[Nunito] text-[#1D1D1F] font-semibold text-sm"
            >
              Anything you'd like to add?{" "}
              <span className="font-normal text-gray-400">(Optional)</span>
            </label>
            <Input
              id="mood-feedback"
              placeholder="Leave your short feedback (e.g. energy level, stress, triggers)"
              className="w-full p-3 rounded border border-gray-300 resize-none text-sm font-[Nunito] placeholder:text-gray-400"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between w-full max-w-[600px]">
            <button
              onClick={onClose}
              className="px-4 py-2 font-semibold text-blue-500 rounded hover:underline"
            >
              Skip for today
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
