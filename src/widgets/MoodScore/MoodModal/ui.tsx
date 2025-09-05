import { setLastLogIn, setLastMood } from "entities/store/clientMoodSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Input } from "shared/ui";
import { Slider } from "shared/ui/slider";
import { moodLabels, moodMap } from "../ui";

interface MoodModalProps {
  onClose: () => void;
}

export const MoodModal: React.FC<MoodModalProps> = ({ onClose }) => {
  const [rawValue, setRawValue] = useState(2.5);
  const dispatch = useDispatch();
  const moodLabel = moodLabels[Math.floor(rawValue / 10)];

  const handleSubmit = () => {
    dispatch(setLastMood(moodLabel));
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
        <MaterialIcon iconName="keyboard_arrow_left" />
      </span>
      <div className="bg-white absolute bottom-0 rounded-t-[16px] md:rounded-[16px] px-[16px] py-[24px] md:p-[24px] xl:p-8 w-full md:w-[742px] flex flex-col gap-8 md:relative shadow-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute text-gray-400 top-6 right-6 hover:text-gray-600"
          aria-label="Close modal"
        >
          <MaterialIcon iconName="close" />
        </button>

        <div className="flex flex-col items-center justify-center gap-6">
          {/* Header */}

          <div className="flex flex-col gap-2 text-left">
            <h2 className=" text-[#1D1D1F] text-[22px] leading-[28px] font-semibold">
              How are you feeling today?
            </h2>
            <p className=" text-[#5F5F65] text-[14px] leading-[20px] font-normal max-w-[600px]">
              Take a moment to check in with yourself. Your daily mood helps us
              personalize your experience and track what’s working for your
              well-being.
            </p>
          </div>

          {/* Mood slider section */}
          <div className="border-2 border-[#F3F7FD] rounded-2xl w-full max-w-[600px] p-6 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <img
                src={moodMap[moodLabel]}
                alt={moodLabel}
                className="w-8 h-8"
              />
              <h2 className="text-[#1C3C8D]  text-[18px] font-semibold">
                {moodLabel}
              </h2>
              <span className="w-[20px] h-[20px]">
                <MaterialIcon iconName="help" fill={1} size={20} />
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
              {moodLabels.map((label, idx) => (
                <div key={idx} className="flex justify-center w-1/6">
                  <img
                    src={moodMap[label]}
                    alt={`Mood ${label}`}
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
              className=" text-[#1D1D1F] font-semibold text-sm"
            >
              Anything you'd like to add?{" "}
              <span className="font-normal text-gray-400">(Optional)</span>
            </label>
            <Input
              id="mood-feedback"
              placeholder="Leave your short feedback (e.g. energy level, stress, triggers)"
              className="w-full p-3 rounded border border-gray-300 resize-none text-sm  placeholder:text-gray-400"
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
