import { FoodMoodPoopJournal } from "entities/coach";
import Calendar from "shared/assets/icons/calendar";

type Props = {
  client: FoodMoodPoopJournal[];
};

const DEFAULT_SLOTS: FoodMoodPoopJournal[] = [
  { timeOfDay: "Morning", food: "", mood: "", poop: "" },
  { timeOfDay: "Mid-morning", food: "", mood: "", poop: "" },
  { timeOfDay: "Lunch", food: "", mood: "", poop: "" },
  { timeOfDay: "Snack", food: "", mood: "", poop: "" },
  { timeOfDay: "Dinner", food: "", mood: "", poop: "" },
];

const FoodMoodPoop: React.FC<Props> = ({ client }) => {
  const rows = client?.length ? client : DEFAULT_SLOTS;

  return (
    <div>
      <p className="pb-[16px] text-[#5F5F65] text-[14px] font-[500] flex items-center gap-[8px]">
        <Calendar />
        {new Intl.DateTimeFormat("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          timeZone: "Europe/Stockholm",
        }).format(new Date())}
      </p>

      <div className="max-w-5xl overflow-hidden rounded-[8px] border border-[#DBDEE1] bg-white">
        <div className="md:max-h-[286px] overflow-y-auto">
          <table className="w-full table-fixed">
            <thead className="sticky top-0 z-10 bg-[#F3F6FB]">
              <tr className="border-b border-[#DBDEE1]">
                <th className="px-[16px] py-[12px] text-left text-[20px] font-[700] text-[#1C63DB] border-r border-[#F3F6FB] rounded-tl-[8px]">
                  Food
                </th>
                <th className="px-[16px] py-[12px] text-left text-[20px] font-[700] text-[#1C63DB] border-r border-[#F3F6FB]">
                  Mood
                </th>
                <th className="px-[16px] py-[12px] text-left text-[20px] font-[700] text-[#1C63DB] rounded-tr-[8px]">
                  Poop
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((entry, index) => (
                <tr key={`${entry.timeOfDay ?? "slot"}-${index}`}>
                  <td className="align-bottom px-[16px] py-[12px] border-b">
                    <div className="mb-[4px] text-[12px] font-semibold tracking-wide text-[#5F5F65]">
                      {entry.timeOfDay || "No Time of Day"}
                    </div>
                    <div className="text-[14px] text-[#1D1D1F]">
                      {entry.food || "–"}
                    </div>
                  </td>
                  <td className="align-bottom px-[16px] py-[12px] border-b text-[14px] text-[#1D1D1F]">
                    {entry.mood || "–"}
                  </td>
                  <td className="align-bottom px-[16px] py-[12px] border-b text-[14px] text-[#1D1D1F]">
                    {entry.poop || "–"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FoodMoodPoop;
