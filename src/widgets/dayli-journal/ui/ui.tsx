import { XIcon } from "@phosphor-icons/react";
import { SymptomData, SymptomsTrackerService } from "entities/symptoms-tracker";
import { Coffee, Mic, Paperclip, Salad, Utensils } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn, toast } from "shared/lib";
import {
  Button,
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/ui";
import { MoodSelector } from "widgets/MoodScore";
import {
  CalendarBlock,
  FELL_BACK_OPTIONS,
  MEAL_EXAMPLES,
  MealState,
  MOOD_COLORS,
  SLEEP_RANGES,
  SleepState,
  SUSPECTED_TRIGGERS,
  SYMPTOMS,
} from ".";

interface DayliJournalProps {
  isOpen: boolean;
  onCancel: () => void;
  onClose: () => void;
}

export const DailyJournal: React.FC<DayliJournalProps> = ({
  isOpen,
  onCancel,
  onClose,
}) => {
  const [moodValue, setMoodValue] = useState(30);
  const [sleep, setSleep] = useState<SleepState>({
    hours: 7,
    minutes: 40,
    wokeUpTimes: 3,
    fellBack: "Easy",
  });

  const [meal, setMeal] = useState<MealState>({
    notes: "",
    breakfast: { food_items: "", time: "" },
    lunch: { food_items: "", time: "" },
    dinner: { food_items: "", time: "" },
  });

  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const voiceInputRef = useRef<HTMLInputElement | null>(null);

  const [userNote, setUserNote] = useState<string>("");
  const [symptomValue, setSymptomValue] = useState<string>("");
  const [triggerValue, setTriggerValue] = useState<string>("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [durationCategory, setDurationCategory] = useState<string>("");
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedMealExamples, setSelectedMealExamples] = useState<string[]>(
    []
  );
  const [mealExampleValue, setMealExampleValue] = useState<string>("");
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<File | null>(null);
  const [summaryView, setSummaryView] = useState<boolean>(false);

  const getFormattedDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = ("0" + (today.getMonth() + 1)).slice(-2);
    const day = ("0" + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(getFormattedDate());

  const mapSleepQualityToMoodValue = (sleepQuality: string) => {
    switch (sleepQuality) {
      case "Very Poor":
        return 0;
      case "Poor":
        return 10;
      case "Fair":
        return 20;
      case "Good":
        return 40;
      case "Very Good":
        return 50;
      default:
        return 30;
    }
  };

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response =
          await SymptomsTrackerService.getSymptomByDate(selectedDate);
        const data = response.data;

        if (data === null) {
          setUserNote("");
          setSelectedSymptoms([]);
          setDurationCategory("");
          setSelectedTriggers([]);
          setMoodValue(30);
          setSleep({
            hours: 0,
            minutes: 0,
            wokeUpTimes: 0,
            fellBack: "Easy",
          });
          setMeal({
            notes: "",
            breakfast: { food_items: "", time: "" },
            lunch: { food_items: "", time: "" },
            dinner: { food_items: "", time: "" },
          });
          setSelectedMealExamples([]);
          setSummaryView(false);
        } else {
          setUserNote(data.user_notes || "");
          setSelectedSymptoms(data.symptoms || []);
          setDurationCategory(data.duration_category || "");
          setSelectedTriggers(data.suspected_triggers || []);
          setMoodValue(mapSleepQualityToMoodValue(data.sleep_quality || ""));
          setSleep({
            hours: data.sleep_hours || 0,
            minutes: data.sleep_minutes || 0,
            wokeUpTimes: data.times_woke_up || 0,
            fellBack: data.how_fell_asleep || "Easy",
          });
          setMeal({
            notes: data.meal_notes || "",
            breakfast: data.meal_details?.find(
              (meal) => meal.meal_type === "breakfast"
            ) || { food_items: "", time: "" },
            lunch: data.meal_details?.find(
              (meal) => meal.meal_type === "lunch"
            ) || { food_items: "", time: "" },
            dinner: data.meal_details?.find(
              (meal) => meal.meal_type === "dinner"
            ) || { food_items: "", time: "" },
          });
          setSelectedMealExamples(
            data.meal_notes ? data.meal_notes.split(",") : []
          );
          setSummaryView(true);
        }
      } catch (error) {
        console.error("Error fetching symptoms:", error);
        toast({
          variant: "destructive",
          title: "Failed to load symptoms data",
          description:
            "Could not retrieve your symptoms data. Please try again later.",
        });
      }
    };

    fetchSymptoms();
  }, [selectedDate]);

  const handleFileChange = (
    type: "photo" | "voice",
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    if (type === "photo") {
      setSelectedPhoto(file);
    } else if (type === "voice") {
      setSelectedVoice(file);
    }
  };

  const handleDeleteFile = (type: "photo" | "voice") => {
    if (type === "photo") {
      setSelectedPhoto(null);
      if (photoInputRef.current) {
        photoInputRef.current.value = "";
      }
    } else if (type === "voice") {
      setSelectedVoice(null);
      if (voiceInputRef.current) {
        voiceInputRef.current.value = "";
      }
    }
  };

  const handleSelect = (
    type: "symptom" | "trigger" | "mealExample",
    value: string
  ) => {
    if (type === "symptom" && value) {
      setSelectedSymptoms((prevSymptoms) => {
        if (prevSymptoms.includes(value)) {
          return prevSymptoms.filter((symptom) => symptom !== value);
        } else {
          return [...prevSymptoms, value];
        }
      });
    } else if (type === "trigger" && value) {
      setSelectedTriggers((prevTriggers) => {
        if (prevTriggers.includes(value)) {
          return prevTriggers.filter((trigger) => trigger !== value);
        } else {
          return [...prevTriggers, value];
        }
      });
    } else if (type === "mealExample" && value) {
      setSelectedMealExamples((prevMealExamples) => {
        if (prevMealExamples.includes(value)) {
          return prevMealExamples.filter((item) => item !== value);
        } else {
          return [...prevMealExamples, value];
        }
      });
    }
  };

  const handleDurationCategoryChange = (category: string) => {
    setDurationCategory(category);
  };

  const handleUserNoteChange = (note: string) => {
    setUserNote(note);
  };

  const handleSleepSelectChange = (name: keyof SleepState, value: string) => {
    setSleep((prev) => ({
      ...prev,
      [name]: name === "fellBack" ? value : Number(value),
    }));
  };

  const handleMealChange = (
    mealType: "breakfast" | "lunch" | "dinner",
    field: keyof MealState["breakfast"],
    value: string
  ) => {
    setMeal((prev) => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    const updatedSelectedSymptoms = [...selectedSymptoms];
    if (symptomValue && !updatedSelectedSymptoms.includes(symptomValue)) {
      updatedSelectedSymptoms.push(symptomValue);
    }

    const updatedSelectedTriggers = [...selectedTriggers];
    if (triggerValue && !updatedSelectedTriggers.includes(triggerValue)) {
      updatedSelectedTriggers.push(triggerValue);
    }

    const updatedSelectedMealExamples = [...selectedMealExamples];
    if (
      mealExampleValue &&
      !updatedSelectedMealExamples.includes(mealExampleValue)
    ) {
      updatedSelectedMealExamples.push(mealExampleValue);
    }
    const sleepQuality = mapMoodToSleepQuality(moodValue);

    const data: SymptomData = {
      tracking_date: selectedDate,
      user_notes: userNote,
      symptoms: updatedSelectedSymptoms,
      symptom_intensities: [],
      duration_category: durationCategory,
      suspected_triggers: updatedSelectedTriggers,
      sleep_quality: sleepQuality,
      sleep_hours: sleep.hours,
      sleep_minutes: sleep.minutes,
      times_woke_up: sleep.wokeUpTimes,
      how_fell_asleep: sleep.fellBack,
      meal_notes: updatedSelectedMealExamples.join(", "),
      meal_details: [
        {
          meal_type: "breakfast",
          food_items: meal.breakfast.food_items,
          time: meal.breakfast.time,
        },
        {
          meal_type: "lunch",
          food_items: meal.lunch.food_items,
          time: meal.lunch.time,
        },
        {
          meal_type: "dinner",
          food_items: meal.dinner.food_items,
          time: meal.dinner.time,
        },
      ],
    };

    const photo = photoInputRef.current?.files?.[0] || null;
    const voice = voiceInputRef.current?.files?.[0] || null;

    try {
      await SymptomsTrackerService.addSymptoms(data, photo, voice);
      onClose();
      setSummaryView(true);
      toast({
        title: "Symptoms were added successfully",
      });
    } catch (error) {
      console.error("Error submitting journal:", error);
      toast({
        variant: "destructive",
        title: "Failed to add symptoms",
        description:
          "Failed to add symptoms. Please check your answers and try again.",
      });
    }
  };

  const handleDateChange = (date: Date) => {
    const formattedDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    setSelectedDate(formattedDate);
  };

  const isButtonDisabled = !(
    sleep.hours &&
    sleep.minutes &&
    sleep.wokeUpTimes &&
    sleep.fellBack
  );

  const mapMoodToSleepQuality = (
    moodValue: number
  ): "Very Poor" | "Poor" | "Fair" | "Good" | "Very Good" => {
    switch (moodValue) {
      case 0:
        return "Very Poor";
      case 10:
        return "Poor";
      case 20:
        return "Fair";
      case 30:
        return "Fair";
      case 40:
        return "Good";
      case 50:
        return "Very Good";
      default:
        return "Fair";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="md:fixed md:top-0 bottom-0 right-0 lg:top-6 lg:bottom-6 lg:right-6 overflow-hidden left-auto inset-0 flex lg:max-w-[800px] w-full flex-col border lg:rounded-2xl shadow-[-6px_6px_32px_0_rgba(29,29,31,0.08)]">
      <CalendarBlock
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
      />

      <div
        className={`flex flex-col ${summaryView ? "bg-white" : "bg-[#F2F4F6] gap-6"} px-4 md:px-6 py-8 overflow-y-auto lg:max-h-[calc(100vh-288px)] md:max-h-[calc(100vh-235px)]`}
      >
        <h1
          className={`text-2xl font-semibold text-[#1D1D1F] ${summaryView ? "pb-[24px] border-b" : ""}`}
        >
          {summaryView ? "Daily Journal Overview" : "Log your journal"}
        </h1>

        {!summaryView && (
          <BlockWrapper>
            <h2 className="text-lg font-semibold text-[#1D1D1F]">
              Feel off today? Talk to me 👀
            </h2>
            <Input
              placeholder="Leave feedback about your wellness"
              className="font-semibold h-[44px] text-base"
              value={userNote}
              onChange={(e) => handleUserNoteChange(e.target.value)}
            />
            <div className="flex items-center gap-4 font-semibold">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                id="photoInput"
                onChange={(e) => handleFileChange("photo", e)}
              />
              <label htmlFor="photoInput" className="cursor-pointer">
                <Paperclip className="stroke-[1.5]" />
              </label>

              {selectedPhoto && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#5F5F65]">
                    {selectedPhoto.name}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteFile("photo")}
                  >
                    <XIcon />
                  </Button>
                </div>
              )}

              <input
                ref={voiceInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                id="voiceInput"
                onChange={(e) => handleFileChange("voice", e)}
              />
              <label htmlFor="voiceInput" className="cursor-pointer">
                <Mic className="stroke-[1.5]" />
              </label>

              {selectedVoice && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#5F5F65]">
                    {selectedVoice.name}
                  </span>
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteFile("voice")}
                  >
                    <XIcon />
                  </Button>
                </div>
              )}
            </div>
          </BlockWrapper>
        )}

        <BlockWrapper>
          <div>
            <h2 className="text-lg font-semibold text-[#1D1D1F]">
              Most Noticeable Symptom Today
            </h2>
            {!summaryView && (
              <p className="text-sm text-[#5F5F65]">
                What's been bothering you most today?
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {summaryView
              ? selectedSymptoms.map((item) => (
                  <div className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base">
                    {item}
                  </div>
                ))
              : SYMPTOMS.map((symptom) => (
                  <Button
                    variant="ghost"
                    key={symptom}
                    onClick={() => handleSelect("symptom", symptom)}
                    className={`flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base ${
                      selectedSymptoms.includes(symptom) ? "bg-[#D1E8FF]" : ""
                    }`}
                  >
                    {symptom}
                  </Button>
                ))}
          </div>

          {!summaryView && (
            <div className="flex gap-2 ">
              <Input
                placeholder="Type other symptoms here..."
                className="font-semibold h-[44px] text-base"
                value={symptomValue}
                onChange={(e) => setSymptomValue(e.target.value)}
              />
            </div>
          )}
        </BlockWrapper>

        <BlockWrapper>
          <h2 className="text-lg font-semibold text-[#1D1D1F]">Duration</h2>

          <div className="flex flex-wrap gap-2">
            {summaryView ? (
              <div className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base">
                {durationCategory}
              </div>
            ) : (
              SLEEP_RANGES.map((range) => (
                <Button
                  variant="ghost"
                  key={range.text}
                  onClick={() => handleDurationCategoryChange(range.text)}
                  className={`flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base ${
                    durationCategory === range.text ? "bg-[#D1E8FF]" : ""
                  }`}
                >
                  {range.icon} {range.text}
                </Button>
              ))
            )}
          </div>
        </BlockWrapper>

        <BlockWrapper>
          <div>
            <h2 className="text-lg font-semibold text-[#1D1D1F]">
              Suspected Triggers
            </h2>
            {!summaryView && (
              <p className="text-sm text-[#5F5F65]">
                You are the expert, think back and try to identify the trigger.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {summaryView
              ? selectedTriggers.map((item) => (
                  <div className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base">
                    {item}
                  </div>
                ))
              : SUSPECTED_TRIGGERS.map((trigger) => (
                  <Button
                    variant="ghost"
                    key={trigger}
                    onClick={() => handleSelect("trigger", trigger)}
                    className={`flex items-center justify-center p-4 bg-[#F3F7FD] rounded-md text-base ${
                      selectedTriggers.includes(trigger) ? "bg-[#D1E8FF]" : ""
                    }`}
                  >
                    {trigger}
                  </Button>
                ))}
          </div>

          {!summaryView && (
            <div className="flex gap-2 ">
              <Input
                placeholder="Type other symptoms here..."
                className="font-semibold h-[44px] text-base"
                value={triggerValue}
                onChange={(e) => setTriggerValue(e.target.value)}
              />
            </div>
          )}
        </BlockWrapper>

        <BlockWrapper>
          <h2 className="text-lg font-semibold text-[#1D1D1F]">
            Sleep Quality{" "}
            <span className="text-[#B3BCC8]">(Synced or Manual)</span>
          </h2>

          {!summaryView && (
            <div className="flex gap-2 text-[#1D1D1F] font-semibold">
              <Checkbox />{" "}
              <span>Auto-sync from Oura / Apple Watch / Garmin</span>
            </div>
          )}

          {!summaryView && (
            <MoodSelector
              value={moodValue}
              onChange={setMoodValue}
              colors={MOOD_COLORS}
            />
          )}

          {summaryView ? (
            <div className="flex items-center gap-[8px]">
              <div className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base">
                Total sleep: {String(sleep.hours)}h {String(sleep.minutes)}min
              </div>
              <div className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base">
                Woke up: {sleep.wokeUpTimes}
              </div>
              <div className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base">
                Fell back sleep: {sleep.fellBack}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700">
                  Total sleep:
                </label>
                <div className="flex items-center gap-6">
                  <div className="flex items-center space-x-2">
                    <Select
                      onValueChange={(value) =>
                        handleSleepSelectChange("hours", value)
                      }
                      value={String(sleep.hours)}
                    >
                      <SelectTrigger className="w-20 h-10">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        <SelectGroup>
                          {Array.from({ length: 24 }, (_, i) => i + 1).map(
                            (hour) => (
                              <SelectItem key={hour} value={String(hour)}>
                                {hour}
                              </SelectItem>
                            )
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <span className="text-gray-500">Hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                      onValueChange={(value) =>
                        handleSleepSelectChange("minutes", value)
                      }
                      value={String(sleep.minutes)}
                    >
                      <SelectTrigger className="w-20 h-10">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px]">
                        <SelectGroup>
                          {Array.from(
                            { length: 6 },
                            (_, i) => (i + 1) * 10
                          ).map((minute) => (
                            <SelectItem key={minute} value={String(minute)}>
                              {minute}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <span className="text-gray-500">Minutes</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700">Woke up:</label>
                <div className="flex items-center space-x-2">
                  <Select
                    onValueChange={(value) =>
                      handleSleepSelectChange("wokeUpTimes", value)
                    }
                    value={String(sleep.wokeUpTimes)}
                  >
                    <SelectTrigger className="w-20 h-10">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      <SelectGroup>
                        {Array.from({ length: 3 }, (_, i) => i + 1).map(
                          (wakeupAttempt) => (
                            <SelectItem
                              key={wakeupAttempt}
                              value={String(wakeupAttempt)}
                            >
                              {wakeupAttempt}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <span className="text-gray-500">Times</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-medium text-gray-700">
                  Fell back sleep:
                </label>
                <Select
                  onValueChange={(value) =>
                    handleSleepSelectChange("fellBack", value)
                  }
                  value={String(sleep.fellBack)}
                >
                  <SelectTrigger className="w-40 h-10">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    <SelectGroup>
                      {FELL_BACK_OPTIONS.map((mood) => (
                        <SelectItem key={mood} value={String(mood)}>
                          {mood}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </BlockWrapper>

        <BlockWrapper>
          <h2 className="text-lg font-semibold text-[#1D1D1F]">
            Meals & Timing
          </h2>

          <div className="flex flex-col gap-2 text-[#1D1D1F]">
            {!summaryView && <label className="font-medium">Examples:</label>}
            <div className="flex flex-wrap gap-2">
              {summaryView
                ? selectedMealExamples.map((item) => (
                    <div className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base">
                      {item}
                    </div>
                  ))
                : MEAL_EXAMPLES.map((mealExample) => (
                    <Button
                      variant="ghost"
                      key={mealExample}
                      onClick={() => handleSelect("mealExample", mealExample)}
                      className={`flex items-center justify-center p-4 bg-[#F3F7FD] rounded-md text-base ${
                        selectedMealExamples.includes(mealExample)
                          ? "bg-[#D1E8FF]"
                          : ""
                      }`}
                    >
                      {mealExample}
                    </Button>
                  ))}
            </div>
          </div>

          {!summaryView && (
            <div className="flex flex-col gap-2">
              <label>Notes:</label>
              <div className="flex gap-2 ">
                <Input
                  placeholder="Type some notes here..."
                  className="font-semibold h-[44px] text-base"
                  value={mealExampleValue}
                  onChange={(e) => setMealExampleValue(e.target.value)}
                />
              </div>
            </div>
          )}

          {!summaryView && (
            <div className="flex flex-col gap-4 text-[#1D1D1F]">
              <div className="flex items-center gap-2 font-medium">
                <Coffee className="stroke-[1.5]" />
                <span>Breakfast</span>
              </div>
              <div className="flex flex-wrap gap-6 md:flex-nowrap">
                <div className="flex flex-col w-full gap-2 font-medium">
                  <label>What did you eat?</label>
                  <Input
                    placeholder="Type what you ate here..."
                    className="font-semibold h-[44px] text-base"
                    value={meal.breakfast.food_items}
                    onChange={(e) =>
                      handleMealChange(
                        "breakfast",
                        "food_items",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="flex flex-col w-full gap-2 font-medium">
                  <label>At what time?</label>

                  <Select
                    onValueChange={(value) =>
                      handleMealChange("breakfast", "time", value)
                    }
                    value={meal.breakfast.time}
                  >
                    <SelectTrigger className="font-semibold h-[44px] text-base">
                      <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      <SelectGroup>
                        {[
                          "12:00 AM",
                          "1:00 AM",
                          "2:00 AM",
                          "3:00 AM",
                          "4:00 AM",
                          "5:00 AM",
                          "6:00 AM",
                          "7:00 AM",
                          "8:00 AM",
                          "9:00 AM",
                          "10:00 AM",
                          "11:00 AM",
                          "12:00 PM",
                          "1:00 PM",
                          "2:00 PM",
                          "3:00 PM",
                          "4:00 PM",
                          "5:00 PM",
                          "6:00 PM",
                          "7:00 PM",
                          "8:00 PM",
                          "9:00 PM",
                          "10:00 PM",
                          "11:00 PM",
                        ].map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {!summaryView && (
            <div className="flex flex-col gap-4 text-[#1D1D1F]">
              <div className="flex items-center gap-2 font-medium">
                <Salad className="stroke-[1.5]" />
                <span>Lunch</span>
              </div>
              <div className="flex flex-wrap gap-6 md:flex-nowrap">
                <div className="flex flex-col w-full gap-2 font-medium">
                  <label>What did you eat?</label>
                  <Input
                    placeholder="Type what you ate here..."
                    className="font-semibold h-[44px] text-base"
                    value={meal.lunch.food_items}
                    onChange={(e) =>
                      handleMealChange("lunch", "food_items", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col w-full gap-2 font-medium">
                  <label>At what time?</label>

                  <Select
                    onValueChange={(value) =>
                      handleMealChange("lunch", "time", value)
                    }
                    value={meal.lunch.time}
                  >
                    <SelectTrigger className="font-semibold h-[44px] text-base">
                      <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      <SelectGroup>
                        {[
                          "12:00 AM",
                          "1:00 AM",
                          "2:00 AM",
                          "3:00 AM",
                          "4:00 AM",
                          "5:00 AM",
                          "6:00 AM",
                          "7:00 AM",
                          "8:00 AM",
                          "9:00 AM",
                          "10:00 AM",
                          "11:00 AM",
                          "12:00 PM",
                          "1:00 PM",
                          "2:00 PM",
                          "3:00 PM",
                          "4:00 PM",
                          "5:00 PM",
                          "6:00 PM",
                          "7:00 PM",
                          "8:00 PM",
                          "9:00 PM",
                          "10:00 PM",
                          "11:00 PM",
                        ].map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {!summaryView && (
            <div className="flex flex-col gap-4 text-[#1D1D1F]">
              <div className="flex items-center gap-2 font-medium">
                <Utensils className="stroke-[1.5]" />
                <span>Dinner</span>
              </div>
              <div className="flex flex-wrap gap-6 md:flex-nowrap">
                <div className="flex flex-col w-full gap-2 font-medium">
                  <label>What did you eat?</label>
                  <Input
                    placeholder="Type what you ate here..."
                    className="font-semibold h-[44px] text-base"
                    value={meal.dinner.food_items}
                    onChange={(e) =>
                      handleMealChange("dinner", "food_items", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col w-full gap-2 font-medium">
                  <label>At what time?</label>

                  <Select
                    onValueChange={(value) =>
                      handleMealChange("dinner", "time", value)
                    }
                    value={meal.dinner.time}
                  >
                    <SelectTrigger className="font-semibold h-[44px] text-base">
                      <SelectValue placeholder="Select Time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      <SelectGroup>
                        {[
                          "12:00 AM",
                          "1:00 AM",
                          "2:00 AM",
                          "3:00 AM",
                          "4:00 AM",
                          "5:00 AM",
                          "6:00 AM",
                          "7:00 AM",
                          "8:00 AM",
                          "9:00 AM",
                          "10:00 AM",
                          "11:00 AM",
                          "12:00 PM",
                          "1:00 PM",
                          "2:00 PM",
                          "3:00 PM",
                          "4:00 PM",
                          "5:00 PM",
                          "6:00 PM",
                          "7:00 PM",
                          "8:00 PM",
                          "9:00 PM",
                          "10:00 PM",
                          "11:00 PM",
                        ].map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </BlockWrapper>

        {/* <BlockWrapper>
          <h2 className="text-lg font-semibold text-[#1D1D1F]">
            Wearable Data Summary
          </h2>

          <div className="grid grid-cols-2 gap-2">
            {snapshots.map((snapshot, index) => (
              <Snapshot
                key={snapshot.title}
                {...snapshot}
                className={
                  snapshots.length % 2 !== 0 && index === snapshots.length - 1
                    ? "col-span-2"
                    : ""
                }
              />
            ))}
          </div>
        </BlockWrapper> */}
      </div>

      <BlockWrapper className="flex flex-row items-center justify-between rounded-none md:rounded-t-none">
        <Button variant="blue2" onClick={onCancel} className="w-[128px]">
          {summaryView ? "Close" : "Cancel"}
        </Button>
        {summaryView ? (
          <Button
            variant="brightblue"
            onClick={() => setSummaryView(false)}
            className={cn("w-[128px] ", {
              "bg-[#D5DAE2] text-[#5F5F65] hover:bg-[#C4C8D4] hover:text-[#5F5F65] hover:cursor-not-allowed":
                isButtonDisabled,
            })}
          >
            Edit
          </Button>
        ) : (
          <Button
            variant="brightblue"
            onClick={handleSubmit}
            className={cn("w-[128px] ", {
              "bg-[#D5DAE2] text-[#5F5F65] hover:bg-[#C4C8D4] hover:text-[#5F5F65] hover:cursor-not-allowed":
                isButtonDisabled,
            })}
          >
            Done
          </Button>
        )}
      </BlockWrapper>
    </div>
  );
};

const BlockWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col gap-6 p-4 md:p-6 bg-white rounded-3xl",
      className
    )}
  >
    {children}
  </div>
);
