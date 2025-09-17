import { Button } from "shared/ui";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

export const DailyJournalOverview = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1 border-b border-[#D5DAE2] pb-6">
          <p className="text-sm text-[#5F5F65]">Date of last check: </p>
          <p className="text-[14px] md:text-lg font-semibold text-[#1D1D1F]">
            May 14, 2025 4:00 pm
          </p>
        </div>
        <Button
          variant={"blue2"}
          className="hidden md:flex px-8 text-base font-semibold text-blue-700"
        >
          <MaterialIcon iconName="replay" className="text-blue-700" />
          Update
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-[#5F5F65]">Most Noticeable Symptom Today</p>
        <div className="flex items-center gap-[8px] flex-wrap">
          {["Fatigue", "Brain fog", "Hot flashes", "Headache", "Insomnia"].map(
            (item) => (
              <div
                key={item}
                className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base"
              >
                {item}
              </div>
            )
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-[#5F5F65]">Duration</p>
        <div className="flex items-center gap-[8px]">
          {["1–3 hours"].map((item) => (
            <div
              key={item}
              className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-[#5F5F65]">Suspected Triggers</p>
        <div className="flex items-center gap-[8px]">
          {["Skipping breakfast", "Poor sleep", "Gluten"].map((item) => (
            <div
              key={item}
              className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-[#5F5F65]">
          Sleep Quality (Auto-sync from Apple Watch)
        </p>
        <div className="flex items-center gap-[8px]">
          {[
            "Total sleep: 7h 40min",
            "Woke up: 3 times",
            "Fell back sleep: easy",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-[#5F5F65]">Meals & Timing</p>
        <div className="flex items-center gap-[8px]">
          {["Ate within 1 hour of waking", "Tried new food"].map((item) => (
            <div
              key={item}
              className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between md:justify-end">
        <Button
          variant={"blue2"}
          className="md:hidden flex px-[8px] text-[14px] font-semibold text-blue-700"
        >
          <MaterialIcon iconName="replay" className="text-blue-700" />
          Update results
        </Button>
        <Button variant="brightblue">See full Daily Journal</Button>
      </div>
    </div>
  );
};
