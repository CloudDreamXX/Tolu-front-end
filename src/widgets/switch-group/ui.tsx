import { cn } from "shared/lib";
import { Switch } from "shared/ui";

interface SwitchGroupProps {
  options: string[];
  activeOption: string;
  onChange: (value: string) => void;
  labelRenderer?: (option: string) => React.ReactNode;
  classname: string;
}

export const SwitchGroup: React.FC<SwitchGroupProps> = ({
  options,
  activeOption,
  onChange,
  labelRenderer,
  classname,
}) => {
  return (
    <div className={cn("flex gap-2", classname)}>
      {options.map((option) => (
        <div key={option} className="flex items-center gap-2">
          <Switch
            checked={activeOption === option}
            onCheckedChange={() => onChange(option)}
          />
          <span
            className={cn(
              "text-sm cursor-default ",
              activeOption === option ? "text-[#1C63DB]" : "text-gray-700"
            )}
          >
            {labelRenderer?.(option) ?? option}
          </span>
        </div>
      ))}
    </div>
  );
};
