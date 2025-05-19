import { useState } from "react";
import InfoIcon from "shared/assets/icons/info-icon";
import Smile from "shared/assets/images/Smile.png";
import Angry from "shared/assets/images/Angry.png";
import Sad from "shared/assets/images/Sad.png";
import Happy from "shared/assets/images/Excellent.png";
import Neutral from "shared/assets/images/Neutrak.png";
import Smiley from 'shared/assets/images/Smiley.png';
import { Slider } from "shared/ui/slider";

export const MoodScore = () => {
  const [mood, setMood] = useState(0);
  const getMoodText = (mood: number) => {
    switch (mood) {
      case 0:
        return "Angry";
      case 20:
        return "Sad";
      case 40:
        return "Neutral";
      case 60:
        return "Stable";
      case 80:
        return "Happy";
      case 100:
        return "Excellent";
      default:
        return "Unknown";
    }
  }
  const getMoodImage = (mood: number) => {
    switch (mood) {
      case 0:
        return Angry;
      case 20:
        return Sad;
      case 40:
        return Neutral;
      case 60:
        return Smile;
      case 80:
        return Smiley;
      case 100:
        return Happy;
      default:
        return Angry;
    }
  }
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
          <img src={getMoodImage(mood)} alt="Stable" />
          <h2 className="text-[#1B2559] font-[Nunito] text-[14px]/[20px] font-medium">{getMoodText(mood)}</h2>
          <InfoIcon />
        </div>
        <Slider step={20} onValueChange={([value]) => setMood(value)}/>
        <div className="flex gap-16 items-center self-stretch">
          <img src={Angry} alt="Angry" />
          <img src={Sad} alt="Sad" />
          <img src={Neutral} alt="Neutral" />
          <img src={Smile} alt="Smile" />
          <img src={Smiley} alt="Smiley" />
          <img src={Happy} alt="Happy" />
        </div>
      </div>
    </div>
  );
};
