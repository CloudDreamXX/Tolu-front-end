import { Slider } from "shared/ui";
import { moodLabels, moodMap } from "..";

interface MoodSelectorProps {
  value: number;
  onChange: (value: number) => void;
  isLocked?: boolean;
  colors?: string[];
}

export const MoodSelector = ({
  value,
  onChange,
  isLocked,
  colors = ["#FF1F0F", "#F6B448", "#F5D094", "#BCE2C8", "#80D19A", "#51C776"],
}: MoodSelectorProps) => {
  const onValueChange = isLocked
    ? () => {}
    : ([val]: number[]) => {
        onChange(val);
      };

  return (
    <>
      <Slider
        min={0}
        max={50}
        step={10}
        value={[value]}
        onValueChange={onValueChange}
        colors={colors}
        className={isLocked ? "pointer-events-none" : ""}
      />

      <div className="flex items-center justify-between w-full px-3">
        {moodLabels.map((label) => (
          <div key={label} className="flex justify-center w-1/6">
            <img src={moodMap[label]} alt={`Mood ${label}`} />
          </div>
        ))}
      </div>
    </>
  );
};
