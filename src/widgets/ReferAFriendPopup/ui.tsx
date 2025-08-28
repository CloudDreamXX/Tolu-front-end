import { Input } from "shared/ui";
import { SearchableSelect } from "widgets/OnboardingPractitioner/components/SearchableSelect";
import { useState } from "react";
import { phoneMask, toast } from "shared/lib";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferAFriendPopup: React.FC<Props> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    age: "",
    gender: "",
    healthConcern: "",
    diagnosedCondition: "",
    email: "",
    goal: "",
    phoneNumber: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = () => {
    onClose();
    toast({
      title: "Refer completed",
    });
  };

  const isButtonDisabled =
    formData.firstName === "" ||
    formData.age === "" ||
    formData.gender === "" ||
    formData.email === "" ||
    !isValidEmail(formData.email) ||
    formData.goal === "";

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div className="bg-white z-[9999] rounded-[18px] w-[742px] px-[24px] py-[24px] flex flex-col gap-[24px] relative mx-[16px] max-h-[90%] overflow-y-auto">
        <button
          className="absolute top-[16px] right-[16px]"
          aria-label="Close modal"
          onClick={onClose}
        >
          <MaterialIcon iconName="close" />
        </button>

        <h3
          id="modal-title"
          className="text-[18px] md:text-[24px] font-semibold text-[#1D1D1F]"
        >
          Refer a friend
        </h3>
        <div className="flex flex-col gap-[24px] max-h-[70vh] overflow-y-auto">
          <p className="text-[16px] text-[#5F5F65] font-[500]">
            Good things are better when shared.
          </p>

          <div className="flex flex-col flex-1 gap-[8px]">
            <label className="text-[#1D1D1F] text-[16px] font-[Nunito] font-[500]">
              First name*
            </label>
            <Input
              type="text"
              placeholder="Enter name"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="border rounded-[8px] h-[44px] px-[12px] text-[16px]"
            />
          </div>

          <div className="flex flex-col flex-1 gap-[8px]">
            <label className="text-[#1D1D1F] text-[16px] font-[Nunito] font-[500]">
              Age*
            </label>
            <Input
              type="text"
              placeholder="Enter age"
              value={formData.age}
              onChange={(e) => handleChange("age", e.target.value)}
              className="border rounded-[8px] h-[44px] px-[12px] text-[16px]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[#1D1D1F] text-[16px] font-[Nunito] font-[500]">
              Gender*
            </label>
            <SearchableSelect
              options={["Female", "Male", "Other"]}
              inputStyles="border rounded-[8px] h-[44px] px-[12px] text-[14px]"
              value={formData.gender}
              onChange={(value) => handleChange("gender", value)}
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[#1D1D1F] text-[16px] font-[Nunito] font-[500]">
              Health concern
            </label>
            <Input
              type="text"
              placeholder="Enter health concern"
              value={formData.healthConcern}
              onChange={(e) => handleChange("healthConcern", e.target.value)}
              className="border rounded-[8px] h-[44px] px-[12px] text-[16px]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[#1D1D1F] text-[16px] font-[Nunito] font-[500]">
              Diagnosed condition{" "}
              <span className="text-[#B3BCC8]">(if any)</span>
            </label>
            <Input
              type="text"
              placeholder="Enter diagnosed condition"
              value={formData.diagnosedCondition}
              onChange={(e) =>
                handleChange("diagnosedCondition", e.target.value)
              }
              className="border rounded-[8px] h-[44px] px-[12px] text-[16px]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[#1D1D1F] text-[16px] font-[Nunito] font-[500]">
              Email address*
            </label>
            <Input
              type="text"
              placeholder="Enter email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="border rounded-[8px] h-[44px] px-[12px] text-[16px]"
            />
            {formData.email !== "" &&
              formData.goal !== "" &&
              !isValidEmail(formData.email) && (
                <p className="text-[#FF1F0F] font-[Nunito] font-medium px-[16px] text-[14px]">
                  Email format is incorrect
                </p>
              )}
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[#1D1D1F] text-[16px] font-[Nunito] font-[500]">
              Goal*
            </label>
            <Input
              type="text"
              placeholder="Enter goal"
              value={formData.goal}
              onChange={(e) => handleChange("goal", e.target.value)}
              className="border rounded-[8px] h-[44px] px-[12px] text-[16px]"
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[#1D1D1F] text-[16px] font-[Nunito] font-[500]">
              Phone number
            </label>
            <Input
              type="text"
              placeholder="Enter phone number"
              value={phoneMask(formData.phoneNumber)}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              className="border rounded-[8px] h-[44px] px-[12px] text-[16px]"
            />
          </div>
        </div>

        <div className="gap-[16px] flex justify-between mt-[24px] w-full">
          <button
            className="w-full md:w-[128px] px-[16px] py-[11px] rounded-full bg-[#DDEBF6] text-[#1C63DB] text-[16px] font-[600] md:w-[128px]"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`w-full md:w-[128px] px-[16px] py-[11px] rounded-full text-[16px] font-[600] bg-[#1C63DB] text-white ${isButtonDisabled ? "opacity-50" : ""}`}
            disabled={isButtonDisabled}
          >
            Refer
          </button>
        </div>
      </div>
    </div>
  );
};
