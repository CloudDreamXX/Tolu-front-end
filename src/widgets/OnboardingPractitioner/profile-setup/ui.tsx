import { RootState } from "entities/store";
import { updateCoachField } from "entities/store/coachOnboardingSlice";
import { DragEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePageWidth } from "shared/lib";
import { AuthPageWrapper, Input, Textarea } from "shared/ui";
import { Footer } from "../../Footer";
import { HeaderOnboarding } from "../../HeaderOnboarding";
import { SearchableSelect } from "../components/SearchableSelect";
import { timezoneOptions } from "./mock";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Calendar } from "shared/ui";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "shared/ui/popover";

export const ProfileSetup = () => {
  const dispatch = useDispatch();
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const nav = useNavigate();
  const ref = useRef<HTMLInputElement>(null);
  const state = useSelector((state: RootState) => state.coachOnboarding);
  const { isMobile } = usePageWidth();
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [localDate, setLocalDate] = useState<Date | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [displayMonth, setDisplayMonth] = useState<Date>(
    new Date(selectedYear, 0)
  );

  const handleFile = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    ref.current?.click();
  };

  // Drag and drop handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const isFormValid =
    !!state.name?.trim() && !!state.gender && !!state.timezone && !!dateOfBirth;

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setDisplayMonth((prev) => new Date(year, prev.getMonth()));
    if (localDate) {
      const d = new Date(localDate);
      d.setFullYear(year);
      setLocalDate(d);
    }
  };

  const computeAge = (dobStr: string) => {
    const dob = new Date(dobStr);
    if (Number.isNaN(dob.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const beforeBirthday =
      today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate());
    if (beforeBirthday) age--;
    return age;
  };

  const computedAge = computeAge(dateOfBirth);

  const calendarContent = (
    <>
      <div className="flex gap-[8px] items-center m-4 mb-1">
        Choose a year:
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          className="px-2 py-1 border rounded-md outline-0"
        >
          {Array.from(
            { length: 100 },
            (_, index) => new Date().getFullYear() - index
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <Calendar
        mode="single"
        selected={localDate ?? undefined}
        onSelect={(selectedDate) => {
          if (selectedDate) {
            setLocalDate(selectedDate);
            setDateOfBirth(format(selectedDate, "yyyy-MM-dd"));
            const y = selectedDate.getFullYear();
            if (y !== selectedYear) setSelectedYear(y);
            setDisplayMonth(
              new Date(selectedDate.getFullYear(), selectedDate.getMonth())
            );
            dispatch(
              updateCoachField({
                key: "age",
                value: computedAge ? computedAge : 0,
              })
            );
          }
        }}
        initialFocus
        month={displayMonth}
        onMonthChange={(m) => {
          setDisplayMonth(m);
          const y = m.getFullYear();
          if (y !== selectedYear) setSelectedYear(y);
        }}
      />
    </>
  );

  return (
    <AuthPageWrapper>
      <Footer position={isMobile ? "top-right" : undefined} />
      <HeaderOnboarding currentStep={3} />
      <main className="mx-auto flex flex-col gap-[32px] items-center justify-center lg:px-0 w-full lg:w-[859px] md:px-[24px]">
        {!isMobile && (
          <h1 className="flex text-center  text-[32px] font-medium text-black">
            Profile Setup
          </h1>
        )}
        <form className="flex flex-col w-full lg:w-[700px] overflow-y-auto py-[24px] px-[16px] md:py-[40px] md:px-[40px] bg-white rounded-t-[20px] md:rounded-[20px] shadow-md gap-[24px]">
          {isMobile && (
            <h1 className="flex text-center items-center justify-center  text-[24px] font-medium text-black">
              Profile Setup
            </h1>
          )}
          {/* First and Last Name */}
          <div className="flex flex-col flex-1 gap-[8px]">
            <label className="text-[#5F5F65] text-[16px]  font-medium">
              Full name
            </label>
            <Input
              type="text"
              placeholder="Enter Full Name"
              onChange={(e) =>
                dispatch(
                  updateCoachField({ key: "name", value: e.target.value })
                )
              }
              className="border rounded-[8px] h-[44px] px-[12px] text-[16px]"
            />
          </div>
          <div className="flex flex-col flex-1 gap-[8px]">
            <label className="text-[#5F5F65] text-[16px]  font-medium">
              Alternative name for your practice profile
            </label>
            <Input
              type="text"
              placeholder="Enter Alternative Name"
              onChange={(e) =>
                dispatch(
                  updateCoachField({ key: "last_name", value: e.target.value })
                )
              }
              className="border rounded-[8px] h-[44px] px-[12px] text-[16px]"
            />
          </div>

          <div className="flex flex-col flex-1 gap-[8px]">
            <label className="text-[#5F5F65] text-[16px]  font-medium">
              Bio
            </label>
            <Textarea
              placeholder="Enter Bio"
              onChange={(e) =>
                dispatch(
                  updateCoachField({ key: "bio", value: e.target.value })
                )
              }
              className="text-[16px] md:text-[16px] xl:text-[16px]"
              containerClassName="border rounded-[8px] h-[44px] px-[12px]"
            />
          </div>

          {/* Birth date */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#5F5F65] text-[16px]  font-medium">
              Birth Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Input
                  type="text"
                  placeholder="Select Birth Date"
                  readOnly
                  value={
                    dateOfBirth ? format(new Date(dateOfBirth), "PPP") : ""
                  }
                  className="border rounded-[8px] h-[44px] px-[12px] text-[16px]"
                />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto">
                {calendarContent}
              </PopoverContent>
            </Popover>
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#5F5F65] text-[16px]  font-medium">
              Gender
            </label>
            <div className="flex flex-col gap-[16px]">
              {[
                "woman",
                "man",
                "non-binary / genderqueer / gender expansive",
                "prefer not to say",
              ].map((gender) => (
                <label
                  key={gender}
                  className="flex items-center gap-[8px] text-[16px] text-black "
                >
                  <input
                    type="radio"
                    name="gender"
                    onChange={() =>
                      dispatch(
                        updateCoachField({ key: "gender", value: gender })
                      )
                    }
                    className="w-[20px] h-[20px]"
                  />
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-[8px]">
            <SearchableSelect
              label="Time zone"
              labelStyle="text-[#5F5F65]"
              placeholder="Search for Time Zone"
              options={timezoneOptions}
              value={state.timezone}
              onChange={(value) =>
                dispatch(updateCoachField({ key: "timezone", value: value }))
              }
            />
          </div>

          {/* Upload Profile Picture */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#5F5F65] text-[16px]  font-medium">
              Change Profile Picture
            </label>
            {filePreview ? (
              <img
                src={filePreview}
                className="w-[150px] h-[150px] rounded-[12px] object-cover"
              />
            ) : (
              <div
                className={`w-full md:w-[430px] border-[2px] border-dashed border-[#1C63DB] rounded-[12px] h-[180px] flex flex-col justify-center items-center text-center px-[20px] cursor-pointer transition-colors ${
                  dragActive ? "bg-blue-50 border-blue-400" : ""
                }`}
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <MaterialIcon
                  iconName="cloud_upload"
                  fill={1}
                  className="text-[#1C63DB] p-2 border rounded-xl"
                />
                <p className="text-[#1C63DB] text-[14px]  font-semibold mt-[8px]">
                  Click to upload
                </p>
                <p className="text-[#5F5F65] text-[14px] ">or drag and drop</p>
                <p className="text-[#5F5F65] text-[14px] ">JPG or PNG</p>
              </div>
            )}
            <input
              ref={ref}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {isMobile && (
            <div className="flex items-center gap-[16px] w-full md:w-fit">
              <button
                type="button"
                onClick={() => nav(-1)}
                className="flex w-full md:w-[250px] md:h-[44px] p-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px]  font-semibold text-[#1C63DB]"
                style={{ background: "rgba(0, 143, 246, 0.10)" }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => nav("/invite-clients")}
                disabled={!isFormValid}
                className={`flex w-full md:w-[250px] md:h-[44px] p-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px]  font-semibold ${
                  isFormValid
                    ? "bg-[#1C63DB] text-white"
                    : "bg-[#D5DAE2] text-[#5f5f65] cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </form>

        {/* Navigation buttons */}
        {!isMobile && (
          <div className="flex items-center gap-[16px] pb-10 md:pb-[100px] w-full md:w-fit">
            <button
              onClick={() => nav(-1)}
              className="flex w-full md:w-[250px] md:h-[44px] p-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px]  font-semibold text-[#1C63DB]"
              style={{ background: "rgba(0, 143, 246, 0.10)" }}
            >
              Back
            </button>
            <button
              onClick={() => nav("/invite-clients")}
              disabled={!isFormValid}
              className={`flex w-full md:w-[250px] md:h-[44px] p-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px]  font-semibold ${
                isFormValid
                  ? "bg-[#1C63DB] text-white"
                  : "bg-[#D5DAE2] text-[#5f5f65] cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </AuthPageWrapper>
  );
};
