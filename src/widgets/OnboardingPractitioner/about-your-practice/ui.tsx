import { HeaderOnboarding } from "../../HeaderOnboarding";
import { Footer } from "../../Footer";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCoachField } from "entities/store/coachOnboardingSlice";
import { AuthPageWrapper, Input } from "shared/ui";
import { SearchableSelect } from "../components/SearchableSelect";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

export const AboutYourPractice = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<
    { file: File; previewUrl: string }[]
  >([]);
  const [dragOver, setDragOver] = useState(false);

  const [school, setSchool] = useState("");
  const [recentClients, setRecentClients] = useState("");
  const [targetClients, setTargetClients] = useState("");
  const [labsUsed, setLabsUsed] = useState("");
  const nav = useNavigate();
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false);
  const [otherSchoolInput, setOtherSchoolInput] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allFilled = () => {
    return (
      selectedSchools.length > 0 &&
      recentClients.length > 0 &&
      targetClients.length > 0 &&
      labsUsed.length > 0 &&
      selectedFiles.length > 0
    );
  };

  const isValidFile = (file: File) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  const handleFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter(isValidFile);
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreviews((prev) => [
          ...prev,
          { file, previewUrl: reader.result as string },
        ]);
        setSelectedFiles((prev) => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = [...selectedFiles];
    const updatedPreviews = [...filePreviews];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setSelectedFiles(updatedFiles);
    setFilePreviews(updatedPreviews);
  };

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case "school":
        setSchool(value);
        dispatch(updateCoachField({ key: "school", value }));
        break;
      case "recent":
        setRecentClients(value);
        dispatch(updateCoachField({ key: "recent_client_count", value }));
        break;
      case "target":
        setTargetClients(value);
        dispatch(updateCoachField({ key: "target_client_count", value }));
        break;
      case "labs":
        setLabsUsed(value);
        dispatch(updateCoachField({ key: "uses_labs_supplements", value }));
        break;
    }
  };

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
    "Other (please specify)",
  ];

  const OTHER_OPTION = "Other (please specify)";

  return (
    <AuthPageWrapper>
      <Footer position={isMobile ? "top-right" : undefined} />
      <HeaderOnboarding currentStep={2} />
      <main className="flex flex-col items-center flex-1 justify-center gap-[32px] self-stretch bg-white shadow-mdp-[40px] md:shadow-none md:bg-transparent py-[24px] px-[16px] md:p-0 rounded-t-[20px] md:rounded-0">
        {!isMobile && (
          <h1 className="flex text-center font-inter text-[32px] font-medium text-black">
            About your practice
          </h1>
        )}
        <div className="w-full md:w-[700px] md:bg-white md:shadow-mdp-[40px] flex flex-col items-center md:items-start gap-[24px] md:rounded-[20px]">
          {isMobile && (
            <h1 className="flex text-center font-inter text-[24px] font-medium text-black">
              About your practice
            </h1>
          )}
          {/* School */}
          <div className="flex flex-col items-start self-stretch md:mt-[40px] md:ml-[32px] w-full md:w-[620px] relative">
            <label className="font-[Nunito] text-[16px] font-medium text-[#1D1D1F] mb-2 block">
              Which school did you graduate from? *
            </label>

            <div
              className={`peer w-full py-[11px] px-[16px] pr-[40px] rounded-[8px] border bg-white outline-none ${
                schoolDropdownOpen ? "border-[#1C63DB]" : "border-[#DFDFDF]"
              }`}
              onClick={() => setSchoolDropdownOpen((prev) => !prev)}
            >
              <div className="flex flex-wrap gap-[8px]">
                {selectedSchools.length === 0 && (
                  <span className="text-[#5F5F65]">
                    Select one or more schools
                  </span>
                )}
                {selectedSchools.map((school, idx) => (
                  <span
                    key={idx}
                    className="border border-[#CBCFD8] px-[16px] py-[6px] rounded-[6px] flex items-center gap-2"
                  >
                    {school}
                    <button
                      type="button"
                      className="ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = selectedSchools.filter(
                          (s) => s !== school
                        );
                        setSelectedSchools(updated);

                        const processed = updated.map((s) =>
                          s === OTHER_OPTION ? otherSchoolInput : s
                        );
                        dispatch(
                          updateCoachField({ key: "school", value: processed })
                        );

                        if (school === OTHER_OPTION) {
                          setShowOtherInput(false);
                          setOtherSchoolInput("");
                        }
                      }}
                    >
                      &times;
                    </button>
                  </span>
                ))}
                <div
                  className={`pointer-events-none absolute right-4 top-[48px] transition-transform duration-300 ${
                    schoolDropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.7667 6.33422C11.4542 6.0218 10.9477 6.0218 10.6353 6.33422L8.00098 8.96853L5.36666 6.33422C5.05424 6.0218 4.54771 6.0218 4.23529 6.33422C3.92287 6.64664 3.92287 7.15317 4.23529 7.46559L7.43529 10.6656C7.74771 10.978 8.25424 10.978 8.56666 10.6656L11.7667 7.46559C12.0791 7.15317 12.0791 6.64664 11.7667 6.33422Z"
                      fill="#1D1D1F"
                    />
                  </svg>
                </div>
              </div>

              {schoolDropdownOpen && (
                <div className="absolute top-full mt-1 left-0 z-10 w-full max-h-[174px] overflow-y-auto scrollbar-hide bg-[#FAFAFA] rounded-md shadow-md flex flex-col gap-[8px]">
                  {schoolOptions.map((option) => {
                    const isSelected = selectedSchools.includes(option);
                    return (
                      <div
                        key={option}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (option === OTHER_OPTION) {
                            if (!isSelected) {
                              const updated = [...selectedSchools, option];
                              setSelectedSchools(updated);
                              setShowOtherInput(true);
                              dispatch(
                                updateCoachField({
                                  key: "school",
                                  value: [
                                    ...updated.map((s) =>
                                      s === OTHER_OPTION ? otherSchoolInput : s
                                    ),
                                  ].join(", "),
                                })
                              );
                            }
                            setSchoolDropdownOpen(false);
                            return;
                          }

                          const updated = isSelected
                            ? selectedSchools.filter((s) => s !== option)
                            : [...selectedSchools, option];

                          setSelectedSchools(updated);

                          const processed = updated.map((s) =>
                            s === OTHER_OPTION ? otherSchoolInput : s
                          );

                          dispatch(
                            updateCoachField({
                              key: "school",
                              value: processed.join(", "),
                            })
                          );
                        }}
                        className="cursor-pointer px-[12px] py-[15px] hover:bg-[#F2F2F2] hover:text-[#1C63DB] flex items-center gap-[12px]"
                      >
                        <span className="w-[20px] h-[20px] flex items-center justify-center">
                          <MaterialIcon
                            iconName={
                              isSelected ? "check" : "check_box_outline_blank"
                            }
                          />
                        </span>
                        {option}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {showOtherInput && (
              <div className="w-full mt-2">
                <input
                  type="text"
                  value={otherSchoolInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setOtherSchoolInput(value);

                    const updatedSchools = selectedSchools.map((s) =>
                      s === OTHER_OPTION ? value : s
                    );

                    const processed = updatedSchools.join(", ");

                    dispatch(
                      updateCoachField({ key: "school", value: processed })
                    );
                  }}
                  placeholder="Type your school"
                  className="peer w-full py-[11px] px-[16px] pr-[40px] rounded-[8px] border border-[#DFDFDF] bg-white outline-none placeholder-[#5F5F65] focus:border-[#1C63DB]"
                />
              </div>
            )}
          </div>

          {/* File Upload Section */}
          <div className="flex flex-col items-start w-full gap-2">
            <p className="md:ml-[32px] font-[Nunito] text-[16px] font-medium text-black">
              Upload a certificate or license *
            </p>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className={`flex py-[16px] md:ml-[32px] w-full md:w-[620px] px-[24px] gap-[4px] flex-col items-center justify-center rounded-[12px] border-[1px] border-dashed ${dragOver ? "border-[#0057C2]" : "border-[#1C63DB]"} bg-white cursor-pointer transition`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-[8px]">
                <MaterialIcon iconName="upload" size={48} />
                <p className="text-[#1C63DB] font-[Nunito] text-[14px] font-semibold">
                  Click to upload
                </p>
                <p className="text-[#5F5F65] font-[Nunito] text-[14px]">
                  or drag and drop
                </p>
                <p className="text-[#5F5F65] font-[Nunito] text-[14px]">
                  PDF, JPG or PNG
                </p>
              </div>
            </div>

            {/* File previews */}
            {filePreviews.length > 0 && (
              <div className="flex gap-[16px] flex-wrap justify-start w-full mt-4 md:ml-[32px]">
                {filePreviews.map(({ file, previewUrl }, index) => {
                  const isPDF = file.type === "application/pdf";
                  return (
                    <div key={index} className="relative w-[150px] h-[150px]">
                      <img
                        src={isPDF ? "" : previewUrl}
                        alt={`preview-${index}`}
                        className="object-cover w-full h-full rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteFile(index)}
                        className="absolute top-[4px] right-[4px] bg-white p-[4px] rounded-[8px] flex items-center justify-center text-sm"
                      >
                        <MaterialIcon iconName="delete" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex w-full md:ml-[32px] text-[#1C63DB] gap-2 items-center">
            <MaterialIcon iconName="lightbulb" />
            <p className="font-[Nunito] text-[16px] font-medium ">
              Data is securely saved with a HIPAA-compliant notice
            </p>
          </div>
          {/* Recent clients */}
          <div className="flex flex-col items-start self-stretch gap-[16px] md:ml-[32px]">
            <SearchableSelect
              width="w-full md:w-[620px]"
              label="How many clients have you helped within the past 3 months? *"
              options={["0-5", "6-15", "16-30", "31-50", "50+"]}
              value={school}
              onChange={(value) => handleFieldChange("recent", value)}
            />
          </div>

          {/* Target clients */}
          <div className="flex flex-col items-start self-stretch gap-[16px] md:ml-[32px]">
            <SearchableSelect
              width="w-full md:w-[620px]"
              label="How many new clients do you hope to acquire over the next 3
              months? *"
              options={["0-5", "6-15", "16-30", "31-50", "50+"]}
              value={school}
              onChange={(value) => handleFieldChange("target", value)}
            />
          </div>

          {/* Radio - uses labs/supplements */}
          <div className="flex flex-col md:ml-[32px] items-start self-stretch md:mb-[40px] gap-[16px]">
            <p className="font-[Nunito] text-[16px] font-medium text-black">
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
                    onChange={(e) => handleFieldChange("labs", e.target.value)}
                    className="w-[24px] h-[24px] md:w-[20px] md:h-[20px]"
                  />
                  <span className="font-[Nunito] text-[16px] font-medium text-black">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div
          className={`flex items-center gap-[8px] md:gap-[16px] w-full md:w-fit md:pb-[100px]`}
        >
          <button
            onClick={() => nav(-1)}
            className="flex w-full md:w-[250px] md:h-[44px] p-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-[#1C63DB]"
            style={{ background: "rgba(0, 143, 246, 0.10)" }}
          >
            Back
          </button>
          <Link
            to={allFilled() ? "/subscription-plan" : ""}
            className={`flex w-full md:w-[250px] md:h-[44px] p-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold ${
              allFilled()
                ? "bg-[#1C63DB] text-white"
                : "bg-[#D5DAE2] text-[#5F5F65]"
            }`}
          >
            Next
          </Link>
        </div>
      </main>
    </AuthPageWrapper>
  );
};
