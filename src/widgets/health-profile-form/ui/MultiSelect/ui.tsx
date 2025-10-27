import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib/utils";

type Group = { title: string; options: string[] };
type OptionsInput = Array<string | Group>;

const isGroup = (item: string | Group): item is Group =>
  typeof item !== "string" && Array.isArray(item.options);

const getScrollParent = (node: HTMLElement | null): HTMLElement => {
  if (!node) return document.body;
  let parent = node.parentElement;
  while (parent) {
    const style = getComputedStyle(parent);
    const overflowY = style.overflowY;
    if (overflowY === "auto" || overflowY === "scroll") return parent;
    parent = parent.parentElement;
  }
  return document.body;
};

export const MultiSelect = ({
  placeholder,
  options,
  selected,
  defaultValue,
  className,
  dropdownPosition = "bottom",
  onChange,
}: {
  placeholder: string;
  options: OptionsInput;
  selected: string[];
  defaultValue?: string;
  className?: string;
  dropdownPosition?: "top" | "bottom";
  onChange: (val: string[]) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [dropdownBox, setDropdownBox] = useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
  }>({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 300,
  });

  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (defaultValue && selected.length === 0) {
      onChange([defaultValue]);
    }
  }, [defaultValue, selected, onChange]);

  const measureAndPlace = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const container = getScrollParent(containerRef.current);
    const containerRect = container.getBoundingClientRect();

    const gap = 6;
    const spaceBelow = containerRect.bottom - rect.bottom - gap;
    const spaceAbove = rect.top - containerRect.top - gap;

    const openUp =
      dropdownPosition === "top" ||
      (dropdownPosition === "bottom" &&
        spaceBelow < 200 &&
        spaceAbove > spaceBelow);

    const maxHeight = Math.min(380, openUp ? spaceAbove : spaceBelow);

    setDropdownBox({
      top: openUp
        ? rect.top - containerRect.top - gap - maxHeight
        : rect.bottom - containerRect.top + gap,
      left: rect.left - containerRect.left,
      width: rect.width,
      maxHeight: Math.max(160, maxHeight),
    });

    setPortalTarget(container);
  };


  useEffect(() => {
    if (!open) return;
    measureAndPlace();

    const handleChange = () => measureAndPlace();
    window.addEventListener("resize", handleChange, { passive: true });

    const scrollParent = getScrollParent(containerRef.current);
    scrollParent.addEventListener("scroll", handleChange, { passive: true });

    return () => {
      window.removeEventListener("resize", handleChange);
      scrollParent.removeEventListener("scroll", handleChange);
    };
  }, [open, dropdownPosition]);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const renderOption = (option: string) => (
    <li key={option}>
      <button
        type="button"
        className={cn(
          "rounded-sm py-1.5 pl-3 pr-2 cursor-pointer flex items-center gap-[8px] font-[500] text-sm hover:bg-[#F2F2F2] w-full text-left transition-colors"
        )}
        onClick={(e) => {
          e.stopPropagation();
          toggleOption(option);
        }}
      >
        <span className="relative flex h-3.5 w-3.5 items-center justify-center">
          <MaterialIcon iconName="check_box_outline_blank" />
          {selected.includes(option) && (
            <MaterialIcon
              iconName="check"
              className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            />
          )}
        </span>
        {option}
      </button>
    </li>
  );

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        className="w-full text-left border border-[#DBDEE1] rounded-md px-3 py-2 pr-10 min-h-[44px] text-sm font-[500] text-[#1D1D1F] bg-white relative flex flex-wrap items-center outline-0"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected.length === 0 ? (
          <span className="text-[#5F5F65]">{placeholder}</span>
        ) : (
          selected.map((option, index) => (
            <span
              key={`${option}-${index}`}
              className="flex items-center gap-[8px] text-[14px] font-[500] text-[#1D1D1F]"
            >
              {index !== 0 && ", "} {option}
            </span>
          ))
        )}
        <span className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2">
          <MaterialIcon
            iconName="keyboard_arrow_down"
            className="text-[#1D1D1F] opacity-50"
          />
        </span>
      </button>

      {open &&
        portalTarget &&
        createPortal(
          <ul
            ref={dropdownRef}
            role="listbox"
            className={cn(
              "absolute z-[9999] bg-white border border-[#DBDEE1] rounded-md shadow-sm",
              "overflow-y-auto overscroll-contain"
            )}
            style={{
              top: dropdownBox.top,
              left: dropdownBox.left,
              width: dropdownBox.width,
              maxHeight: dropdownBox.maxHeight,
              WebkitOverflowScrolling: "touch",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {options.map((item, idx) =>
              isGroup(item) ? (
                <li key={`group-${idx}`} className="py-[6px]">
                  <div className="px-[17px] py-[6px] font-[700] text-sm text-[#1D1D1F] cursor-default pointer-events-none">
                    {item.title}
                  </div>
                  <ul>{item.options.map(renderOption)}</ul>
                </li>
              ) : (
                renderOption(item)
              )
            )}
          </ul>,
          portalTarget
        )}
    </div>
  );
};
