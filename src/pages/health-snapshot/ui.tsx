import { RootState } from "entities/store";
import { ArrowRight, Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ClockAfternoon from "shared/assets/icons/clock-afternoon";
import Heartbeat from "shared/assets/icons/heartbeat";
import InfoIcon from "shared/assets/icons/info-icon";
import PaperPlane from "shared/assets/icons/paper-plane";
import Share from "shared/assets/icons/share";
import avatar from "shared/assets/images/Avatar.png";
import { ClientCard, GlucoseCard, Input, SliderCard } from "shared/ui";
import { Avatar, AvatarFallback, AvatarImage } from "shared/ui/avatar";
import { CalendarPopup } from "widgets/Calendar";
import { HealthGoalsCard } from "widgets/HealthGoalsCard";
import { HealthTable } from "widgets/HealthTable";
import { MoodScore, willModalOpen } from "widgets/MoodScore";
import { MoodModal } from "widgets/MoodScore/MoodModal";
import { TimelineItem } from "widgets/TimelineItem";
import { smallCards, timelines } from "./mock";

export const HealthSnapshot = () => {
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [networkSupportOpen, setNetworkSupportOpen] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth > 1536);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1280);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1536);
      setIsMobile(window.innerWidth < 1200);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const lastLogIn = useSelector(
    (state: RootState) => state.clientMood.lastLogIn
  );
  const lastMood = useSelector((state: RootState) => state.clientMood.lastMood);

  useEffect(() => {
    if (!lastMood || willModalOpen(lastLogIn)) {
      setShowMoodModal(true);
    }
  }, [lastMood, lastLogIn]);
  return (
    <main className="flex flex-col items-start gap-[16px] md:gap-6 p-[16px] md:p-6 self-stretch overflow-y-auto bg-[#F1F3F5]">
      {showMoodModal && <MoodModal onClose={() => setShowMoodModal(false)} />}
      {isMobile && (
        <h1 className="flex-1 text-[#1D1D1F] font-[Nunito] text-[24px] font-bold">
          Health Snapshot
        </h1>
      )}
      <div className="flex items-center self-stretch xl:justify-center">
        {!isMobile && (
          <h1 className="flex-1 text-[#1D1D1F] font-[Nunito] text-[32px]/[44px] font-bold">
            Health Snapshot
          </h1>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNetworkSupportOpen((prev) => !prev)}
            className={`md:h-[44px] w-[115px] md:w-fit font-[Nunito] text-[12px] md:text-[14px]/[20px] font-semibold text-[#1C63DB] rounded-[8px] md:rounded-full ${networkSupportOpen ? "bg-[#AAC6EC]" : "bg-[#DDEBF6]"} justify-center items-center p-[8px] md:py-[6px] md:px-3 flex flex-col md:flex-row gap-[8px] md:gap-2`}
          >
            <Heartbeat />
            Network Support
          </button>
          <button
            onClick={() => setTimelineOpen((prev) => !prev)}
            className={`md:h-[44px] w-[115px] md:w-fit font-[Nunito] text-[12px] md:text-[14px]/[20px] font-semibold text-[#1C63DB] rounded-[8px] md:rounded-full ${timelineOpen ? "bg-[#AAC6EC]" : "bg-[#DDEBF6]"} justify-center  items-center p-[8px] md:py-[6px] md:px-3 flex flex-col md:flex-row gap-[8px] md:gap-2`}
          >
            <ClockAfternoon />
            {!timelineOpen ? "Open timeline" : "Close timeline"}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full p-[16px] md:p-[24px] items-start rounded-2xl bg-white">
        <h1 className="self-stretch font-[Nunito] text-[18px] md:text-[24px]/[32px] font-semibold text-[#1D1D1F]">
          Weekly Trends Summary
        </h1>
        <div className="grid self-stretch grid-cols-2 grid-rows-2 gap-4 2xl:flex md:items-start md:gap-4">
          {smallCards.map((card) => (
            <ClientCard
              key={card.id}
              title={card.title}
              indicator={card.indicator}
              trend={card.trend}
              increased={card.increased}
            />
          ))}
          {isDesktop && <MoodScore />}
        </div>

        {!isDesktop && <MoodScore />}
      </div>
      <div className="flex items-start self-stretch w-full xl:gap-6">
        {/* Left Side Start*/}
        <div className="flex flex-col gap-[16px] md:gap-6 self-stretch flex-1 items-start w-full xl:w-fit">
          <div className="flex flex-col items-start w-full gap-4 p-4 bg-white rounded-2xl">
            <h1 className="self-stretch font-[Nunito] text-[18px] md:text-[24px]/[32px] font-semibold text-[#1D1D1F]">
              What’s Working / What’s Not
            </h1>
            <div className="flex flex-col md:flex-row gap-[8px] md:gap-4 items-start self-stretch w-full">
              <div className="flex items-start flex-1 w-full h-full xl:w-fit">
                <div className="relative flex gap-2 p-4 flex-1 items-center rounded-[10px] border border-[#BCE2C8] bg-[#F0FFF5] before:content-[''] before:absolute before:inset-y-0 before:left-0 before:w-2 before:rounded-l-[16px] before:bg-[#BCE2C8]">
                  <div className="flex flex-col items-start flex-1 w-full h-full gap-2 xl:w-fit">
                    <h3 className="text-[16px] md:text-[18px]/[24px] font-medium font-[Nunito] text-[#1F1F1D]">
                      Success!
                    </h3>
                    <p className="text-[12px] md:text-[14px]/[20px] font-semibold h-full xl:text-nowrap font-[Nunito] text-[#1F1F1D]">
                      Low sugar meals correlated with reduced brain fog
                    </p>
                  </div>
                  <button>
                    <ArrowRight color="#1C63DB" size={24} />
                  </button>
                </div>
              </div>
              <div className="flex items-start flex-1 w-full h-full xl:w-fit">
                <div className="h-full relative flex gap-2 p-4 flex-1 items-center rounded-[10px] border border-[#FFB3AE] bg-[#FFF6F5] before:content-[''] before:absolute before:inset-y-0 before:left-0 before:w-2 before:rounded-l-[16px] before:bg-[#FFB3AE]">
                  <div className="flex flex-col items-start flex-1 w-full gap-2 xl:w-fit">
                    <h3 className="text-[16px] md:text-[18px]/[24px] font-medium font-[Nunito] text-[#1F1F1D]">
                      Change needs
                    </h3>
                    <p className="text-[12px] md:text-[14px]/[20px] font-semibold xl:text-nowrap font-[Nunito] text-[#1F1F1D]">
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
          <div className="flex flex-col items-start self-stretch w-full gap-6 p-6 bg-white xl:hidden shrink-0 rounded-2xl">
            <h1 className="self-stretch font-[Nunito] text-[18px] font-semibold text-[#1D1D1F]">
              Biometric Insights
            </h1>
            <div className="flex flex-col items-start self-stretch flex-1">
              <div className="flex items-start flex-1 gap-4 self-stretch mb-[16px]">
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
              <div className="flex items-start flex-1 gap-4 self-stretch mb-[16px]">
                <GlucoseCard
                  modifiable
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
              <div className="flex max-h-[120px] flex-col gap-[23px] p-[16px] md:p-6 items-start center flex-1 self-stretch rounded-2xl bg-[#F3F7FD]">
                <div className="flex items-center self-stretch gap-1">
                  <h3 className="font-[Nunito] text-[18px]/[24px] font-semibold text-[#1D1D1F]">
                    Cycle tracking insights
                  </h3>
                  <span className="w-[20px] h-[20px]">
                    <InfoIcon />
                  </span>
                </div>
                <h1 className="text-[#1C63DB] text-[24px] md:text-[32px]/[44px] font-bold font-[Nunito]">
                  Luteal Phase
                </h1>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start w-full gap-4 p-4 bg-white rounded-2xl">
            <h1 className="self-stretch font-[Nunito] text-[18px] md:text-[24px]/[32px] font-semibold text-[#1D1D1F]">
              Active Symptoms
            </h1>
            <div className="flex flex-col items-start self-stretch gap-4 md:flex-row">
              <SliderCard
                title="Bloating"
                colors={[
                  "#006622",
                  "#006622",
                  "#006622",
                  "#006622",
                  "#006622",
                  "#006622",
                ]}
              />
              <SliderCard
                title="Brain fog"
                colors={[
                  "#F6B448",
                  "#F6B448",
                  "#F6B448",
                  "#F6B448",
                  "#F6B448",
                  "#F6B448",
                ]}
              />
              <SliderCard
                title="Joint stiffness"
                colors={[
                  "#AAC6EC",
                  "#AAC6EC",
                  "#AAC6EC",
                  "#AAC6EC",
                  "#AAC6EC",
                  "#AAC6EC",
                ]}
              />
            </div>
          </div>
          <div className="flex flex-col items-start w-full gap-4 p-4 bg-white rounded-2xl">
            <h1 className="self-stretch font-[Nunito] text-[18px] md:text-[24px]/[32px] font-semibold text-[#1D1D1F]">
              Health Goals
            </h1>
            <div className="flex flex-col items-start self-stretch gap-4 md:flex-row">
              <HealthGoalsCard name="Name 1" completed={2} outOf={5} />
              <HealthGoalsCard name="Name 2" completed={4} outOf={5} />
              <HealthGoalsCard name="Name 3" completed={0} outOf={5} />
            </div>
          </div>
          <div className="flex flex-col items-start w-full gap-4 p-4 bg-white rounded-2xl">
            <h1 className="self-stretch font-[Nunito] text-[18px] md:text-[24px]/[32px] font-semibold text-[#1D1D1F]">
              Lab & Test
            </h1>
            <div className="w-full md:border border-[#DDEBF6] rounded-2xl overflow-hidden bg-white">
              <HealthTable userType="free" />
            </div>
          </div>
        </div>
        {/* Left Side End*/}
        {/* Right Side Start*/}
        <div className="flex flex-col gap-6 items-start h-[1318px]">
          <div className="hidden xl:flex p-6 flex-col gap-6 self-stretch shrink-0 w-full max-w-[516px] h-full max-h-[515px] items-start rounded-2xl bg-white">
            <h1 className="self-stretch font-[Nunito] text-[18px] md:text-[24px]/[32px] font-semibold text-[#1D1D1F]">
              Biometric Insights
            </h1>
            <div className="flex flex-col items-start self-stretch flex-1">
              <div className="flex items-start flex-1 gap-4 self-stretch mb-[16px]">
                <ClientCard
                  title="Sleep duration"
                  indicator="7h 12m"
                  trend="down"
                  width="226px"
                  height="140px"
                />
                <ClientCard
                  title="HRV"
                  indicator="HRV"
                  trend="up"
                  width="226px"
                  height="140px"
                />
              </div>
              <div className="flex items-start flex-1 gap-4 self-stretch mb-[16px]">
                <GlucoseCard
                  modifiable
                  indicator="91 mg/dL"
                  trend="up"
                  width="226px"
                  height="140px"
                />
                <ClientCard
                  title="Resting heart rate"
                  indicator="58 bpm"
                  trend="down"
                  width="226px"
                  height="140px"
                />
              </div>
              <div className="flex max-h-[120px] flex-col gap-[23px] p-6 items-start center flex-1 self-stretch rounded-2xl bg-[#F3F7FD]">
                <div className="flex items-center self-stretch gap-1">
                  <h3 className="font-[Nunito] text-[18px]/[24px] font-semibold text-[#1D1D1F]">
                    Cycle tracking insights
                  </h3>
                  <span className="w-[20px] h-[20px]">
                    <InfoIcon />
                  </span>
                </div>
                <h1 className="text-[#1C63DB] text-[32px]/[44px] font-bold font-[Nunito]">
                  Luteal Phase
                </h1>
              </div>
            </div>
          </div>
          <div className="flex-col items-start justify-center flex-1 hidden w-full xl:flex rounded-2xl">
            <div className="w-full max-w-[516px] rounded-t-2xl bg-white flex p-6 flex-col flex-1 items-start gap-6 max-h-[620px]">
              <div className="flex flex-col items-center self-stretch justify-center gap-4">
                <Avatar>
                  <AvatarImage src={avatar} alt="Avatar" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <p className="font-[Nunito] text-[#1D1D1F] text-center text-[18px]/[24px] font-semibold">
                  AI Assistant
                </p>
              </div>
              <div className="flex items-start flex-1 gap-3">
                <div className="flex flex-col items-start gap-[6px] flex-1">
                  <div className="flex items-center self-stretch justify-between gap-2">
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
                  <div className="flex items-center self-stretch gap-3">
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
          <div className="flex items-center self-stretch justify-between">
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
              iconName={item.icon}
            />
          ))}
        </div>
      )}
      {networkSupportOpen && <CalendarPopup />}
    </main>
  );
};
