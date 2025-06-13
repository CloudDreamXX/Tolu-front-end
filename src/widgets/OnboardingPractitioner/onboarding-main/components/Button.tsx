import UnselectIcon from "shared/assets/icons/unselect-blue";

interface ButtonProps {
  children: React.ReactNode;
  selected: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  selected,
  disabled,
  onClick,
}) => {
  const baseClasses =
    "flex py-2 px-4 items-center justify-center gap-[6px] rounded-full border border-[#BFBFBF] font-[Nunito] text-[16px] leading-[20px] font-semibold";

  const selectedClasses = selected
    ? "bg-[rgba(0,143,246,0.10)] text-[#1C63DB] border-[transparent]"
    : "bg-transparent text-[#2D2D2D]";

  const disabledClasses = disabled ? "opacity-[0.4]" : "";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${selectedClasses} ${disabledClasses}`}
      disabled={disabled}
    >
      {children}
      {selected && <UnselectIcon />}
    </button>
  );
};
