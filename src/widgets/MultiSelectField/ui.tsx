import { Avatar } from "@radix-ui/react-avatar";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import { AvatarFallback, AvatarImage, Button } from "shared/ui";

type MultiSelectOption = {
  avatar?: string;
  label: string;
};

export const MultiSelectField = ({
  label,
  options,
  selected,
  onChange,
  className,
  onSave,
  height,
}: {
  label?: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (val: string[]) => void;
  onSave?: () => void;
  className?: string;
  height?: string;
}) => {
  const [open, setOpen] = useState(false);
  // const [positionTop, setPositionTop] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const removeOption = (option: string) => {
    onChange(selected.filter((item) => item !== option));
  };

  // useEffect(() => {
  //   if (buttonRef.current && dropdownRef.current) {
  //     const { bottom } = buttonRef.current.getBoundingClientRect();
  //     const dropdownHeight = dropdownRef.current.offsetHeight;
  //     setPositionTop(bottom + dropdownHeight > window.innerHeight);
  //   }
  // }, [open]);

  return (
    <div className="relative w-full">
      {label && (
        <label className="block mb-[12px] text-[16px] text-[#000] font-semibold">
          {label}
        </label>
      )}
      <button
        className={cn(
          "w-full text-left border border-[#DBDEE1] rounded-[16px] md:rounded-[1000px] px-[12px] py-[8px] pr-[40px] text-[14px] text-[#1D1D1F] font-semibold bg-white relative flex flex-wrap gap-[8px] items-center min-h-[48px]",
          className
        )}
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        type="button"
      >
        {selected.length === 0 ? (
          <span className="text-[#1D1D1F]">Select</span>
        ) : (
          selected.map((option) => (
            <span
              key={option}
              className="flex items-center gap-[8px] bg-[#DBDEE1] rounded-[8px] px-[8px] py-[6px] text-[14px] font-semibold"
            >
              {option}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(option);
                }}
              >
                <MaterialIcon iconName="close" size={20} />
              </button>
            </span>
          ))
        )}
        <span className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2">
          <MaterialIcon iconName="keyboard_arrow_down" />
        </span>
      </button>
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            onClick={(e) => e.stopPropagation()}
            className={`z-[9999] max-h-[400px] overflow-y-auto bg-[#F9FAFB] rounded-[18px] shadow-[0_4px_8px_rgba(0,0,0,0.25)] p-[12px] space-y-8 ${height}`}
            style={{
              position: "fixed",
              top: buttonRef.current?.getBoundingClientRect().bottom ?? 0,
              left: buttonRef.current?.getBoundingClientRect().left ?? 0,
              width: buttonRef.current?.offsetWidth,
            }}
          >
            <ul>
              {options.map((option) => (
                <li
                  key={option.label}
                  className={`cursor-pointer px-[12px] py-[8px] border rounded-[8px] text-[14px] text-[#1D1D1F] font-semibold bg-white flex items-center gap-[8px] ${selected.includes(option.label) ? "border-[#1D1D1F]" : "border-white hover:border-[#1D1D1F]"}`}
                  onClick={() => toggleOption(option.label)}
                >
                  <MaterialIcon
                    iconName={
                      selected.includes(option.label)
                        ? "check_box"
                        : "check_box_outline_blank"
                    }
                    fill={selected.includes(option.label) ? 1 : 0}
                    size={20}
                  />
                  {option.avatar && (
                    <Avatar className="w-10 h-10 ">
                      <AvatarImage src={option.avatar} />
                      <AvatarFallback className="bg-slate-300">
                        {option.label?.slice(0, 2).toLocaleUpperCase() || "UN"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {option.label}
                </li>
              ))}
            </ul>
            {onSave && (
              <div className="flex justify-between w-full ">
                <Button
                  variant="blue2"
                  onClick={() => onChange([])}
                  className="w-[170px]"
                >
                  Clear All
                </Button>
                <Button
                  variant="blue"
                  onClick={() => {
                    setOpen(false);
                    onSave();
                  }}
                  className="w-[170px]"
                >
                  Save
                </Button>
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};
