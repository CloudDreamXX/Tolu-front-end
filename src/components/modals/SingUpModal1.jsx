import React from "react";

const SingUpModal1 = ({
    isModalOpen,
    categories,
    selectedCategories,
    onCategoryClick,
    onClose,
    onNext,
}) => {
    if (!isModalOpen) return null; // Don't render anything if modal is closed

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
                {/* Modal Header */}
                <div className="flex justify-end items-center">
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800"
                    >
                        ✕
                    </button>
                </div>
                <div className="flex flex-col items-center">
                    <h2 className="text-2xl text-[#252525B2] font-bold">
                        Personalize Your Experience
                    </h2>
                    <h2 className="mt-5 mb-5 text-[#252525B2] text-base font-normal">
                        Choose at least 2 topics that interest you to receive tailored
                        content.
                    </h2>
                </div>

                {/* Modal Body */}
                <div className="flex flex-wrap gap-4 items-center">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            onClick={() => onCategoryClick(category)}
                            className={`p-2 border-2 rounded-full text-center cursor-pointer transition ${selectedCategories.includes(category)
                                ? "bg-[#EEEEEE] text-[#252525B2] border-4 border-[#2525254D]"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            {category}
                        </div>
                    ))}
                </div>

                {/* Modal Footer */}
                <div className="flex flex-col items-end">
                    <button
                        className={`mt-6 w-[100px] p-3 rounded-lg font-semibold ${selectedCategories.length >= 2
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        disabled={selectedCategories.length < 2}
                        onClick={onNext}
                    >
                        Finish
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SingUpModal1;
