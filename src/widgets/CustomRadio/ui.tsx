import RadioChecked from "shared/assets/icons/radio-checked";
import RadioUnchecked from "shared/assets/icons/radio-unchecked";

interface CustomRadioProps {
  label: string;
  name: string;
  value: string;
  selected: string;
  onChange: (value: string) => void;
}

export const CustomRadio: React.FC<CustomRadioProps> = ({
  label,
  name,
  value,
  selected,
  onChange,
}) => {
  const isChecked = selected === value;

  return (
    <div
      onClick={() => onChange(value)}
      className="flex items-center gap-[12px] cursor-pointer text-[#000] font-[500]"
    >
      <div className="w-[24px] h-[24px] flex items-center justify-center">
        {isChecked ? <RadioChecked /> : <RadioUnchecked />}
      </div>
      <label htmlFor={`${name}-${value}`} className="cursor-pointer">
        {label}
      </label>
    </div>
  );
};
