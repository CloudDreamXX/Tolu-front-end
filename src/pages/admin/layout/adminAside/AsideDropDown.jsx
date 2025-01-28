import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const AsideDropDown = ({ name, options, onCheckedChange }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown toggle state
    const [checkedValues, setCheckedValues] = useState([]); // Track selected checkbox values
    const [searchQuery, setSearchQuery] = useState(""); // State for search query

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleCheckboxChange = (value) => {
        const updatedValues = checkedValues.includes(value)
            ? checkedValues.filter((item) => item !== value) // Remove value if already checked
            : [...checkedValues, value]; // Add value if not checked

        setCheckedValues(updatedValues);
        onCheckedChange(updatedValues); // Pass updated values to the parent
    };

    const filteredOptions = options.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full">
            {/* Header Section */}
            <div className="w-full p-2 bg-white flex items-center justify-between">
                <span className="text-xs font-semibold">{name}</span>
                <IoIosArrowDown
                    onClick={toggleDropdown}
                    className={`transition-all duration-400 ${isDropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                />
            </div>

            {/* Dropdown Content */}
            {isDropdownOpen && (
                <div className="p-2 max-h-96 overflow-auto">
                    {/* Search Input */}
                    <input
                        className="w-full p-1 border rounded"
                        placeholder={`Search ${name}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="mt-2">
                        {filteredOptions.map((item, index) => (
                            <label
                                key={index}
                                className="flex items-center gap-2"
                                style={{ marginBottom: "0.5rem" }}
                            >
                                <input
                                    type="checkbox"
                                    value={item}
                                    checked={checkedValues.includes(item)}
                                    onChange={() => handleCheckboxChange(item)}
                                />
                                <span
                                    className="truncate"
                                    style={{
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "150px", // Adjust max width to control truncation
                                    }}
                                    title={item} // Show full text on hover
                                >
                                    {item}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AsideDropDown;
