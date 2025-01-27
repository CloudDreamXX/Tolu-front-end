import React, { useState } from "react";
import Dropdown from "../small/Dropdown"; // Assuming your Dropdown component is here
import Button from "../small/Button"; // Assuming your Button component is here


function SignUpModal2({ isOpen, onClose }) {
    if (!isOpen) return null;

    const dropdownOptions = [
        { option: "Option 1", value: "option1" },
        { option: "Option 2", value: "option2" },
        { option: "Option 3", value: "option3" },
    ];

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white w-full max-w-6xl p-6 rounded-2xl shadow-lg overflow-y-auto max-h-[90vh]">
                <h2 className="text-xl font-bold text-center mb-4">Complete Your Details</h2>

                {/* Section 1 */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Section 1</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Dropdown
                            label={"Dropdown 1"}
                            options={dropdownOptions}
                            defaultText="Select an option"
                            onSelect={(value) => console.log(value)}

                        />
                        <Dropdown
                            label={"Dropdown 2"}
                            options={dropdownOptions}
                            defaultText="Select an option"
                            onSelect={(value) => console.log(value)}

                        />
                        <Dropdown
                            label={"Dropdown 3"}
                            options={dropdownOptions}
                            defaultText="Select an option"
                            onSelect={(value) => console.log(value)}

                        />
                        <Dropdown
                            label={"Dropdown 4"}
                            options={dropdownOptions}
                            defaultText="Select an option"
                            onSelect={(value) => console.log(value)}

                        />
                        <Dropdown
                            label={"Dropdown 5"}
                            options={dropdownOptions}
                            defaultText="Select an option"
                            onSelect={(value) => console.log(value)}

                        />
                        <Dropdown
                            label={"Dropdown 6"}
                            options={dropdownOptions}
                            defaultText="Select an option"
                            onSelect={(value) => console.log(value)}

                        />
                        <Dropdown
                            label={"Dropdown 7"}
                            options={dropdownOptions}
                            defaultText="Select an option"
                            onSelect={(value) => console.log(value)}

                        />
                    </div>
                </div>

                {/* Section 2 */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Section 2</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Dropdown
                            label={"Dropdown 1"}
                            options={dropdownOptions}
                            defaultText="Select an option"
                            onSelect={(value) => console.log(value)}

                        />
                        <Dropdown
                            label={"Dropdown 2"}
                            options={dropdownOptions}
                            defaultText="Select an option"
                            onSelect={(value) => console.log(value)}

                        />
                        <Dropdown
                            label={"Dropdown 3"}
                            options={dropdownOptions}
                            defaultText="Select an option"
                            onSelect={(value) => console.log(value)}

                        />
                        <Dropdown
                            label={"Dropdown 4"}
                            options={dropdownOptions}
                            defaultText="Select an option"
                            onSelect={(value) => console.log(value)}

                        />
                        <Dropdown
                            label={"Dropdown 5"}
                            options={dropdownOptions}
                            defaultText="Select an option"
                            onSelect={(value) => console.log(value)}

                        />
                        <Dropdown
                            label={"Dropdown 6"}
                            options={dropdownOptions}
                            defaultText="Select an option"
                            onSelect={(value) => console.log(value)}

                        />
                        <Dropdown
                            label={"Dropdown 7"}
                            options={dropdownOptions}
                            defaultText="Select an option"
                            onSelect={(value) => console.log(value)}

                        />
                    </div>
                </div>

                {/* Section 3 */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Section 3</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <Dropdown
                            label="Dropdown 1"
                            options={dropdownOptions}
                            defaultText="Select an option"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                    <Button
                        text="Skip"
                        onClick={onClose}
                        className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300"
                    />
                    <Button
                        text="Continue"
                        onClick={() => {
                            alert("Continuing to the next step!");
                            onClose();
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    />
                </div>
            </div>
        </div>
    );

}

export default SignUpModal2





