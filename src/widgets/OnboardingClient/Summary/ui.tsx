import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PencilIcon } from "lucide-react";
import { RootState } from "entities/store";
import { setFormField } from "entities/store/clientOnboardingSlice";
import { AuthPageWrapper, Input } from "shared/ui";
import { HeaderOnboarding } from "widgets/HeaderOnboarding";
import { BottomButtons } from "widgets/BottomButtons";
import { Footer } from "widgets/Footer";

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
    { label: "Country", key: "country" },
    { label: "ZIP/Postal Code", key: "ZIP" },
    { label: "Language", key: "language" },
    { label: "Race / Ethnicity", key: "race" },
    { label: "Household Type", key: "household" },
    { label: "Occupation", key: "occupation" },
    { label: "Education Level", key: "education" },
  ];

  const insightsFields: { label: string; key: keyof typeof client }[] = [
    { label: "My main goal", key: "whatBringsYouHere" },
    { label: "Most important values", key: "values" },
    { label: "What’s been getting in your way so far?", key: "barriers" },
    { label: "My support", key: "support" },
    { label: "Personalization", key: "personalityType" },
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
      <div key={key} className="flex flex-col gap-1 flex-1">
        <p className="text-[#5F5F65] text-[12px] font-normal font-[Nunito]">
          {label}
        </p>
        {editing ? (
          <Input
            name={key}
            value={Array.isArray(value) ? value.join(", ") : value}
            onChange={(e) => handleChange(e, section)}
            className="text-[16px] font-[Nunito] font-semibold"
          />
        ) : (
          <h3 className="text-[#1D1D1F] text-[16px] font-[Nunito] font-semibold">
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
        <div key={i} className="flex items-start gap-4 self-stretch">
          {renderField(left.label, left.key, editing, section)}
          {right && renderField(right.label, right.key, editing, section)}
        </div>
      );
    }
    return pairs;
  };

  return (
    <AuthPageWrapper>
      <HeaderOnboarding currentStep={7} steps={8} />
      <main className="flex flex-col w-full items-center gap-8 justify-center self-stretch">
        <h1 className="text-[#1D1D1F] text-center text-h1">
          Summary Confirmation Page
        </h1>
        <div className="w-full max-w-[700px] p-[40px] rounded-2xl bg-white flex flex-col gap-6 items-start justify-center">
          <div className="flex flex-col items-start gap-2">
            <h3 className="font-[Nunito] text-[18px] font-bold text-[#1D1D1F]">
              Here’s a quick summary of what you shared.
            </h3>
            <p className="text-[#5F5F65] font-[Nunito] text-[16px] font-medium">
              We’ll use this to personalize your dashboard and recommendations.
            </p>
          </div>

          {/* Personal Info Section */}
          <div className="rounded-[16px] border border-[#DDEBF6] w-full flex flex-col gap-4 p-6">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-[#1D1D1F] font-[Nunito] text-[18px] font-bold">
                Personal info
              </h2>
              {!isEditingPersonal ? (
                <PencilIcon
                  className="cursor-pointer"
                  onClick={() => setIsEditingPersonal(true)}
                  size={16}
                  color="#1C63DB"
                />
              ) : (
                <div className="flex gap-2">
                  <button
                    className="text-[#1C63DB] text-sm"
                    onClick={() => handleSave("personal")}
                  >
                    Save
                  </button>
                  <button
                    className="text-gray-500 text-sm"
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
            <div className="flex justify-between items-center w-full">
              <h2 className="text-[#1D1D1F] font-[Nunito] text-[18px] font-bold">
                Your insights
              </h2>
              {!isEditingInsights ? (
                <PencilIcon
                  className="cursor-pointer"
                  onClick={() => setIsEditingInsights(true)}
                  size={16}
                  color="#1C63DB"
                />
              ) : (
                <div className="flex gap-2">
                  <button
                    className="text-[#1C63DB] text-sm"
                    onClick={() => handleSave("insights")}
                  >
                    Save
                  </button>
                  <button
                    className="text-gray-500 text-sm"
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
        </div>

        <BottomButtons
          handleNext={() => nav("/finish")}
          skipButton={() => nav("/finish")}
          isButtonActive={() => true}
        />
      </main>
      <Footer />
    </AuthPageWrapper>
  );
};
