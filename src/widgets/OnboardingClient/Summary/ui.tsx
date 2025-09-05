import { RootState } from "entities/store";
import { setFormField } from "entities/store/clientOnboardingSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Input } from "shared/ui";
import { OnboardingClientLayout } from "../Layout";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

export const Summary = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const client = useSelector((state: RootState) => state.clientOnboarding);

  // Edit mode tracking
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingInsights, setIsEditingInsights] = useState(false);

  // Local editable state
  const [personalState, setPersonalState] = useState({ ...client });
  const [insightsState, setInsightsState] = useState({ ...client });

  const handleSave = (type: "personal" | "insights") => {
    const stateToSave = type === "personal" ? personalState : insightsState;
    Object.entries(stateToSave).forEach(([key, value]) => {
      dispatch(setFormField({ field: key as keyof typeof client, value }));
    });
    if (type === "personal") setIsEditingPersonal(false);
    if (type === "insights") setIsEditingInsights(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: "personal" | "insights"
  ) => {
    const { name, value } = e.target;
    if (section === "personal") {
      setPersonalState((prev) => ({ ...prev, [name]: value }));
    } else {
      setInsightsState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const personalFields: { label: string; key: keyof typeof client }[] = [
    { label: "Age", key: "age" },
    { label: "Menopause Status", key: "menopauseStatus" },
    { label: "Language", key: "language" },
  ];

  const insightsFields: { label: string; key: keyof typeof client }[] = [
    { label: "My main goal", key: "whatBringsYouHere" },
    { label: "Most important values", key: "values" },
    { label: "What’s been getting in your way so far?", key: "barriers" },
    { label: "My support", key: "support" },
    { label: "Readiness to life changes", key: "readiness" },
  ];

  const renderField = (
    label: string,
    key: keyof typeof client,
    editing: boolean,
    section: "personal" | "insights"
  ) => {
    const value =
      section === "personal" ? personalState[key] : insightsState[key];

    return (
      <div key={key} className="flex flex-col flex-1 gap-1">
        <p className="text-[#5F5F65] text-[12px] font-normal ">{label}</p>
        {editing ? (
          <Input
            name={key}
            value={Array.isArray(value) ? value.join(", ") : value}
            onChange={(e) => handleChange(e, section)}
            className="text-[16px]  font-semibold"
          />
        ) : (
          <h3 className="text-[#1D1D1F] text-[16px]  font-semibold">
            {Array.isArray(value) ? value.join(", ") : value || "-"}
          </h3>
        )}
      </div>
    );
  };

  const renderPairs = (
    fields: { label: string; key: keyof typeof client }[],
    editing: boolean,
    section: "personal" | "insights"
  ) => {
    const pairs = [];
    for (let i = 0; i < fields.length; i += 2) {
      const left = fields[i];
      const right = fields[i + 1];
      pairs.push(
        <div key={i} className="flex items-start self-stretch gap-4">
          {renderField(left.label, left.key, editing, section)}
          {right && renderField(right.label, right.key, editing, section)}
        </div>
      );
    }
    return pairs;
  };

  const title = (
    <h1 className="flex w-full items-center justify-center text-[#1D1D1F] text-center text-[24px] md:text-[32px] font-bold">
      Summary Confirmation Page
    </h1>
  );

  const mainContent = (
    <>
      <div className="flex flex-col items-start gap-2">
        <h3 className=" text-[18px] font-bold text-[#1D1D1F]">
          Here’s a quick summary of what you shared.
        </h3>
        <p className="text-[#5F5F65]  text-[16px] font-medium">
          We’ll use this to personalize your dashboard and recommendations.
        </p>
      </div>

      {/* Personal Info Section */}
      <div className="rounded-[16px] border border-[#DDEBF6] w-full flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-[#1D1D1F]  text-[18px] font-bold">
            Personal info
          </h2>
          {!isEditingPersonal ? (
            <button
              className="cursor-pointer"
              onClick={() => setIsEditingPersonal(true)}
            >
              <MaterialIcon iconName="edit" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                className="text-[#1C63DB] text-sm"
                onClick={() => handleSave("personal")}
              >
                Save
              </button>
              <button
                className="text-sm text-gray-500"
                onClick={() => {
                  setPersonalState({ ...client });
                  setIsEditingPersonal(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        {renderPairs(personalFields, isEditingPersonal, "personal")}
      </div>

      {/* Insights Section */}
      <div className="rounded-[16px] border border-[#DDEBF6] w-full flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-[#1D1D1F]  text-[18px] font-bold">
            Your insights
          </h2>
          {!isEditingInsights ? (
            <button
              className="cursor-pointer"
              onClick={() => setIsEditingInsights(true)}
            >
              <MaterialIcon iconName="edit" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                className="text-[#1C63DB] text-sm"
                onClick={() => handleSave("insights")}
              >
                Save
              </button>
              <button
                className="text-sm text-gray-500"
                onClick={() => {
                  setInsightsState({ ...client });
                  setIsEditingInsights(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* One-by-one fields instead of pairs */}
        {insightsFields.map(({ label, key }) =>
          renderField(label, key, isEditingInsights, "insights")
        )}
      </div>
    </>
  );

  const buttonsBlock = (
    <div className="flex flex-col-reverse justify-between items-center w-full max-w-[700px] gap-4 md:flex-row">
      <button
        onClick={() => nav(-1)}
        className="p-4  w-full md:w-[128px]  h-[44px] flex items-center justify-center rounded-full text-base font-semibold bg-[#DDEBF6] text-[#1C63DB]"
      >
        Back
      </button>

      <button
        onClick={() => nav("/finish")}
        className="p-4 w-full md:w-fit h-[44px] flex items-center justify-center rounded-full text-base font-semibold bg-[#1C63DB] text-white"
      >
        Create My Personalized Dashboard
      </button>
    </div>
  );

  return (
    <OnboardingClientLayout
      currentStep={7}
      numberOfSteps={8}
      title={title}
      children={mainContent}
      buttons={buttonsBlock}
    />
  );
};
