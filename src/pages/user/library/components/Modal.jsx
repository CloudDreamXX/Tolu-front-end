import React, { useState } from 'react';
import Dropdown from '../../../../components/small/Dropdown'; // Import your Dropdown component

const Modal = ({
    modalIndex,
    handleAction,
    setModalIndex,
    dropdowns,
    setDropdowns
}) => {
    const dropdownOptions = [
        { option: "Option 1", value: "option1" },
        { option: "Option 2", value: "option2" },
        { option: "Option 3", value: "option3" },
    ];

    const handleDropdownChange = (index, value) => {
        const newDropdowns = [...dropdowns];
        newDropdowns[index] = value;
        setDropdowns(newDropdowns);
    };

    const handleButtonClick = (action) => {
        if (action === 'skip') {
            setModalIndex(modalIndex + 1); // Skip to next modal
        } else if (action === 'next') {
            setModalIndex(modalIndex + 1); // Go to next modal
        } else if (action === 'previous') {
            setModalIndex(modalIndex - 1); // Go to previous modal
        } else if (action === 'continue') {
            handleAction(dropdowns); // Submit the data on the final modal
        }
    };

    const modalContent = () => {
        if (modalIndex === 0) {
            return (
                <>
                    <h3 className="text-lg font-semibold mb-2">Section 1</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(7)].map((_, i) => (
                            <Dropdown
                                key={i}
                                label={`Dropdown ${i + 1}`}
                                options={dropdownOptions}
                                defaultText="Select an option"
                                onSelect={(value) => handleDropdownChange(i, value)}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between">
                        <button onClick={() => handleButtonClick('continue')}>Skip</button>
                        <button onClick={() => handleButtonClick('next')}>Next</button>
                    </div>
                </>
            );
        }

        if (modalIndex === 1) {
            return (
                <>
                    <h3 className="text-lg font-semibold mb-2">Section 2</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(7)].map((_, i) => (
                            <Dropdown
                                key={i}
                                label={`Dropdown ${i + 1}`}
                                options={dropdownOptions}
                                defaultText="Select an option"
                                onSelect={(value) => handleDropdownChange(i, value)}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between">
                        <button onClick={() => handleButtonClick('previous')}>Previous</button>
                        <button onClick={() => handleButtonClick('next')}>Next</button>
                    </div>
                </>
            );
        }

        if (modalIndex === 2) {
            return (
                <>
                    <h3 className="text-lg font-semibold mb-2">Section 3</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(7)].map((_, i) => (
                            <Dropdown
                                key={i}
                                label={`Dropdown ${i + 1}`}
                                options={dropdownOptions}
                                defaultText="Select an option"
                                onSelect={(value) => handleDropdownChange(i, value)}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between">
                        <button onClick={() => handleButtonClick('previous')}>Previous</button>
                        <button onClick={() => handleButtonClick('continue')}>Continue</button>
                    </div>
                </>
            );
        }
    };

    return (
        <div className="modal fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-50">
            <div className="modal-content bg-white p-6 rounded-lg shadow-lg z-60">
                {modalContent()}
            </div>
        </div>
    );
};

export default Modal;
