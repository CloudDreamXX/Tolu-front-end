import React, { useEffect, useState } from "react";
import Close from "shared/assets/icons/close";
import { usePageWidth } from "shared/lib";

interface SymptomCheckModalProps {
  isOpen: boolean;
  onStepModalOpen?: () => void;
  onClose: () => void;
}

export const SymptomCheckCalendarModal: React.FC<SymptomCheckModalProps> = ({
  isOpen,
  onStepModalOpen,
  onClose,
}) => {
  const { isMobile } = usePageWidth();
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(
    null
  );
  const [weekDates, setWeekDates] = useState<Date[]>([]);

  useEffect(() => {
    const today = new Date();
    const start = new Date(today);
    const day = start.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + mondayOffset);

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });

    setWeekDates(days);
  }, []);

  if (!isOpen) return null;

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div
      className="fixed top-[69px] md:top-0 inset-0 z-10 flex items-end md:items-center justify-center"
      style={{
        background: isMobile ? "#F2F4F6" : "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
    >
      <div className="flex flex-col bg-white rounded-[18px] w-full md:w-[500px] p-6 md:p-8 text-center shadow-lg relative xl:w-[742px]">
        <h2 className="text-[20px] md:text-[24px] font-bold text-[#1D1D1F] mb-6 text-left">
          Choose day
        </h2>

        <div className="rounded-[8px] overflow-hidden border border-[#ECEFF4] mb-6">
          <div className="grid grid-cols-7 gap-2 text-[16px] font-[500] text-[#5F5F65] py-[9px] border-b border-[#ECEFF4] bg-[#F3F7FD]">
            {weekdays.map((day, i) => (
              <div key={i} className="text-center">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 py-[8px]">
            {weekDates.map((date, i) => {
              const isSelected = i === selectedDateIndex;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDateIndex(i)}
                  className={`text-center py-[6px] rounded-full font-semibold text-[16px] ${
                    isSelected
                      ? "bg-[#ECEFF4] text-[#1D1D1F] font-semibold"
                      : "text-[#1D1D1F] hover:bg-[#ECEFF4]"
                  }`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            className="w-full md:w-[128px] py-[11px] px-[24px] bg-[#DDEBF6] text-[#1C63DB] font-semibold text-[16px] rounded-full"
          >
            Cancel
          </button>
          <button
            onClick={onStepModalOpen}
            disabled={selectedDateIndex === null}
            className={`w-full md:w-[128px] py-[11px] px-[24px] text-white font-semibold text-[16px] rounded-full ${
              selectedDateIndex !== null
                ? "bg-[#1C63DB] hover:bg-[#1750b6]"
                : "bg-[#a9c4f0] cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>

        {!isMobile && (
          <button
            onClick={onClose}
            className="absolute text-gray-400 top-4 right-4 hover:text-black"
          >
            <Close />
          </button>
        )}
      </div>
    </div>
  );
};
