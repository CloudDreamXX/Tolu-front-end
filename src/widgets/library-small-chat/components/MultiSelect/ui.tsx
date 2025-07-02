import { useEffect, useRef, useState } from "react";
import Chevron from "shared/assets/icons/chevron";
import CheckedIcon from "shared/assets/icons/checked";
import UncheckedIcon from "shared/assets/icons/not-checked";

export const MultiSelect = ({
    placeholder,
    options,
    selected,
    className,
    onChange,
}: {
    placeholder: string;
    options: string[];
    selected: string[];
    className?: string;
    onChange: (val: string[]) => void;
}) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter((item) => item !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                className={`w-full text-left border ${open ? "border-[#094AB8]" : "border-[#DBDEE1]"} rounded-[16px] md:rounded-[1000px] px-[12px] py-[4px] pr-[40px] text-[18px] font-[500] text-[#1D1D1F] bg-white relative flex flex-wrap gap-[8px] items-center`}
                onClick={() => setOpen(!open)}
                type="button"
            >
                {selected.length === 0 ? (
                    <span className="text-[#5F5F65]">{placeholder}</span>
                ) : (
                    selected.map((option, index) => (
                        <span
                            key={option}
                            className="flex items-center gap-[8px] text-[18px] font-[500] text-[#1D1D1F]"
                        >
                            {index !== 0 && ", "} {option}
                        </span>
                    ))
                )}
                <span className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2">
                    <Chevron />
                </span>
            </button>
            {open && (
                <ul className="absolute z-10 mt-[4px] w-full min-w-[302px] bg-white border border-[#DBDEE1] rounded-[12px] shadow-sm max-h-[220px] overflow-y-auto text-[16px]">
                    {options.map((option, index) => (
                        <li
                            key={option}
                            className={`px-[17px] py-[8px] cursor-pointer hover:text-[#1C63DB] flex items-center gap-[8px] font-[500] ${selected.includes(option) ? "text-[#008FF6]" : ""
                                } ${index < options.length - 1 ? "border-b border-[#C2C6D2]" : ""}`}
                            onClick={() => toggleOption(option)}
                        >
                            <span className="w-[20px] h-[20px] flex items-center justify-center">{selected.includes(option) ? <CheckedIcon /> : <UncheckedIcon />}</span>
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
