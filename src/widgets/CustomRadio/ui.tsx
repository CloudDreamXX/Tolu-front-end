import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

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
        <MaterialIcon
          iconName={
            isChecked ? "radio_button_checked" : "radio_button_unchecked"
          }
          className={isChecked ? "text-blue-500" : "text-gray-400"}
        />
      </div>
      <label htmlFor={`${name}-${value}`} className="cursor-pointer">
        {label}
      </label>
    </div>
  );
};
