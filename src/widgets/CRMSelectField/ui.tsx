import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { TooltipWrapper } from "shared/ui/TooltipWrapper";

type Option = {
  value: string;
  label: string;
  tooltip?: string;
};

export const SelectField = ({
  label,
  options,
  selected,
  onChange,
  className,
  labelClassName,
  containerClassName,
}: {
  label: string;
  options: Option[];
  selected: string;
  onChange: (val: string) => void;
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
  }>({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    if (open && buttonRef.current && dropdownRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();

      const gap = 6;
      const viewportHeight = window.innerHeight;

      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      const openUp =
        spaceBelow < dropdownRect.height && spaceAbove > spaceBelow;

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
      <label
        className={`block mb-[12px] text-[#000] ${labelClassName || "text-[16px] font-semibold"}`}
      >
        {label}
      </label>

      <button
        ref={buttonRef}
        className={`w-full text-left border border-[#DBDEE1] rounded-[1000px] px-[12px] py-[12.5px] pr-[40px] text-[#1D1D1F] bg-white relative ${containerClassName || "text-[14px] font-semibold"}`}
        onClick={() => setOpen(!open)}
        type="button"
      >
        {selected || "Select"}
        <span className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2">
          <MaterialIcon iconName="keyboard_arrow_down" />
        </span>
      </button>

      {open &&
        createPortal(
          <ul
            ref={dropdownRef}
            className={`absolute z-[9999] max-h-[400px] overflow-y-auto mt-[4px] w-full bg-[#F9FAFB] rounded-[18px] shadow-[0_4px_8px_rgba(0,0,0,0.25)] p-[12px] space-y-2 ${
              className || ""
            }`}
            style={{
              top: coords.top,
              left: coords.left,
              width: coords.width,
              position: "absolute",
            }}
          >
            {options.map(({ value, label, tooltip }) => (
              <li
                key={value}
                className="cursor-pointer px-[12px] py-[8px] border border-white hover:border-[#1D1D1F] rounded-[8px] text-[14px] text-[#1D1D1F] font-semibold bg-white flex items-center justify-between gap-2"
                onClick={() => {
                  onChange(value);
                  setOpen(false);
                }}
              >
                <span>{label}</span>
                {tooltip && (
                  <TooltipWrapper content={tooltip}>
                    <MaterialIcon
                      iconName="help"
                      size={16}
                      fill={1}
                      className="text-[#1C63DB] opacity-80 hover:opacity-100 transition-opacity"
                    />
                  </TooltipWrapper>
                )}
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
};
