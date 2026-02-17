import {
  ClientComprehensiveProfile,
  ComprehensiveProfile,
  FmpShareRequest,
  LifestyleSkillsInfo,
  MedicationsAndSupplements,
  UpdateHealthHistoryRequest,
  useGetComprehensiveClientQuery,
  useUpdateComprehensiveClientMutation,
  useShareTrackerMutation,
  useUpdateHealthHistoryMutation,
} from "entities/coach";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { toast } from "shared/lib";
import { ConfirmModal } from "widgets/ConfirmModal";
import Biometrics from "./components/Biometrics";
import ClientInfo from "./components/ClientInfo";
import { ClientStory } from "./components/ClientStory";
import FoodMoodPoop from "./components/FoodMoodPoop";
import HealthProfile from "./components/HealthProfile";
import Labs from "./components/Labs";
import LifestyleSkills, {
  LifestyleItem,
  LifestyleSkillsValue,
} from "./components/LifestyleSkills";
import MedicationsSupplements, {
  MedsEditing,
} from "./components/MedicationsSupplements";
import Symptoms from "./components/Symptoms";
import { Button } from "shared/ui";

interface SelectedClientModalProps {
  clientId: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const SelectedClientModal: React.FC<SelectedClientModalProps> = ({
  clientId,
  activeTab,
  setActiveTab,
  onClose,
}) => {
  const nav = useNavigate();
  const [client, setClient] = useState<ClientComprehensiveProfile>({
    personal_info: {
      name: "",
      email: "",
      phone: null,
      date_of_birth: null,
      location: null,
    },
    health_summary: {
      primary_complaint: null,
      working_with_client_since: null,
      client_age: null,
      menopause_cycle_status: null,
      working_on_now: [],
      recent_labs: null,
      learning_now: [],
      tracking: [],
      personal_insights: [],
    },
    food_mood_poop_journal: [],
    health_timeline: {
      genetic_health: [],
      history_of_diagnosis: [],
    },
    client_story: {
      genetic_influences: { notes: "" },
      pivotal_incidents: [],
      symptom_influencers: {},
    },
    symptoms: {
      hormones_and_neurotransmitters_reported_symptoms: [],
      mind_spirit_emotions_community_reported_state: null,
    },
    lifestyle_skills: {},
    medications_and_supplements: {
      previous_medications: [],
      current_medications: [],
    },
    biometrics: {
      hrv: null,
      sleep_quality: null,
      movement_and_intensity: null,
      cycle_tracking: null,
      blood_pressure: null,
      fertility_tracking: null,
      glucose_tracking: null,
    },
    labs: [],
  });

  const [shareOpen, setShareOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);

  const [isEditingStory, setIsEditingStory] = useState(false);
  const [isEditingSymptoms, setIsEditingSymptoms] = useState(false);
  const [isEditingLifestyle, setIsEditingLifestyle] = useState<string | null>(
    null
  );
  const [activeLifestyleSection, setActiveLifestyleSection] =
    useState<string>("");
  const [lifestyleSkills, setLifestyleSkills] = useState<LifestyleSkillsValue>(
    {}
  );
  const [medsEditing, setMedsEditing] = useState<MedsEditing>(null);
  const [isEditingBiometrics, setIsEditingBiometrics] = useState(false);

  const [medsSnapshot, setMedsSnapshot] =
    useState<MedicationsAndSupplements | null>(null);

  const [saving, setSaving] = useState<boolean>(false);

  const { data: clientData, refetch: refetchClient } =
    useGetComprehensiveClientQuery(clientId);

  const [updateComprehensiveClient] = useUpdateComprehensiveClientMutation();
  const [shareTracker] = useShareTrackerMutation();
  const [updateHealthHistory] = useUpdateHealthHistoryMutation();

  useEffect(() => {
    if (clientData) {
      setClient(clientData.data);
    }
  }, [clientData]);

  const addLifestyleItem = () => {
    setLifestyleSkills((curr) => {
      const section =
        activeLifestyleSection || Object.keys(curr)[0] || "Sleep & Relaxation";
      const list = curr[section] || [];
      const next: LifestyleItem[] = [...list, { text: "" }];
      return { ...curr, [section]: next };
    });
  };

  const updateComprehensive = async (
    partial: ComprehensiveProfile,
    reason: string
  ) => {
    setSaving(true);
    try {
      await updateComprehensiveClient({
        id: clientId,
        data: { ...partial, edit_reason: reason },
      }).unwrap();

      toast({
        title: "Profile updated",
        description: "Comprehensive profile was saved successfully.",
      });
      await refetchClient();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not save comprehensive profile.",
      });
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const arrayToString = (value: any): string | undefined => {
    if (!value) return undefined;
    if (Array.isArray(value)) {
      const texts = value
        .map((item) =>
          typeof item === "object" && "text" in item
            ? item.text?.trim()
            : String(item).trim()
        )
        .filter(Boolean);
      return texts.length > 0 ? texts.join(", ") : undefined;
    }
    if (typeof value === "string") {
      return value.trim() || undefined;
    }
    return undefined;
  };

  const saveLifestyle = async () => {
    setIsEditingLifestyle(null);

    const partial: Partial<ComprehensiveProfile> = {
      lifestyle_information: arrayToString(
        lifestyleSkills.lifestyle_information
      ),
      exercise_habits: arrayToString(lifestyleSkills.exercise_habits),
      lifestyle_limitations: arrayToString(
        lifestyleSkills.lifestyle_limitations
      ),
      stress_levels: arrayToString(lifestyleSkills.stress_levels),
    };

    await updateComprehensive(partial, "Updated lifestyle skills");
  };

  const saveStory = async () => {
    setIsEditingStory(false);

    const partial: Partial<ComprehensiveProfile> = {
      client_story: client.client_story,
    };

    await updateComprehensive(partial, "Updated client story");
  };

  const saveSymptoms = async () => {
    setIsEditingSymptoms(false);
    const partial: Partial<ComprehensiveProfile> = {
      current_health_concerns:
        client.symptoms?.hormones_and_neurotransmitters_reported_symptoms?.join(
          ", "
        ) || undefined,
      support_system:
        client.symptoms?.mind_spirit_emotions_community_reported_state ||
        undefined,
    };

    await updateComprehensive(partial, "Updated symptoms");
  };

  const buildMedicationOperations = (
    medications: MedicationsAndSupplements
  ) => {
    const operations: {
      action: string;
      medication:
      | {
        name: string;
        dosage: string;
        prescribed_date: string;
        prescribed_by: string;
        status: string;
      }
      | { dosage: string; status: string }
      | {
        name: string;
        dosage: string;
        prescribed_date: string;
        prescribed_by: string;
        status: string;
      }
      | { dosage: any };
      medication_id?: any;
    }[] = [];

    medications.previous_medications.forEach((med) => {
      operations.push({
        action: "add",
        medication: {
          name: med.name,
          dosage: med.dosage,
          prescribed_date: med.prescribed_date,
          prescribed_by: med.prescribed_by,
          status: med.status,
        },
      });
    });

    medications.current_medications.forEach((med) => {
      if (med.medication_id) {
        operations.push({
          action: "update",
          medication_id: med.medication_id || "",
          medication: {
            dosage: med.dosage,
            status: med.status,
          },
        });
      } else {
        operations.push({
          action: "add",
          medication: {
            name: med.name,
            dosage: med.dosage,
            prescribed_date: med.prescribed_date,
            prescribed_by: med.prescribed_by,
            status: med.status,
          },
        });
      }
    });

    // medications.deleted_medications.forEach((med) => {
    //   operations.push({
    //     action: "delete",
    //     medication_id: med.medication_id,
    //     medication: {
    //       dosage: med.dosage,
    //     },
    //   });
    // });

    return operations;
  };

  const saveMeds = async () => {
    setMedsEditing(null);
    const medsOperations = buildMedicationOperations(medsSnapshot!);
    await updateComprehensive(
      { medication_operations: medsOperations },
      "Updated medications"
    );
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleDownloadFile = async (name: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/coach-admin/lab-file/${clientId}/${name}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.click();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to download file",
        description: "Please try again.",
      });
      console.error(error);
    }
  };

  const shareFMP = async () => {
    const dateInStockholm = new Date().toLocaleString("sv-SE", {
      timeZone: "Europe/Stockholm",
    });
    const currentDate = dateInStockholm.split(" ")[0];
    try {
      const data: FmpShareRequest = {
        user_id: clientId,
        tracking_date: currentDate,
      };
      await shareTracker(data).unwrap();
      toast({ title: "FMP tool shared successfully" });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to share tracker",
        description: "Failed to share FMP tracker. Please try again.",
      });
      console.error(error);
    }
  };

  const requestHealthHistory = async () => {
    try {
      const data: UpdateHealthHistoryRequest = {
        client_id: clientId,
        custom_message: "",
      };
      await updateHealthHistory(data).unwrap();
      nav(`/clients/${clientId}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to request health history",
        description: "Please try again.",
      });
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-transparent md:bg-[rgba(0,0,0,0.3)] md:backdrop-blur-[2px] flex items-start md:items-center justify-center overflow-y-auto">
      <div className="bg-[#F2F4F6] md:bg-[#F9FAFB] md:rounded-[18px] md:shadow-xl px-[16px] py-[24px] pt-[64px] md:p-[24px] top-0 bottom-0 h-full w-full md:h-fit md:w-[720px] lg:w-[800px] text-left relative md:mx-[16px] overflow-y-auto">
        <Button
          variant={"unstyled"}
          size={"unstyled"}
          className="absolute md:hidden top-[24px] flex justify-center items-center text-[#1D1D1F]"
          onClick={onClose}
        >
          <MaterialIcon iconName="keyboard_arrow_left" />
        </Button>
        <span
          className="hidden md:block absolute top-[16px] right-[16px] cursor-pointer"
          onClick={onClose}
        >
          <MaterialIcon iconName="close" />
        </span>
        <div className="flex gap-[24px] items-center justify-between md:justify-start mb-[24px]">
          <div className="flex items-center gap-[8px]">
            <MaterialIcon iconName="account_circle" fill={1} />
            <div className="flex flex-col">
              <h2 className="text-[18px] font-[700]">
                {client?.personal_info.email}
              </h2>
              {client?.personal_info?.signup_date && (
                <p className="text-[14px] text-[#5F5F65] font-[500]">
                  Date joined:{" "}
                  {new Date(
                    client.personal_info.signup_date
                  ).toLocaleDateString("en-GB")}
                </p>
              )}
            </div>
          </div>
          {/* <div className="flex gap-4 text-[16px] font-semibold text-[#1C63DB]">
            <Button variant={"unstyled"} size={"unstyled"}
              className="hidden md:flex items-center gap-[8px] px-[12px] py-[4px]"
              onClick={() => nav(`/clients/${clientId}`)}
            >
              <MaterialIcon iconName="forum" fill={1} />
              Chat
            </Button>
            <Button variant={"unstyled"} size={"unstyled"}
              className="flex items-center gap-[8px] px-[12px] py-[4px]"
              onClick={onEdit}
            >
              <MaterialIcon iconName="folder_supervised" fill={1} />
              Client's Intake
            </Button>
          </div> */}
        </div>

        <div className="flex gap-[16px] mb-[24px] border border-[#DBDEE1] bg-white rounded-[1000px] p-[8px] overflow-x-auto">
          {/* <Button variant={"unstyled"} size={"unstyled"}
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-nowrap ${
              activeTab === "clientInfo"
                ? "bg-[#F2F4F6] text-[#000000]"
                : "text-[#000000]"
            }`}
            onClick={() => setActiveTab("clientInfo")}
          >
            Personal information
          </Button> */}
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-nowrap ${activeTab === "healthProfile"
              ? "bg-[#F2F4F6] text-[#000000]"
              : "text-[#000000]"
              }`}
            onClick={() => setActiveTab("healthProfile")}
          >
            Health summary
          </Button>
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-nowrap ${activeTab === "foodMoodPoop"
              ? "bg-[#F2F4F6] text-[#000000]"
              : "text-[#000000]"
              }`}
            onClick={() => setActiveTab("foodMoodPoop")}
          >
            Food Mood Poop Journal
          </Button>
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-nowrap ${activeTab === "clientStory"
              ? "bg-[#F2F4F6] text-[#000000]"
              : "text-[#000000]"
              }`}
            onClick={() => setActiveTab("clientStory")}
          >
            Client Story
          </Button>
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-nowrap ${activeTab === "symptoms"
              ? "bg-[#F2F4F6] text-[#000000]"
              : "text-[#000000]"
              }`}
            onClick={() => setActiveTab("symptoms")}
          >
            Symptoms
          </Button>
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-nowrap ${activeTab === "lifestyleSkills"
              ? "bg-[#F2F4F6] text-[#000000]"
              : "text-[#000000]"
              }`}
            onClick={() => setActiveTab("lifestyleSkills")}
          >
            Lifestyle Skills
          </Button>
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-nowrap ${activeTab === "medicationsAndSupplements"
              ? "bg-[#F2F4F6] text-[#000000]"
              : "text-[#000000]"
              }`}
            onClick={() => setActiveTab("medicationsAndSupplements")}
          >
            Medications and Supplements
          </Button>
          {/* <Button variant={"unstyled"} size={"unstyled"}
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-nowrap ${activeTab === "biometrics"
              ? "bg-[#F2F4F6] text-[#000000]"
              : "text-[#000000]"
              }`}
            onClick={() => setActiveTab("biometrics")}
          >
            Biometrics
          </Button> */}
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className={`w-full px-[24px] py-[10px] rounded-full font-semibold text-[14px] text-nowrap ${activeTab === "labs"
              ? "bg-[#F2F4F6] text-[#000000]"
              : "text-[#000000]"
              }`}
            onClick={() => setActiveTab("labs")}
          >
            Labs
          </Button>
        </div>

        <div className="md:max-h-[350px] min-h-60 overflow-y-auto">
          {activeTab === "clientInfo" && (
            <ClientInfo client={client.personal_info} />
          )}
          {activeTab === "healthProfile" && (
            <HealthProfile client={client.health_summary} />
          )}
          {activeTab === "foodMoodPoop" && (
            <FoodMoodPoop client={client.food_mood_poop_journal} />
          )}
          {activeTab === "clientStory" && (
            <ClientStory
              client={client.client_story}
              edit={isEditingStory}
              onChange={(next) =>
                setClient((curr) => ({ ...curr, client_story: next }))
              }
            />
          )}

          {activeTab === "symptoms" && (
            <Symptoms
              client={client.symptoms}
              edit={isEditingSymptoms}
              onChange={(next) =>
                setClient((curr) => ({ ...curr, symptoms: next }))
              }
            />
          )}
          {activeTab === "lifestyleSkills" && (
            <LifestyleSkills
              client={client.lifestyle_skills as LifestyleSkillsInfo}
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
              client={client.medications_and_supplements}
              editing={medsEditing}
              setEditing={setMedsEditing}
              onChange={setMedsSnapshot}
            />
          )}
          {activeTab === "biometrics" && (
            <>
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                type="button"
                className="md:hidden p-[16px] py-[10px] rounded-[1000px] text-[16px] text-[#008FF6] font-semibold text-end w-full"
              >
                <span className="text-[24px]">+</span> Add
              </Button>
              <Biometrics
                client={client.biometrics}
                edit={isEditingBiometrics}
                onChange={(next) =>
                  setClient((curr) => ({ ...curr, biometrics: next }))
                }
              />
            </>
          )}
          {activeTab === "labs" && (
            <Labs
              handleDownloadFile={handleDownloadFile}
              client={
                (client.labs && client.labs.length > 0 && client.labs) || [
                  {
                    id: "lab-001",
                    name: "CBC_Results_2025-05-12.pdf",
                    description:
                      "Hemoglobin within range, platelets slightly elevated.",
                    pages: 3,
                    url: "https://example.com/labs/CBC_Results_2025-05-12.pdf",
                    collected_at: "2025-05-11",
                    reported_at: "2025-05-12",
                    labName: "Acme Diagnostics",
                  },
                  {
                    lab_id: "lab-002",
                    file_name: "Lipid_Panel_2025-04-03.pdf",
                    summary: "LDL decreased by 12% since previous test.",
                    page_count: 2,
                    file_url:
                      "https://example.com/labs/Lipid_Panel_2025-04-03.pdf",
                    collected_at: "2025-04-02",
                    reported_at: "2025-04-03",
                    specimen: "Blood",
                  },
                ]
              }
            />
          )}
        </div>

        <div className="flex flex-col-reverse gap-[8px] md:flex-row md:justify-between items-center mt-[18px] md:mt-[24px]">
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="hidden md:block p-[16px] py-[10px] w-[128px] rounded-[1000px] bg-[#D6ECFD] text-[#1C63DB] text-[16px] font-semibold"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="w-full md:hidden p-[16px] py-[10px] rounded-[1000px] bg-[#D6ECFD] text-[#1C63DB] text-[16px] font-semibold flex gap-[8px] items-center justify-center"
            onClick={() => nav(`/clients/${clientId}`)}
          >
            <MaterialIcon iconName="forum" fill={1} />
            Chat
          </Button>

          {activeTab === "foodMoodPoop" && (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              onClick={() => setShareOpen(true)}
              className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
            >
              Share FMP
            </Button>
          )}
          {activeTab === "healthProfile" && (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              onClick={() => setSuggestOpen(true)}
              className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
            >
              Suggest
            </Button>
          )}
          {activeTab === "clientStory" && !isEditingStory && (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
              onClick={() => setIsEditingStory(true)}
            >
              Edit
            </Button>
          )}
          {activeTab === "clientStory" && isEditingStory && (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
              onClick={saveStory}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          )}
          {activeTab === "symptoms" && !isEditingSymptoms && (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
              onClick={() => setIsEditingSymptoms(true)}
            >
              Edit
            </Button>
          )}
          {activeTab === "symptoms" && isEditingSymptoms && (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
              onClick={saveSymptoms}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          )}
          {activeTab === "lifestyleSkills" && isEditingLifestyle && (
            <div className="flex items-center w-full gap-3 md:w-fit">
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                type="button"
                onClick={addLifestyleItem}
                className="hidden md:block p-[16px] py-[10px] rounded-[1000px] text:[16px] text-[#008FF6] font-semibold"
              >
                <span className="text-[24px]">+</span> Add
              </Button>
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
                onClick={saveLifestyle}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
          {activeTab === "medicationsAndSupplements" && medsEditing && (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              onClick={saveMeds}
              disabled={saving || medsEditing === null}
              className={[
                "p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] text-white text-[16px] font-semibold",
                medsEditing === null
                  ? "bg-[#1C63DB]/60 cursor-not-allowed"
                  : "bg-[#1C63DB]",
              ].join(" ")}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          )}
          {activeTab === "biometrics" && !isEditingBiometrics && (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
              onClick={() => setIsEditingBiometrics(true)}
            >
              Edit
            </Button>
          )}
          {activeTab === "biometrics" && isEditingBiometrics && (
            <div className="flex items-center w-full gap-3 md:w-fit">
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                type="button"
                className="hidden md:block p-[16px] py-[10px] rounded-[1000px] text-[16px] text-[#008FF6] font-semibold"
              >
                <span className="text-[24px]">+</span> Add
              </Button>
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
                onClick={() => setIsEditingBiometrics(false)}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={`Share FMP tool with [${client.personal_info.name}] ?`}
        description={
          <p>
            This tool helps clients track their food, mood, and physical
            patterns. <br />
            You can share this multiple times during the therapy journey.
          </p>
        }
        cancelText="Cancel"
        confirmText="Share"
        onConfirm={() => {
          shareFMP();
          setShareOpen(false);
        }}
      />

      <ConfirmModal
        isOpen={suggestOpen}
        onClose={() => setSuggestOpen(false)}
        title={"Send a request to complete missing information?"}
        description={
          <p>
            You are about to send a request to the client with a link to
            complete the Comprehensive Intake Form. <br />
            This will help build a complete and up-to-date health profile,
            ensuring more personalized and effective care. <br />
            Would you like to proceed?
          </p>
        }
        cancelText="Cancel"
        confirmText="Send"
        onConfirm={() => {
          requestHealthHistory();
          setSuggestOpen(false);
        }}
      />
    </div>
  );
};
