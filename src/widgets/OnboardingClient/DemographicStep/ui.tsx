import { format, parseISO } from "date-fns";
import { setFormField } from "entities/store/clientOnboardingSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { RootState } from "entities/store";
import { useOnboardClientMutation } from "entities/user";
import { SelectField } from "widgets/CRMSelectField";
import { OnboardingClientLayout } from "../Layout";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import { Button, Calendar } from "shared/ui";
import { MultiSelectField } from "widgets/MultiSelectField";
import { MAP_MENOPAUSE_STAGE_TO_TOOLTIP } from "./mock";
import { toZonedTime } from "date-fns-tz";

export const DemographicStep = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const clientOnboarding = useSelector(
    (state: RootState) => state.clientOnboarding
  );

  const dateOfBirth = clientOnboarding.date_of_birth;
  const menopauseStatus = clientOnboarding.menopause_status;
  const healthConditions = clientOnboarding.health_conditions || [];
  const supportNetwork = clientOnboarding.support_network || [];

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const initialDOB = dateOfBirth
    ? toZonedTime(parseISO(dateOfBirth), timezone)
    : null;

  const [localDate, setLocalDate] = useState<Date | null>(initialDOB);

  const [selectedYear, setSelectedYear] = useState<number>(
    initialDOB ? initialDOB.getFullYear() : new Date().getFullYear()
  );

  const [localWeeklyMeals, setLocalWeeklyMeals] = useState<string[]>(
    typeof clientOnboarding.weekly_meal_choice === "string"
      ? clientOnboarding.weekly_meal_choice
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : clientOnboarding.weekly_meal_choice || []
  );

  const [onboardClient] = useOnboardClientMutation();

  const [month, setMonth] = useState<Date>(
    localDate || new Date(selectedYear, 0, 1)
  );

  useEffect(() => {
    if (localDate) {
      setMonth(new Date(localDate.getFullYear(), localDate.getMonth(), 1));
    } else {
      setMonth(new Date(selectedYear, 0, 1));
    }
  }, [selectedYear, localDate]);

  useEffect(() => {
    if (!dateOfBirth) return;
    const d = parseISO(dateOfBirth);
    if (Number.isNaN(d.getTime())) return;

    setLocalDate(d);
    setSelectedYear(d.getFullYear());
  }, [dateOfBirth, dispatch]);

  useEffect(() => {
    if (!dateOfBirth) return;
    const d = parseISO(dateOfBirth);
    if (Number.isNaN(d.getTime())) return;
    setLocalDate(d);
    dispatch(
      setFormField({
        field: "date_of_birth",
        value: format(d, "yyyy-MM-dd"),
      })
    );
  }, [dateOfBirth, dispatch]);

  const handleNext = async () => {
    const payload = {
      ...clientOnboarding,
      weekly_meal_choice: clientOnboarding.weekly_meal_choice || "",
    };

    await onboardClient({
      data: payload,
      token: token ? token : undefined,
    }).unwrap();
    if (location.pathname.startsWith("/library")) {
      nav("/library");
    } else {
      nav("/symptoms-severity");
    }
  };

  const hintBlock = (
    <div className="flex gap-4 p-4 items-center rounded-2xl bg-[#DDEBF6] w-full lg:max-w-[718px]">
      <MaterialIcon
        iconName="info"
        size={32}
        className="text-[#1C63DB]"
        fill={1}
      />
      <p className="text-[#1B2559]  text-base font-normal">
        Your information is kept private and secure. It helps me provide
        smarter, more relevant support. Visit our website for the complete{" "}
        <a
          className="text-[#1C63DB] underline"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.tolu.health/privacy-policy"
        >
          Data Privacy Policy
        </a>
      </p>
    </div>
  );

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    if (localDate) {
      const d = new Date(localDate);
      d.setFullYear(year);
      setLocalDate(d);
    }
  };

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
        month={month}
        onMonthChange={setMonth}
        selected={localDate ?? undefined}
        onSelect={(selectedDate) => {
          if (!selectedDate) return;

          setLocalDate(selectedDate);
          const isoDob = format(selectedDate, "yyyy-MM-dd");
          dispatch(
            setFormField({
              field: "date_of_birth",
              value: isoDob,
            })
          );

          const y = selectedDate.getFullYear();
          if (y !== selectedYear) setSelectedYear(y);
        }}
      />
    </>
  );

  const mealChoices = [
    "Fresh home-made food",
    "Gourmet take-out food",
    "Fast food",
  ];

  const activityLevels = [
    "Sedentary — Mostly sitting, little to no structured exercise",
    "Lightly Active — Some walking or light movement (1–2 days a week)",
    "Moderately Active — Exercise or active movement 3–4 days a week",
    "Very Active — Exercise or physical training 5–6 days a week",
    "Extremely Active — Daily intense exercise or physically demanding job",
  ];

  const sleepOptions = [
    "I hardly ever sleep well",
    "I have to use sleeping aids to fall asleep",
    "My sleep is hit or miss",
    "Most nights are fine",
    "I sleep well almost every night",
    "I sleep like a baby",
  ];

  const hydrationOptions = [
    "Poor — I rarely drink enough water, often feel thirsty",
    "Fair — I drink some water, but not consistently throughout the day",
    "Good — I usually meet my hydration needs, with occasional slips",
    "Very Good — I drink water regularly and stay hydrated most of the time",
    "Excellent — I’m fully hydrated every day without effort",
  ];

  const goalsOptions = [
    "I want a quick fix",
    "I want long-lasting solutions",
    "I want to manage my symptoms on my own",
    "I want to know my body better",
  ];

  const menopauseStages = [
    "Premenopause",
    "Perimenopause",
    "Menopause",
    "Postmenopause",
    "Not sure",
  ];

  const conditions = [
    "Cancer",
    "Diabetes",
    "Heart disease",
    "Stroke",
    "Hypertension",
    "Thyroid disorders",
    "Autoimmune disease",
    "Osteoporosis",
    "Alzheimer’s / Dementia",
    "Depression / Mental health conditions",
    "None",
  ];

  const supportPeople = [
    "Partner",
    "Doctor",
    "Therapist",
    "Coach",
    "Friends / Community",
    "Online groups",
    "No one right now",
  ];

  const stressLevels = ["Low", "Moderate", "High", "Very High"];

  const isFormValid =
    !!dateOfBirth &&
    !!menopauseStatus &&
    !!clientOnboarding.stress_levels &&
    !!clientOnboarding.weekly_meal_choice &&
    !!clientOnboarding.physical_activity &&
    !!clientOnboarding.sleep_quality &&
    !!clientOnboarding.hydration_levels &&
    !!clientOnboarding.main_transition_goal &&
    healthConditions.length > 0 &&
    supportNetwork.length > 0;

  return (
    <OnboardingClientLayout
      currentStep={0}
      numberOfSteps={0}
      headerText=" "
      title={
        <div className="flex flex-col gap-4">
          <h1 className="text-[#1D1D1F] text-[24px] text-center">
            A few questions to rate your lifestyle skillset & tailor your <br />
            support.
          </h1>
        </div>
      }
      children={
        <div className={`flex flex-col gap-6 w-full`}>
          {/* Birth Date */}
          <div className="flex flex-col gap-[10px] items-start w-full">
            <label className=" text-[#1D1D1F] text-[16px]/[22px] font-medium">
              Birth Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start items-start text-left font-normal border-[#DFDFDF] hover:bg-white py-[12.5px] text-[16px] h-[51px]",
                    !localDate && "text-muted-foreground"
                  )}
                >
                  <MaterialIcon iconName="calendar_today" fill={1} size={20} />
                  {localDate ? format(localDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 pointer-events-auto z-[2147483647] bg-white shadow-lg rounded-md"
                align="start"
                avoidCollisions={false}
                sticky="always"
                side="bottom"
              >
                {calendarContent}
              </PopoverContent>
            </Popover>
          </div>

          {/* Menopause Stage */}
          <SelectField
            label="Stage in Menopause Transition"
            selected={menopauseStatus || ""}
            onChange={(val) =>
              dispatch(setFormField({ field: "menopause_status", value: val }))
            }
            options={menopauseStages.map((m) => ({
              label: m,
              value: m,
              tooltip: MAP_MENOPAUSE_STAGE_TO_TOOLTIP[m],
            }))}
            containerClassName="py-[11px] px-[16px] rounded-[8px] text-[16px] font-medium"
            labelClassName="text-[16px] font-medium"
          />

          {/* Conditions (multi-choice simplified) */}
          <MultiSelectField
            label="Do you have or had any of these conditions? Select more than one if applicable."
            options={conditions.map((c) => ({ label: c }))}
            selected={healthConditions}
            onChange={(vals) =>
              dispatch(
                setFormField({
                  field: "health_conditions",
                  value: vals,
                })
              )
            }
            className="py-[11px] px-[16px] md:rounded-[8px] text-[16px] font-medium"
            labelClassName="text-[16px] font-medium"
          />

          {/* Stress Levels */}
          <SelectField
            label="Stress Levels"
            selected={clientOnboarding.stress_levels || ""}
            onChange={(val) =>
              dispatch(setFormField({ field: "stress_levels", value: val }))
            }
            options={stressLevels.map((s) => ({ label: s, value: s }))}
            containerClassName="py-[11px] px-[16px] rounded-[8px] text-[16px] font-medium"
            labelClassName="text-[16px] font-medium"
          />

          {/* Meal Choice */}
          <MultiSelectField
            label="What is your weekly to-go meal choice?"
            selected={localWeeklyMeals}
            onChange={(vals) => {
              setLocalWeeklyMeals(vals);
              const joined = vals.join(", ");
              dispatch(
                setFormField({ field: "weekly_meal_choice", value: joined })
              );
            }}
            options={mealChoices.map((c) => ({ label: c, value: c }))}
            className="py-[11px] px-[16px] md:rounded-[8px] text-[16px] font-medium"
            labelClassName="text-[16px] font-medium"
          />

          {/* Support Network */}
          <MultiSelectField
            label="Who's your trusted person to rely on (if anyone)?"
            options={supportPeople.map((p) => ({ label: p }))}
            selected={supportNetwork}
            onChange={(vals) =>
              dispatch(
                setFormField({
                  field: "support_network",
                  value: vals,
                })
              )
            }
            className="py-[11px] px-[16px] md:rounded-[8px] text-[16px] font-medium"
            labelClassName="text-[16px] font-medium"
          />

          {/* Physical Activity */}
          <SelectField
            label="How do you rate your physical activity during the week?"
            selected={clientOnboarding.physical_activity || ""}
            onChange={(val) =>
              dispatch(setFormField({ field: "physical_activity", value: val }))
            }
            options={activityLevels.map((lvl) => ({ label: lvl, value: lvl }))}
            containerClassName="py-[11px] px-[16px] rounded-[8px] text-[16px] font-medium"
            labelClassName="text-[16px] font-medium"
          />

          {/* Sleep Quality */}
          <SelectField
            label="How do you rate your sleep quality?"
            selected={clientOnboarding.sleep_quality || ""}
            onChange={(val) =>
              dispatch(setFormField({ field: "sleep_quality", value: val }))
            }
            options={sleepOptions.map((opt) => ({ label: opt, value: opt }))}
            containerClassName="py-[11px] px-[16px] rounded-[8px] text-[16px] font-medium"
            labelClassName="text-[16px] font-medium"
          />

          {/* Hydration */}
          <SelectField
            label="How do you rate your daily hydration efforts?"
            selected={clientOnboarding.hydration_levels || ""}
            onChange={(val) =>
              dispatch(setFormField({ field: "hydration_levels", value: val }))
            }
            options={hydrationOptions.map((opt) => ({
              label: opt,
              value: opt,
            }))}
            containerClassName="py-[11px] px-[16px] rounded-[8px] text-[16px] font-medium"
            labelClassName="text-[16px] font-medium"
          />

          {/* Goals */}
          <SelectField
            label="What are you hoping to achieve with Tolu AI?"
            selected={clientOnboarding.main_transition_goal || ""}
            onChange={(val) =>
              dispatch(
                setFormField({ field: "main_transition_goal", value: val })
              )
            }
            options={goalsOptions.map((opt) => ({ label: opt, value: opt }))}
            containerClassName="py-[11px] px-[16px] rounded-[8px] text-[16px] font-medium"
            labelClassName="text-[16px] font-medium"
          />
        </div>
      }
      buttons={
        <>
          {hintBlock}
          <button
            onClick={handleNext}
            disabled={!isFormValid}
            className={cn(
              "p-4 w-full md:w-[128px] h-[44px] flex items-center justify-center rounded-full text-base font-semibold",
              isFormValid
                ? "bg-[#1C63DB] text-white"
                : "bg-[#D5DAE2] text-[#5F5F65] cursor-not-allowed"
            )}
          >
            Continue
          </button>
        </>
      }
    />
  );
};
