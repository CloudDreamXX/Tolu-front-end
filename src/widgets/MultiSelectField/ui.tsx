import { Avatar } from "@radix-ui/react-avatar";
import { useEffect, useRef, useState } from "react";
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
  onSave,
  className,
  height,
  labelClassName,
}: {
  label?: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (val: string[]) => void;
  onSave?: () => void;
  className?: string;
  height?: string;
  labelClassName?: string;
}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
  }>({
    top: 0,
    left: 0,
    width: 0,
  });

  const toggleOption = (option: string) => {
    onChange(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option]
    );
  };

  const removeOption = (option: string) => {
    onChange(selected.filter((item) => item !== option));
  };

  useEffect(() => {
    if (open && buttonRef.current && dropdownRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();

      const gap = 6;
      const viewportHeight = window.innerHeight;

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      const openUp = spaceBelow < dropdownRect.height && spaceAbove > spaceBelow;

      const top = openUp
        ? rect.top + window.scrollY - dropdownRect.height - gap
        : rect.bottom + window.scrollY + gap;

      setCoords({
        top,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  useEffect(() => {
    const handleScroll = () => {
      if (open && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setCoords({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        open &&
        !buttonRef.current?.contains(target) &&
        !dropdownRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative w-full">
      {label && (
        <label
          className={`block mb-[12px] text-[#000] ${labelClassName || "text-[16px] font-semibold"}`}
        >
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
            className={`absolute z-[9999] max-h-[400px] overflow-y-auto bg-[#F9FAFB] rounded-[18px] shadow-[0_4px_8px_rgba(0,0,0,0.25)] p-[12px] space-y-8 `}
            style={{
              top: coords.top,
              left: coords.left,
              width: coords.width,
              position: "absolute",
            }}
          >
            <ul className="space-y-2">
              {options.map((option) => (
                <li
                  key={option.label}
                  className={`cursor-pointer px-[12px] py-[8px] border rounded-[8px] text-[14px] text-[#1D1D1F] font-semibold bg-white flex items-center gap-[8px] ${selected.includes(option.label)
                    ? "border-[#1D1D1F]"
                    : "border-white hover:border-[#1D1D1F]"
                    }`}
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
                    <Avatar className="w-10 h-10">
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
              <div className="flex justify-between gap-3 pt-2">
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
