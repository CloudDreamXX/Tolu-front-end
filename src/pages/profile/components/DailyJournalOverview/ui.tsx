import { Button } from "shared/ui";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { useEffect, useState } from "react";
import { DailyJournal } from "widgets/dayli-journal";
import {
  SymptomData,
  useGetSymptomByDateQuery,
} from "entities/symptoms-tracker";
import { toast } from "shared/lib";

type Props = {
  date: string | null;
};

export const DailyJournalOverview: React.FC<Props> = ({ date }) => {
  const [isFullOpen, setIsFullOpen] = useState<boolean>(false);
  const [symptomsData, setSymptomsData] = useState<SymptomData | null>(null);

  const { data, refetch } = useGetSymptomByDateQuery(
    date ? date.split("T")[0] : "",
    {
      skip: !date,
    }
  );

  useEffect(() => {
    if (data) {
      const symptomsData: SymptomData[] = data?.data || [];
      setSymptomsData(symptomsData.length > 0 ? symptomsData[0] : null);
    }
  }, [data]);

  const handleFetchSymptoms = () => {
    if (date) {
      refetch();
      toast({ title: "Symptoms updated" });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <div className="flex flex-col gap-1 border-b border-[#D5DAE2] pb-6">
          <p className="text-sm text-[#5F5F65]">Date of last check: </p>
          <p className="text-[14px] md:text-lg font-semibold text-[#1D1D1F]">
            {date ? date.split("T")[0] : "-"}
          </p>
        </div>
        <Button
          variant={"blue2"}
          onClick={handleFetchSymptoms}
          className="hidden md:flex px-8 text-base font-semibold text-blue-700"
        >
          <MaterialIcon iconName="replay" className="text-blue-700" />
          Update
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-[#5F5F65]">Most Noticeable Symptom Today</p>
        <div className="flex items-center gap-[8px] flex-wrap">
          {symptomsData?.symptoms?.length ? (
            symptomsData.symptoms.map((item) => (
              <div
                key={item}
                className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base"
              >
                {item}
              </div>
            ))
          ) : (
            <span className="text-sm text-gray-500">No symptoms recorded</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-[#5F5F65]">Duration</p>
        <div className="flex items-center gap-[8px]">
          {symptomsData?.duration_category ? (
            <div className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base">
              {symptomsData.duration_category}
            </div>
          ) : (
            <span className="text-sm text-gray-500">No duration recorded</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-[#5F5F65]">Suspected Triggers</p>
        <div className="flex items-center gap-[8px] flex-wrap">
          {symptomsData?.suspected_triggers?.length ? (
            symptomsData.suspected_triggers.map((item) => (
              <div
                key={item}
                className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base"
              >
                {item}
              </div>
            ))
          ) : (
            <span className="text-sm text-gray-500">No triggers recorded</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-[#5F5F65]">
          Sleep Quality (Auto-sync from Apple Watch)
        </p>
        <div className="flex items-center gap-[8px] flex-wrap">
          {symptomsData?.sleep_quality ? (
            <>
              <div className="px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base">
                Sleep quality: {symptomsData.sleep_quality}
              </div>
              <div className="px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base">
                Total sleep: {symptomsData.sleep_hours ?? 0}h{" "}
                {symptomsData.sleep_minutes ?? 0}m
              </div>
              <div className="px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base">
                Woke up: {symptomsData.times_woke_up ?? 0} times
              </div>
              <div className="px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base">
                Fell back asleep: {symptomsData.how_fell_asleep || "-"}
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-500">No sleep data</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-[#5F5F65]">Meals & Timing</p>
        <div className="flex items-center gap-[8px] flex-wrap">
          {symptomsData?.meal_details?.length ? (
            symptomsData.meal_details.map((meal, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base"
              >
                {meal.meal_type} – {meal.food_items} ({meal.time})
              </div>
            ))
          ) : symptomsData?.meal_notes ? (
            <div className="px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base">
              {symptomsData.meal_notes}
            </div>
          ) : (
            <span className="text-sm text-gray-500">No meal data</span>
          )}
        </div>
      </div>

      <div className="flex justify-between md:justify-end">
        <Button
          variant={"blue2"}
          className="md:hidden flex px-[8px] text-[14px] font-semibold text-blue-700"
          onClick={handleFetchSymptoms}
        >
          <MaterialIcon iconName="replay" className="text-blue-700" />
          Update results
        </Button>
        <Button variant="brightblue" onClick={() => setIsFullOpen(true)}>
          See full Daily Journal
        </Button>
      </div>

      <DailyJournal
        isOpen={isFullOpen}
        onCancel={() => setIsFullOpen(false)}
        onClose={() => setIsFullOpen(false)}
      />
    </div>
  );
};
