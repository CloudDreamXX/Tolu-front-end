import classNames from "classnames";
import { useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { IoChevronDown } from "react-icons/io5";

function Select({ text, options, onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(text);

    const handleSelect = (option) => {
        setSelected(option);
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block">
            <button
                className="flex items-center gap-2 bg-white text-p-md border px-4 py-3 rounded-full text-black focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <IoEyeOutline className="text-lg" />
                {selected}
                <IoChevronDown className={classNames(
                    "text-lg transition-transform duration-300",
                    isOpen ? "transform rotate-180" : ""
                )} />
            </button>
            {isOpen && (
                <ul className="absolute w-full mt-2 bg-white border rounded-lg">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Select;
