import React, { useState } from "react";
import {
  lastMood,
  setLastLogIn,
  setLastMood,
} from "entities/store/clientMoodSlice";
import { useDispatch } from "react-redux";
import InfoIcon from "shared/assets/icons/info-icon";
import Angry from "shared/assets/images/Angry.png";
import Sad from "shared/assets/images/Sad.png";
import Neutral from "shared/assets/images/Neutrak.png";
import Smile from "shared/assets/images/Smile.png";
import Smiley from "shared/assets/images/Smiley.png";
import Happy from "shared/assets/images/Excellent.png";
import { Slider } from "shared/ui/slider";
import { X } from "lucide-react";
import { Input } from "shared/ui";

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
  const [rawValue, setRawValue] = useState(30); // middle ~ Balanced and steady
  const dispatch = useDispatch();

  const moodIndex = Math.floor(rawValue / 10);

  const handleSubmit = () => {
    dispatch(setLastMood(moods[moodIndex]));
    dispatch(setLastLogIn(new Date().toISOString()));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-[16px] p-8 w-[742px] flex flex-col gap-8 relative shadow-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <div className="flex items-center justify-center flex-col gap-6">
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
            <InfoIcon />
          </div>

          <Slider
            min={0}
            max={59}
            step={1}
            value={[rawValue]}
            onValueChange={([val]) => setRawValue(val)}
            colors={[
                "#FF1F0F",
                "#F6B448",
                "#F5D094",
                "#BCE2C8",
                "#80D19A",
                "#51C776",
            ]}
            />

          <div className="flex justify-between items-center w-full px-4">
            {moodImages.map((img, idx) => (
                <div key={idx} className="w-1/6 flex justify-center">
                <img src={img} alt={`Mood ${moods[idx]}`} className="w-6 h-6" />
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
            className="text-blue-500 font-semibold py-2 px-4 rounded hover:underline"
            >
            Skip for today
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 font-semibold"
            >
            Submit
          </button>
        </div>
              </div>
      </div>
    </div>
  );
};
