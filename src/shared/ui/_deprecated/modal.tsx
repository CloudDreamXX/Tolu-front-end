import React from "react";

interface SignupFormProps {
  isModalOpen: boolean;
  categories?: { id: number; name: string }[];
  selectedCategories: string[];
  onCategoryClick?: (categoryName: string) => void;
  onClose: () => void;
  onNext?: () => void;
}

export const SingUpModal1: React.FC<SignupFormProps> = ({
  isModalOpen,
  categories,
  selectedCategories,
  onCategoryClick,
  onClose,
}) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-lg sm:p-8">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-2xl text-[#252525B2] font-bold">
            Personalize Your Experience
          </h2>
          <p className="mt-5 mb-5 text-[#252525B2] text-base font-normal text-center">
            Choose at least 2 topics that interest you to receive tailored
            content.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {categories?.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryClick && onCategoryClick(category.name)}
              className={`p-2 border-2 rounded-full text-center cursor-pointer transition ${
                selectedCategories.includes(category.name)
                  ? "bg-[#EEEEEE] text-[#252525B2] border-4 border-[#2525254D]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end">
          <button
            className={`mt-6 w-[100px] p-3 rounded-lg font-semibold transition ${
              selectedCategories.length >= 2
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={selectedCategories.length < 2}
            onClick={onClose}
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};
