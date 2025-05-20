import ClockAfternoon from "shared/assets/icons/clock-afternoon";
import { ClientCard, Input, SliderCard } from "shared/ui";
import { smallCards, tableRows, tableHeaders, timelines } from "./mock";
import { MoodScore } from "widgets/MoodScore";
import InfoIcon from "shared/assets/icons/info-icon";
import { HealthGoalsCard } from "widgets/HealthGoalsCard";
import { ArrowRight, Bookmark, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "shared/ui/avatar";
import Share from "shared/assets/icons/share";
import PaperPlane from "shared/assets/icons/paper-plane";
import avatar from "shared/assets/images/Avatar.png";
import { useState } from "react";
import { TimelineItem } from "widgets/TimelineItem";

export const HealthSnapshot = () => {
  const [timelineOpen, setTimelineOpen] = useState(false);
  return (
    <main className="flex flex-col items-start gap-6 p-6 self-stretch overflow-y-auto bg-[#F1F3F5]">
      <div className="flex items-center justify-center self-stretch">
        <h1 className="flex-1 text-[#1D1D1F] font-[Nunito] text-[32px]/[44px] font-bold">
          Health Snapshot
        </h1>
        <button
          onClick={() => setTimelineOpen((prev) => !prev)}
          className="h-[44px] font-[Nunito] text-[14px]/[20px] font-semibold text-[#1C63DB] rounded-full bg-[#DDEBF6] justify-center  items-center py-[6px] px-3 flex gap-2 "
        >
          <ClockAfternoon />
          {!timelineOpen ? "Open timeline" : "Close timeline"}
        </button>
      </div>
      <div className="flex flex-col gap-4 w-full p-4 items-start rounded-2xl bg-white">
        <h1 className="self-stretch font-[Nunito] text-[24px]/[32px] font-semibold text-[#1D1D1F]">
          Weekly Trends Summary
        </h1>
        <div className="flex items-start gap-4 self-stretch">
          {smallCards.map((card) => (
            <ClientCard
              key={card.id}
              title={card.title}
              indicator={card.indicator}
              trend={card.trend}
              increased={card.increased}
            />
          ))}
          <MoodScore />
        </div>
      </div>
      <div className="flex items-start gap-6 self-stretch">
        {/* Left Side Start*/}
        <div className="flex flex-col gap-6 self-stretch flex-1 items-start">
          <div className="w-full flex flex-col gap-4 p-4 items-start rounded-2xl bg-white">
            <h1 className="self-stretch font-[Nunito] text-[24px]/[32px] font-semibold text-[#1D1D1F]">
              Active Symptoms
            </h1>
            <div className="flex gap-4 items-start self-stretch">
              <SliderCard title="Bloating" colors={["#006622", "#006622", "#006622", "#006622", "#006622", "#006622"]} />
              <SliderCard title="Brain fog" colors={["#F6B448", "#F6B448", "#F6B448", "#F6B448", "#F6B448", "#F6B448"]} />
              <SliderCard title="Joint stiffness" colors={["#AAC6EC", "#AAC6EC", "#AAC6EC", "#AAC6EC", "#AAC6EC", "#AAC6EC"]} />
            </div>
          </div>
          <div className="w-full flex flex-col gap-4 p-4 items-start rounded-2xl bg-white">
            <h1 className="self-stretch font-[Nunito] text-[24px]/[32px] font-semibold text-[#1D1D1F]">
              Health Goals
            </h1>
            <div className="flex gap-4 items-start self-stretch">
              <HealthGoalsCard name="Name 1" completed={2} outOf={5} />
              <HealthGoalsCard name="Name 2" completed={4} outOf={5} />
              <HealthGoalsCard name="Name 3" completed={0} outOf={5} />
            </div>
          </div>
          <div className="w-full flex flex-col gap-4 p-4 items-start rounded-2xl bg-white">
            <h1 className="self-stretch font-[Nunito] text-[24px]/[32px] font-semibold text-[#1D1D1F]">
              Lab & Test
            </h1>
            <div className="w-full border border-[#DDEBF6] rounded-2xl overflow-hidden bg-white">
              <table className="w-full bg-white">
                <thead className="bg-[#F3F7FD]">
                  <tr>
                    {tableHeaders.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-[14px] leading-[20px] font-semibold font-[Nunito] text-[#1D1D1F] whitespace-normal break-words"
                      >
                        {header.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y-0">
                  {tableRows.map((row, index) => (
                    <tr key={row.metric} className={index !== 0 ? "mt-2" : ""}>
                      <td className="px-4 py-4 text-[14px] leading-[20px] font-semibold font-[Nunito] text-[#1D1D1F] whitespace-normal break-words bg-white rounded-lg shadow-sm">
                        {row.metric}
                      </td>
                      <td className="px-4 py-4 text-[14px] leading-[20px] font-semibold font-[Nunito] text-[#1D1D1F] whitespace-normal break-words bg-white rounded-lg shadow-sm">
                        {row.LatestResult}
                      </td>
                      <td className="px-4 py-4 text-[14px] leading-[20px] font-semibold font-[Nunito] text-[#1D1D1F] whitespace-normal break-words bg-white rounded-lg shadow-sm">
                        {row.Testdate}
                      </td>
                      <td className="px-4 py-4 text-[14px] leading-[20px] font-semibold font-[Nunito] text-[#1D1D1F] whitespace-normal break-words bg-white rounded-lg shadow-sm">
                        {row.Status}
                      </td>
                      <td className="italic whitespace-pre-line px-4 py-4 text-[14px] leading-[20px] font-semibold font-[Nunito] text-[#1D1D1F] break-words bg-white rounded-lg shadow-sm">
                        {row.Comment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4 p-4 items-start rounded-2xl bg-white">
            <h1 className="self-stretch font-[Nunito] text-[24px]/[32px] font-semibold text-[#1D1D1F]">
              What’s Working / What’s Not
            </h1>
            <div className="flex gap-4 items-start self-stretch">
              <div className="flex items-start flex-1">
                <div className="relative flex gap-2 p-4 flex-1 items-center rounded-[10px] border border-[#BCE2C8] bg-[#F0FFF5] before:content-[''] before:absolute before:inset-y-0 before:left-0 before:w-2 before:rounded-l-[16px] before:bg-[#BCE2C8]">
                  <div className="flex flex-col gap-2 items-start flex-1">
                    <h3 className="text-[18px]/[24px] font-medium font-[Nunito] text-[#1F1F1D]">
                      Success!
                    </h3>
                    <p className="text-[14px]/[20px] font-semibold font-[Nunito] text-[#1F1F1D]">
                      Low sugar meals correlated with reduced brain fog
                    </p>
                  </div>
                  <button>
                    <ArrowRight color="#1C63DB" size={24} />
                  </button>
                </div>
              </div>
              <div className="flex items-start flex-1">
                <div className="relative flex gap-2 p-4 flex-1 items-center rounded-[10px] border border-[#FFB3AE] bg-[#FFF6F5] before:content-[''] before:absolute before:inset-y-0 before:left-0 before:w-2 before:rounded-l-[16px] before:bg-[#FFB3AE]">
                  <div className="flex flex-col gap-2 items-start flex-1">
                    <h3 className="text-[18px]/[24px] font-semibold font-[Nunito] text-[#1F1F1D]">
                      Change needs
                    </h3>
                    <p className="text-[14px]/[20px] font-medium font-[Nunito] text-[#1F1F1D]">
                      Skipping sleep routines increased cravings
                    </p>
                  </div>
                  <button>
                    <ArrowRight color="#1C63DB" size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Left Side End*/}
        {/* Right Side Start*/}
        <div className="flex flex-col gap-6 items-start h-[1318px]">
          <div className="p-6 flex flex-col gap-6 self-stretch shrink-0 w-full max-w-[516px] h-full max-h-[515px] items-start rounded-2xl bg-white">
            <h1 className="self-stretch font-[Nunito] text-[24px]/[32px] font-semibold text-[#1D1D1F]">
              Biometric Insights
            </h1>
            <div className="flex flex-col flex-1 items-start self-stretch">
              <div className="flex items-start flex-1 gap-4 self-stretch">
                <ClientCard
                  title="Sleep duration"
                  indicator="7h 12m"
                  trend="down"
                  width="226px"
                  height="120px"
                />
                <ClientCard
                  title="HRV"
                  indicator="HRV"
                  trend="up"
                  width="226px"
                  height="120px"
                />
              </div>
              <div className="flex items-start flex-1 gap-4 self-stretch">
                <ClientCard
                  title="Blood sugar levels"
                  indicator="91 mg/dL"
                  trend="up"
                  width="226px"
                  height="120px"
                />
                <ClientCard
                  title="Resting heart rate"
                  indicator="58 bpm"
                  trend="down"
                  width="226px"
                  height="120px"
                />
              </div>
              <div className="flex max-h-[120px] flex-col gap-[23px] p-6 items-start center flex-1 self-stretch rounded-2xl bg-[#F3F7FD]">
                <div className="flex items-center gap-1 self-stretch">
                  <h3 className="font-[Nunito] text-[18px]/[24px] font-semibold text-[#1D1D1F]">
                    Cycle tracking insights
                  </h3>
                  <InfoIcon />
                </div>
                <h1 className="text-[#1C63DB] text-[32px]/[44px] font-bold font-[Nunito]">
                  Luteal Phase
                </h1>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col justify-center items-start flex-1 rounded-2xl">
            <div className="w-full max-w-[516px] rounded-t-2xl bg-white flex p-6 flex-col flex-1 items-start gap-6 max-h-[620px]">
              <div className="flex flex-col gap-4 items-center justify-center self-stretch">
                <p className="font-[Nunito] text-[#1D1D1F] text-center text-[18px]/[24px] font-semibold">
                  AI Assistant
                </p>
              </div>
              <div className="flex flex-1 items-start gap-3">
                <div className="flex flex-col items-start gap-[6px] flex-1">
                  <div className="flex gap-2 items-center self-stretch">
                    <h3 className="font-[Nunito] text-[18px]/[24px] font-semibold text-[#1F1F1D]">
                      AI Assistant
                    </h3>
                    <p className="text-[14px]/[20px] font-semibold font-[Nunito] text-[#5F5F65]">
                      Today 2:20pm
                    </p>
                  </div>
                  <div className="flex py-[10px] px-[14px] items-center self-stretch gap-2 rounded-b-[8px] rounded-r-[8px] bg-[#ECEFF4]">
                    You’ve made great progress in reducing inflammation
                    <br /> markers. You might benefit from adding magnesium
                    <br /> to support recovery.
                  </div>
                  <div className="flex items-center gap-3 self-stretch">
                    <button>
                      <Bookmark color="#1C63DB" size={24} />
                    </button>
                    <button>
                      <Share />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex bg-white rounded-b-[8px] border-t-[#DDEBF6] border-t p-6 items-center gap-2 self-stretch mb-[68px]">
              <Input placeholder="Your message" />
              <button className="rounded-full bg-[#1C63DB] flex h-[44px] justify-center items-center px-[10px] py-4 ">
                <PaperPlane />
              </button>
            </div>
          </div>
        </div>
        {/* Right Side End*/}
      </div>
      {timelineOpen && (
        <div className="py-8 px-6 gap-6 flex flex-col items-center absolute right-[24px] top-[164px] rounded-2xl bg-white w-[450px] h-[740px] shadow-md">
          <div className="flex items-center justify-between self-stretch">
            <h2 className="font-[Nunito] text-[#1D1D1F] text-[24px]/[32px] font-semibold">
              Timeline
            </h2>
            <button className="font-[Nunito] text-[#1C63DB] text-[14px]/[20px] font-semibold">
              Mark all as read
            </button>
          </div>
          {timelines.map((item, index) => (
            <TimelineItem
              key={index}
              title={item.title}
              date={item.date}
              description={item.description}
              icon={<Upload className="text-[#1C63DB] w-6 h-6" />}
            />
          ))}
        </div>
      )}
    </main>
  );
};
