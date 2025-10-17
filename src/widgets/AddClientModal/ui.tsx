import { InviteClientPayload } from "entities/coach";
import React, { useEffect, useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { phoneMask } from "shared/lib";
import { SelectField } from "widgets/CRMSelectField";
import { MultiSelectField } from "widgets/MultiSelectField";

interface AddClientModalProps {
  client: InviteClientPayload;
  updateClient: (field: string, value: any) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({
  client,
  updateClient,
  onCancel,
  onSave,
}) => {
  const [noPhoneNumber, setNoPhoneNumber] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const confidenceOptions = [
    {
      value: "not_confident",
      label: "Not confident at all — They’ll need full guidance from me.",
    },
    {
      value: "somewhat_confident",
      label:
        "Somewhat confident — They can answer some questions but may need support.",
    },
    {
      value: "confident",
      label:
        "Confident — They can complete most of it on their own with occasional help.",
    },
    {
      value: "very_confident",
      label:
        "Very confident — They’ll fill it out independently and come prepared.",
    },
  ];

  const isSaveDisabled =
    !client?.first_name?.trim() ||
    !client?.last_name?.trim() ||
    !client?.email?.trim() ||
    !client?.permission_type ||
    !client?.focus_areas?.length ||
    (!noPhoneNumber && !client?.phone_number?.trim());

  const renderFooter = () => {
    return (
      <div className="flex flex-col-reverse gap-[8px] md:flex-row justify-between items-center mt-[24px]">
        <button
          className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#D6ECFD] text-[#1C63DB] text-[16px] font-semibold"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className={`w-full md:w-[144px] h-[40px] rounded-[1000px] text-[16px] font-semibold ${isSaveDisabled
              ? "bg-[#D5DAE2] text-[#5F5F65]"
              : "bg-[#1C63DB] text-white"
            }`}
          onClick={onSave}
          disabled={isSaveDisabled}
        >
          Invite Client
        </button>
      </div>
    );
  };

  return (
    <div
      className={`fixed top-[85px] md:top-0 inset-0 z-[999] bg-transparent md:bg-[rgba(0,0,0,0.3)] md:backdrop-blur-[2px] flex items-start md:items-center justify-center overflow-y-auto`}
    >
      <div
        className={`bg-[#F2F4F6] md:bg-[#F9FAFB] md:rounded-[18px] md:shadow-xl px-[16px] py-[24px] md:p-[24px] top-0 bottom-0 h-full md:min-h-auto md:max-h-[90vh] w-full md:h-fit md:w-[720px] lg:w-[800px] text-left relative md:mx-[16px] overflow-hidden flex flex-col`}
      >
        <span
          className="hidden md:block absolute top-[16px] right-[16px] cursor-pointer z-20"
          onClick={onCancel}
        >
          <MaterialIcon iconName="close" />
        </span>

        <div className="flex gap-[24px] items-center mb-[16px] md:mb-[24px]">
          <div className="flex items-center gap-[8px]">
            <MaterialIcon iconName="account_circle" size={24} />
            <h2 className="text-[20px] font-[700]">Add new client</h2>
          </div>
          <span
            className="absolute z-20 visible cursor-pointer md:hidden top-6 right-4"
            onClick={onCancel}
          >
            <MaterialIcon iconName="close" />
          </span>
        </div>

        <main className="overflow-y-auto pr-[2px] grow flex flex-col gap-[16px] md:gap-[24px]">
          <div className="flex flex-col md:flex-row gap-[16px] md:gap-[24px]">
            <div className="w-full">
              <label className="block mb-[12px] text-[16px] text-[#000] font-semibold">
                First name
              </label>
              <input
                type="text"
                placeholder="Enter first name"
                value={client?.first_name || ""}
                onChange={(e) => updateClient("first_name", e.target.value)}
                className="placeholder-custom w-full outline-none border border-[#DBDEE1] rounded-[1000px] px-[12px] py-[12.5px] text-[14px] text-[#1D1D1F] font-semibold"
              />
            </div>
            <div className="w-full">
              <label className="block mb-[12px] text-[16px] text-[#000] font-semibold">
                Last name
              </label>
              <input
                type="text"
                placeholder="Enter last name"
                value={client?.last_name || ""}
                onChange={(e) => updateClient("last_name", e.target.value)}
                className="placeholder-custom w-full outline-none border border-[#DBDEE1] rounded-[1000px] px-[12px] py-[12.5px] text-[14px] text-[#1D1D1F] font-semibold"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-[12px] text-[16px] text-[#000] font-semibold">
              Email address
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              value={client?.email || ""}
              onChange={(e) => updateClient("email", e.target.value)}
              className="placeholder-custom w-full outline-none border border-[#DBDEE1] rounded-[1000px] px-[12px] py-[12.5px] text-[14px] text-[#1D1D1F] font-semibold"
            />
          </div>

          <div>
            <label className="block mb-[12px] text-[16px] text-[#000] font-semibold">
              Phone number (optional)
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phoneMask(client?.phone_number) || ""}
              onChange={(e) => {
                const raw = e.target.value;
                const cleaned = raw.replace(/[+\-()\s]/g, "");
                updateClient("phone_number", cleaned);
              }}
              className={`placeholder-custom w-full outline-none border border-[#DBDEE1] rounded-[1000px] px-[12px] py-[12.5px] text-[14px] text-[#1D1D1F] font-semibold ${noPhoneNumber ? "bg-gray-100" : ""
                }`}
              disabled={noPhoneNumber}
            />
            <div className="flex gap-[8px] items-center mt-[8px] text-[12px] text-[#5F5F65]">
              <input
                type="checkbox"
                checked={noPhoneNumber}
                onChange={() => {
                  setNoPhoneNumber(!noPhoneNumber);
                  if (!noPhoneNumber) updateClient("phone_number", "");
                }}
                className="accent-[#1C63DB]"
              />
              <label>I don’t have this client’s phone number</label>
            </div>
          </div>

          <MultiSelectField
            label="Area of focus"
            options={[
              { label: "Perimenopause" },
              { label: "Menopause / Post Menopause" },
              { label: "Hormone Health" },
              { label: "Gut Health" },
              { label: "Autoimmunity / Inflammation" },
              { label: "Metabolic / Weight Issues" },
              { label: "Sleep and Stress" },
              { label: "Emotional Well-being" },
              { label: "Chronic Illness Management" },
              { label: "General Wellness / Full Body Systems Optimization" },
            ]}
            selected={client.focus_areas || ""}
            onChange={(value) => updateClient("focus_areas", value)}
            height="h-[200px]"
          />

          <SelectField
            label="How confident is your client in completing their own health profile?"
            options={confidenceOptions}
            selected={
              confidenceOptions.find(
                (opt) => opt.value === client.permission_type
              )?.label || ""
            }
            onChange={(value) => updateClient("permission_type", value)}
            className="h-[160px]"
          />
        </main>

        <div className="mt-auto">{renderFooter()}</div>
      </div>
    </div>
  );
};
