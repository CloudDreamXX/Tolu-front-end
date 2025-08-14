import React, { useEffect, useState } from "react";
import CloseIcon from "shared/assets/icons/close";
import UserIcon from "shared/assets/icons/user-black";
import ChatsIcon from "shared/assets/icons/chats";
import { ClientProfile } from "entities/coach";
import ArrowLeft from "shared/assets/icons/arrowLeft";
import ClientsIntake from "shared/assets/icons/clientsIntake";
import { ShareFmpModal } from "widgets/ShareFmpModal";
import HealthProfile from "./components/HealthProfile";
import ClientInfo from "./components/ClientInfo";
import FoodMoodPoop from "./components/FoodMoodPoop";
import { ClientStory, StorySections } from "./components/ClientStory";
import Symptoms, { SymptomsData } from "./components/Symptoms";
import LifestyleSkills, {
  LifestyleSkillsData,
} from "./components/LifestyleSkills";
import MedicationsSupplements, {
  MedsData,
  MedsEditing,
} from "./components/MedicationsSupplements";
import Biometrics, { BiometricsData } from "./components/Biometrics";
import Labs from "./components/Labs";

interface SelectedClientModalProps {
  client: ClientProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const SelectedClientModal: React.FC<SelectedClientModalProps> = ({
  client,
  activeTab,
  setActiveTab,
  onClose,
  onEdit,
}) => {
  const [shareOpen, setShareOpen] = useState(false);

  const [isEditingStory, setIsEditingStory] = useState(false);
  const [story, setStory] = useState<StorySections>({
    genetics: [
      "Family history of heart disease and type 2 diabetes",
      "Maternal depression during childhood",
    ],
    antecedents: [
      "Childhood asthma, which resolved by age 12 but may affect lung capacity today",
    ],
    triggers: [
      "Diagnosed with depression at age 25 after the death of father",
      "Major career change at age 40, increased stress and lifestyle changes",
    ],
    mediators: [
      "Low sleep quality exacerbates anxiety and depression symptoms",
    ],
  });
  const [isEditingSymptoms, setIsEditingSymptoms] = useState(false);
  const [symptoms, setSymptoms] = useState<SymptomsData>({
    hormones:
      "Hot flashes (3–5/day), Low libido, Interrupted sleep, Mood instability",
    mind: "",
  });
  const [isEditingLifestyle, setIsEditingLifestyle] = useState<keyof LifestyleSkillsData | null>(null)
  const [activeLifestyleSection, setActiveLifestyleSection] =
    useState<keyof LifestyleSkillsData>("sleepRelaxation");
  const [lifestyleSkills, setLifestyleSkills] = useState<LifestyleSkillsData>({
    sleepRelaxation: [
      { text: "Breathwork", sign: "plus" },
      { text: "Sunshine", sign: "plus" },
      { text: "Erratic sleep", sign: "minus" },
    ],
    exerciseMovement: [
      { text: "Breathwork", sign: "plus" },
      { text: "Sunshine", sign: "plus" },
    ],
  });
  const [meds, setMeds] = useState<MedsData>({
    previous: [
      {
        name: "Levothyroxine",
        dosage: "50 mcg daily",
        takingSince: "17.02.2024",
        prescribed: "Jill Hartmann",
        status: "not active",
      },
      {
        name: "Levothyroxine",
        dosage: "50 mcg daily",
        takingSince: "17.02.2024",
        prescribed: "Jill Hartmann",
        status: "not active",
      },
    ],
    current: [
      {
        name: "Levothyroxine",
        dosage: "50 mcg daily",
        takingSince: "17.02.2024",
        prescribed: "Jill Hartmann",
        status: "Active",
      },
    ],
  });
  const [medsEditing, setMedsEditing] = useState<MedsEditing>(null);
  const [isEditingBiometrics, setIsEditingBiometrics] = useState(false);
  const [biometrics, setBiometrics] = useState<BiometricsData>({
    hrv: "52 ms",
    sleepQuality: "7h 30m (75% sleep efficiency)",
    movementIntensity: "5,000 steps/day",
    bloodPressure: "130/85 mmHg (Normal)",
    fertilityTracking: "Ovulation Day 14 (2025-07-20)",
    glucoseTracking: "95 mg/dL (Fasting)",
  });

  const addLifestyleItem = () => {
    setLifestyleSkills((curr) => {
      const key = activeLifestyleSection || "sleepRelaxation";
      const list = curr[key] || [];
      return { ...curr, [key]: [...list, { text: "" }] };
    });
  };

  const saveLifestyle = async () => {
    setIsEditingLifestyle(null);
  };

  const saveStory = async () => {
    setIsEditingStory(false);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-transparent md:bg-[rgba(0,0,0,0.3)] md:backdrop-blur-[2px] flex items-start md:items-center justify-center overflow-y-auto">
      <div className="bg-[#F2F4F6] md:bg-[#F9FAFB] md:rounded-[18px] md:shadow-xl px-[16px] py-[24px] pt-[64px] md:p-[24px] top-0 bottom-0 h-full w-full md:h-fit md:w-[720px] lg:w-[800px] text-left relative md:mx-[16px] overflow-y-auto">
        <button
          className="absolute md:hidden top-[24px] flex justify-center items-center text-[#1D1D1F]"
          onClick={onClose}
        >
          <ArrowLeft />
        </button>
        <span
          className="hidden md:block absolute top-[16px] right-[16px] cursor-pointer"
          onClick={onClose}
        >
          <CloseIcon />
        </span>
        <div className="flex gap-[24px] items-center justify-between md:justify-start mb-[24px]">
          <div className="flex items-center gap-[8px]">
            <UserIcon />
            <h2 className="text-[20px] font-[700]">
              {client.client_info.name}
            </h2>
          </div>
          <div className="flex gap-4 text-[16px] font-semibold text-[#1C63DB]">
            <button className="hidden md:flex items-center gap-[8px] px-[12px] py-[4px]">
              <ChatsIcon />
              Chat
            </button>
            <button
              className="flex items-center gap-[8px] px-[12px] py-[4px]"
              onClick={onEdit}
            >
              <ClientsIntake /> Client's Intake
            </button>
          </div>
        </div>

        <div className="flex gap-[16px] mb-[24px] border border-[#DBDEE1] bg-white rounded-[1000px] p-[8px] overflow-x-auto">
          <button
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-nowrap ${activeTab === "clientInfo"
              ? "bg-[#F2F4F6] text-[#000000]"
              : "text-[#000000]"
              }`}
            onClick={() => setActiveTab("clientInfo")}
          >
            Personal information
          </button>
          <button
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-nowrap ${activeTab === "healthProfile"
              ? "bg-[#F2F4F6] text-[#000000]"
              : "text-[#000000]"
              }`}
            onClick={() => setActiveTab("healthProfile")}
          >
            Health summary
          </button>
          <button
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-nowrap ${activeTab === "foodMoodPoop"
              ? "bg-[#F2F4F6] text-[#000000]"
              : "text-[#000000]"
              }`}
            onClick={() => setActiveTab("foodMoodPoop")}
          >
            Food Mood Poop Journal
          </button>
          <button
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-nowrap ${activeTab === "clientStory"
              ? "bg-[#F2F4F6] text-[#000000]"
              : "text-[#000000]"
              }`}
            onClick={() => setActiveTab("clientStory")}
          >
            Client Story
          </button>
          <button
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-nowrap ${activeTab === "symptoms"
              ? "bg-[#F2F4F6] text-[#000000]"
              : "text-[#000000]"
              }`}
            onClick={() => setActiveTab("symptoms")}
          >
            Symptoms
          </button>
          <button
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-nowrap ${activeTab === "lifestyleSkills"
              ? "bg-[#F2F4F6] text-[#000000]"
              : "text-[#000000]"
              }`}
            onClick={() => setActiveTab("lifestyleSkills")}
          >
            Lifestyle Skills
          </button>
          <button
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-nowrap ${activeTab === "medicationsAndSupplements"
              ? "bg-[#F2F4F6] text-[#000000]"
              : "text-[#000000]"
              }`}
            onClick={() => setActiveTab("medicationsAndSupplements")}
          >
            Medications and Supplements
          </button>
          <button
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-nowrap ${activeTab === "biometrics"
              ? "bg-[#F2F4F6] text-[#000000]"
              : "text-[#000000]"
              }`}
            onClick={() => setActiveTab("biometrics")}
          >
            Biometrics
          </button>
          <button
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-nowrap ${activeTab === "labs"
              ? "bg-[#F2F4F6] text-[#000000]"
              : "text-[#000000]"
              }`}
            onClick={() => setActiveTab("labs")}
          >
            Labs
          </button>
        </div>

        <div className="md:max-h-[350px] overflow-y-auto">
          {activeTab === "clientInfo" && <ClientInfo client={client} />}
          {activeTab === "healthProfile" && <HealthProfile client={client} />}
          {activeTab === "foodMoodPoop" && <FoodMoodPoop />}
          {activeTab === "clientStory" && (
            <ClientStory
              value={story}
              edit={isEditingStory}
              onChange={setStory}
            />
          )}
          {activeTab === "symptoms" && (
            <Symptoms
              value={symptoms}
              edit={isEditingSymptoms}
              onChange={setSymptoms}
            />
          )}
          {activeTab === "lifestyleSkills" && (
            <LifestyleSkills
              value={lifestyleSkills}
              isEditing={isEditingLifestyle}
              setIsEditing={setIsEditingLifestyle}
              onChange={setLifestyleSkills}
              activeSection={activeLifestyleSection}
              onSectionFocus={setActiveLifestyleSection}
            />
          )}
          {activeTab === "medicationsAndSupplements" && (
            <MedicationsSupplements
              value={meds}
              onChange={setMeds}
              editing={medsEditing}
              setEditing={setMedsEditing}
            />
          )}
          {activeTab === "biometrics" && (
            <>
              <button
                type="button"
                className="md:hidden p-[16px] py-[10px] rounded-[1000px] text-[16px] text-[#008FF6] font-semibold text-end w-full"
              >
                <span className="text-[24px]">+</span> Add
              </button>
              <Biometrics
                value={biometrics}
                edit={isEditingBiometrics}
                onChange={setBiometrics}
              />
            </>
          )}
          {activeTab === "labs" && <Labs />}
        </div>

        <div className="flex flex-col-reverse gap-[8px] md:flex-row md:justify-between items-center mt-[18px] md:mt-[24px]">
          <button
            className="hidden md:block p-[16px] py-[10px] w-[128px] rounded-[1000px] bg-[#D6ECFD] text-[#1C63DB] text-[16px] font-semibold"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="w-full md:hidden p-[16px] py-[10px] w-[128px] rounded-[1000px] bg-[#D6ECFD] text-[#1C63DB] text-[16px] font-semibold flex gap-[8px] items-center justify-center">
            <ChatsIcon />
            Chat
          </button>
          {activeTab === "foodMoodPoop" && (
            <button
              onClick={() => setShareOpen(true)}
              className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
            >
              Share FMP
            </button>
          )}
          {activeTab === "clientStory" && !isEditingStory && (
            <button
              className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
              onClick={() => setIsEditingStory(true)}
            >
              Edit
            </button>
          )}
          {activeTab === "clientStory" && isEditingStory && (
            <button
              className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
              onClick={saveStory}
            >
              Save
            </button>
          )}
          {activeTab === "symptoms" && !isEditingSymptoms && (
            <button
              className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
              onClick={() => setIsEditingSymptoms(true)}
            >
              Edit
            </button>
          )}
          {activeTab === "symptoms" && isEditingSymptoms && (
            <button
              className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
              onClick={() => setIsEditingSymptoms(false)}
            >
              Save
            </button>
          )}
          {activeTab === "lifestyleSkills" && isEditingLifestyle && (
            <div className="flex items-center gap-3 w-full md:w-fit">
              <button
                type="button"
                onClick={addLifestyleItem}
                className="hidden md:block p-[16px] py-[10px] rounded-[1000px] text-[16px] text-[#008FF6] font-semibold"
              >
                <span className="text-[24px]">+</span> Add
              </button>
              <button
                className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
                onClick={saveLifestyle}
              >
                Save
              </button>
            </div>
          )}
          {activeTab === "medicationsAndSupplements" && medsEditing && (
            <button
              onClick={() => {
                setMedsEditing(null);
              }}
              disabled={medsEditing === null}
              className={[
                "p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] text-white text-[16px] font-semibold",
                medsEditing === null
                  ? "bg-[#1C63DB]/60 cursor-not-allowed"
                  : "bg-[#1C63DB]",
              ].join(" ")}
            >
              Save
            </button>
          )}
          {activeTab === "biometrics" && !isEditingBiometrics && (
            <button
              className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
              onClick={() => setIsEditingBiometrics(true)}
            >
              Edit
            </button>
          )}
          {activeTab === "biometrics" && isEditingBiometrics && (
            <div className="flex items-center gap-3 w-full md:w-fit">
              <button
                type="button"
                className="hidden md:block p-[16px] py-[10px] rounded-[1000px] text-[16px] text-[#008FF6] font-semibold"
              >
                <span className="text-[24px]">+</span> Add
              </button>
              <button
                className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
                onClick={() => setIsEditingBiometrics(false)}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
      <ShareFmpModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        onShare={() => {
          setShareOpen(false);
        }}
        clientName={client.client_info.name}
      />
    </div>
  );
};
