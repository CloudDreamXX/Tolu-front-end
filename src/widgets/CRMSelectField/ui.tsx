import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

export const SelectField = ({
  label,
  options,
  selected,
  onChange,
  className,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string;
  onChange: (val: string) => void;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
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
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  return (
    <div className={`relative w-full`}>
      <label className="block mb-[12px] text-[16px] text-[#000] font-semibold">
        {label}
      </label>
      <button
        ref={buttonRef}
        className={`w-full text-left border border-[#DBDEE1] rounded-[1000px] px-[12px] py-[12.5px] pr-[40px] text-[14px] text-[#1D1D1F] font-semibold bg-white relative ${className}`}
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
            className="absolute z-[9999] max-h-[400px] overflow-y-auto mt-[4px] w-full bg-[#F9FAFB] rounded-[18px] shadow-[0_4px_8px_rgba(0,0,0,0.25)] p-[12px] space-y-2"
            style={{
              top: coords.top,
              left: coords.left,
              width: coords.width,
              position: "absolute",
            }}
          >
            {options.map(({ value, label }) => (
              <li
                key={value}
                className="cursor-pointer px-[12px] py-[8px] border border-white hover:border-[#1D1D1F] rounded-[8px] text-[14px] text-[#1D1D1F] font-semibold bg-white"
                onClick={() => {
                  onChange(value);
                  setOpen(false);
                }}
              >
                {label}
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
};
