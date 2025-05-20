import { useState } from "react";
import InfoIcon from "shared/assets/icons/info-icon";
import Smile from "shared/assets/images/Smile.png";
import Angry from "shared/assets/images/Angry.png";
import Sad from "shared/assets/images/Sad.png";
import Happy from "shared/assets/images/Excellent.png";
import Neutral from "shared/assets/images/Neutrak.png";
import Smiley from "shared/assets/images/Smiley.png";
import { Slider } from "shared/ui/slider";

export const MoodScore = () => {
  const [rawValue, setRawValue] = useState(0); 
  const mood = Math.floor(rawValue / 10);      

  const getMoodText = (mood: number) =>
    ["Angry", "Sad", "Neutral", "Stable", "Happy", "Excellent"][mood] || "Unknown";

  const getMoodImage = (mood: number) =>
    [Angry, Sad, Neutral, Smile, Smiley, Happy][mood] || Angry;

  return (
    <div className="gap-4 p-6 flex flex-col items-start self-stretch bg-[#F3F7FD] rounded-2xl w-[492px]">
      <div className="flex gap-1 items-center self-stretch">
        <h3 className="font-[Nunito] text-[18px]/[24px] font-semibold text-[#1D1D1F]">
          Mood score
        </h3>
        <InfoIcon />
      </div>

      <div className="flex flex-col items-start gap-4 h-[80px] self-stretch">
        <div className="flex gap-2 items-center self-stretch">
          <img src={getMoodImage(mood)} alt="Mood" />
          <h2 className="text-[#1B2559] font-[Nunito] text-[14px]/[20px] font-medium">
            {getMoodText(mood)}
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
            "#FF1F0F", "#F6B448", "#F5D094",
            "#BCE2C8", "#80D19A", "#51C776"
          ]}
        />

        <div className="flex justify-between items-center w-full px-3">
          {[Angry, Sad, Neutral, Smile, Smiley, Happy].map((img, idx) => (
            <div key={idx} className="w-1/6 flex justify-center">
              <img src={img} alt={`Mood ${idx}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

