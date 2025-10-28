import { HeaderOnboarding } from "../../HeaderOnboarding";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateCoachField } from "entities/store/coachOnboardingSlice";
import { AuthPageWrapper, Button, Input } from "shared/ui";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { RootState } from "entities/store";
import { useOnboardUserMutation } from "entities/user";
import { MultiSelectField } from "widgets/MultiSelectField";
import { SelectField } from "widgets/CRMSelectField";

export const AboutYourPractice = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<
    { file: File; previewUrl: string; isPdf: boolean }[]
  >([]);
  const [dragOver, setDragOver] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [otherSchoolInput, setOtherSchoolInput] = useState("");
  const [recentClients, setRecentClients] = useState("");
  const [targetClients, setTargetClients] = useState("");
  const [labsUsed, setLabsUsed] = useState("");
  const [onboardUser] = useOnboardUserMutation();

  const state = useSelector((state: RootState) => state.coachOnboarding);
  const OTHER_OPTION = "Other (please specify)";

  const schoolOptions = [
    "Functional Medicine Coaching Academy (FMCA)",
    "Institute for Integrative Nutrition (IIN)",
    "National Institute for Integrative Nutrition (NIIN)",
    "School of Applied Functional Medicine (SAFM)",
    "Functional Nutrition Alliance / FBS (FXNA)",
    "Nutritional Therapy Association (NTA)",
    "Chris Kresser Institute (ADAPT Health Coach Training)",
    "Duke Integrative Medicine",
    "Maryland University of Integrative Health (MUIH)",
    "Saybrook University",
    "Wellcoaches School of Coaching",
    "The Integrative Women’s Health Institute (IWHI)",
    "Primal Health Coach Institute",
    "Mind Body Food Institute",
    "Transformation Academy",
    "National Board for Health & Wellness Coaching (NBHWC)",
    OTHER_OPTION,
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const savedSchool = state?.school as string | string[] | undefined;

    const savedList: string[] = Array.isArray(savedSchool)
      ? savedSchool
      : (savedSchool ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);

    const nextSelected: string[] = [];
    let firstCustom: string | null = null;

    for (const val of savedList) {
      if (schoolOptions.includes(val)) {
        nextSelected.push(val);
      } else {
        nextSelected.push(OTHER_OPTION);
        firstCustom = val;
      }
    }

    setSelectedSchools(nextSelected);
    if (firstCustom) setOtherSchoolInput(firstCustom);

    setRecentClients(state?.recent_client_count || "");
    setTargetClients(state?.target_client_count || "");
    setLabsUsed(state?.uses_labs_supplements || "");
  }, [state]);

  const handleFiles = (files: FileList) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    const validFiles = Array.from(files).filter((f) =>
      allowedTypes.includes(f.type)
    );

    const previews = validFiles.map((file) => {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");
      const url = URL.createObjectURL(file);
      return { file, previewUrl: url, isPdf };
    });

    setFilePreviews((prev) => [...prev, ...previews]);
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    const updatedPreviews = [...filePreviews];
    URL.revokeObjectURL(updatedPreviews[index].previewUrl);
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setSelectedFiles(updatedFiles);
    setFilePreviews(updatedPreviews);
  };

  useEffect(() => {
    return () => {
      filePreviews.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
  }, [filePreviews]);

  const allFilled = () =>
    selectedSchools.length > 0 &&
    recentClients &&
    targetClients &&
    labsUsed &&
    selectedFiles.length > 0;

  const handleNext = async () => {
    if (!allFilled()) return;
    await onboardUser({
      data: state,
      licenseFiles: selectedFiles.length ? selectedFiles : undefined,
    }).unwrap();
    if (location.pathname.startsWith("/content-manager/create")) {
      nav("/content-manager/create", {
        state: { incompleteRoute: "/profile-setup" },
      });
    } else {
      nav("/profile-setup");
    }
  };

  const handleSchoolChange = (updated: string[]) => {
    setSelectedSchools(updated);
    const processed = updated.includes(OTHER_OPTION)
      ? updated
      : updated.map((s) => (s === OTHER_OPTION ? otherSchoolInput : s));
    dispatch(updateCoachField({ key: "school", value: processed.join(", ") }));
  };

  const handleOtherSchoolChange = (text: string) => {
    setOtherSchoolInput(text);
    const updated = selectedSchools.map((s) =>
      s === OTHER_OPTION ? text.trim() : s
    );
    dispatch(updateCoachField({ key: "school", value: updated.join(", ") }));
  };

  return (
    <AuthPageWrapper>
      {!location.pathname.startsWith("/content-manager/create") && (
        <HeaderOnboarding currentStep={2} />
      )}
      <main className="flex flex-col items-center flex-1 justify-center gap-[32px] self-stretch bg-white shadow-mdp-[40px] md:shadow-none md:bg-transparent py-[24px] px-[16px] md:p-0 rounded-t-[20px] md:rounded-0">
        {!isMobile && (
          <h1 className="flex text-center text-[32px] font-medium text-black">
            About your practice
          </h1>
        )}
        <div
          className={`w-full md:w-[684px] md:bg-white md:shadow-mdp-[40px] flex flex-col items-center md:items-start gap-[24px] md:rounded-[20px] ${
            location.pathname.startsWith("/content-manager/create")
              ? "md:h-[60vh] overflow-y-auto"
              : ""
          }`}
        >
          {isMobile && (
            <h1 className="flex text-center text-[24px] font-medium text-black">
              About your practice
            </h1>
          )}

          <div className="flex flex-col items-start w-full md:w-[620px] md:mt-[40px] md:ml-[32px] gap-2">
            <MultiSelectField
              label="Which school did you graduate from? *"
              options={schoolOptions.map((label) => ({ label }))}
              selected={selectedSchools}
              onChange={handleSchoolChange}
              className="py-[11px] px-[16px] md:rounded-[8px] text-[16px] font-medium"
              labelClassName="text-[16px] font-medium"
            />
            {selectedSchools.includes(OTHER_OPTION) && (
              <input
                type="text"
                value={otherSchoolInput}
                onChange={(e) => handleOtherSchoolChange(e.target.value)}
                placeholder="Type your school"
                className="mt-[4px] outline-none w-full h-[52px] px-[12px] border border-[#DBDEE1] rounded-[8px] bg-[#FAFAFA] text-[16px] text-[#000]"
              />
            )}
          </div>

          <div className="flex flex-col items-start w-full gap-2">
            <p className="md:ml-[32px] text-[16px] font-medium text-black">
              Upload a certificate or license *
            </p>

            <div
              onClick={triggerFileSelect}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center py-[16px] md:ml-[32px] w-full md:w-[620px] px-[24px] gap-[4px] rounded-[12px] border-[1px] border-dashed cursor-pointer transition ${
                dragOver ? "border-[#0057C2]" : "border-[#1C63DB]"
              } bg-white`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <MaterialIcon
                iconName="cloud_upload"
                fill={1}
                className="text-[#1C63DB] p-2 border rounded-xl"
              />
              <p className="text-[#1C63DB] text-[14px] font-semibold">
                Click to upload
              </p>
              <p className="text-[#5F5F65] text-[14px]">or drag and drop</p>
              <p className="text-[#5F5F65] text-[14px]">JPG or PNG</p>
            </div>

            {filePreviews.length > 0 && (
              <div className="flex gap-[16px] flex-wrap justify-start w-fit mt-4 md:ml-[32px]">
                {filePreviews.map(({ file, previewUrl, isPdf }, index) => (
                  <div key={index} className="relative w-[150px] h-[150px]">
                    {isPdf ? (
                      <iframe
                        src={previewUrl}
                        title={file.name}
                        className="w-full  rounded-md border"
                      />
                    ) : (
                      <img
                        src={previewUrl}
                        alt={`preview-${index}`}
                        className="object-cover w-full h-full rounded-md"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(index)}
                      className="absolute top-[4px] right-[4px] bg-white p-[4px] rounded-[8px] flex items-center justify-center"
                    >
                      <MaterialIcon
                        iconName="delete"
                        fill={1}
                        className="text-red-500"
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:w-[620px] md:ml-[32px]">
            <SelectField
              label="How many clients have you helped within the past 3 months? *"
              options={["0-5", "6-15", "16-30", "31-50", "50+"].map((v) => ({
                value: v,
                label: v,
              }))}
              selected={recentClients}
              onChange={(val) => {
                setRecentClients(val);
                dispatch(
                  updateCoachField({ key: "recent_client_count", value: val })
                );
              }}
              containerClassName="py-[11px] px-[16px] rounded-[8px] text-[16px] font-medium"
              labelClassName="text-[16px] font-medium"
            />
          </div>

          <div className="md:w-[620px] md:ml-[32px]">
            <SelectField
              label="How many new clients do you hope to acquire over the next 3 months? *"
              options={["0-5", "6-15", "16-30", "31-50", "50+"].map((v) => ({
                value: v,
                label: v,
              }))}
              selected={targetClients}
              onChange={(val) => {
                setTargetClients(val);
                dispatch(
                  updateCoachField({ key: "target_client_count", value: val })
                );
              }}
              containerClassName="py-[11px] px-[16px] rounded-[8px] text-[16px] font-medium"
              labelClassName="text-[16px] font-medium"
            />
          </div>

          <div className="flex flex-col md:ml-[32px] items-start self-stretch md:mb-[40px] gap-[16px]">
            <p className="text-[16px] font-medium text-black">
              Do you currently use labs or supplementation in your practice? *
            </p>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-[60px]">
              {["Yes", "No", "Planning to"].map((option) => (
                <label
                  key={option}
                  className="flex gap-[16px] items-center whitespace-nowrap"
                >
                  <Input
                    type="radio"
                    name="labs"
                    value={option}
                    checked={labsUsed === option}
                    onChange={(e) => {
                      setLabsUsed(e.target.value);
                      dispatch(
                        updateCoachField({
                          key: "uses_labs_supplements",
                          value: e.target.value,
                        })
                      );
                    }}
                    className="w-[24px] h-[24px]"
                  />
                  <span className="text-[16px] font-medium text-black">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`flex items-center gap-[8px] md:gap-[16px] w-full md:w-fit ${
            location.pathname.startsWith("/content-manager/create")
              ? ""
              : "md:pb-[100px]"
          }`}
        >
          <button
            onClick={() => nav(-1)}
            className="flex w-full md:w-[250px] md:h-[44px] p-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-semibold text-[#1C63DB]"
            style={{ background: "rgba(0, 143, 246, 0.10)" }}
          >
            Back
          </button>
          <Button
            onClick={handleNext}
            className={`flex w-full md:w-[250px] md:h-[44px] p-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-semibold ${
              allFilled()
                ? "bg-[#1C63DB] text-white"
                : "bg-[#D5DAE2] text-[#5F5F65]"
            }`}
          >
            Next
          </Button>
        </div>
      </main>
    </AuthPageWrapper>
  );
};
