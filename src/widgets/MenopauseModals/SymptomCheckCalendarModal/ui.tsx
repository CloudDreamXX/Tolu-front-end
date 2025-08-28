import { useEffect, useMemo, useRef, useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

interface SymptomCheckModalProps {
  handleDateChange: (date: Date) => void;
  isOpen: boolean;
  onStepModalOpen?: () => void;
  onClose: () => void;
}

type DayCell = { date: Date; inMonth: boolean; isToday: boolean };

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getMonthGrid(year: number, month: number): DayCell[] {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);
  const cells: DayCell[] = [];
  const todayStr = new Date().toDateString();

  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    cells.push({
      date: d,
      inMonth: d.getMonth() === month,
      isToday: d.toDateString() === todayStr,
    });
  }
  return cells;
}

function shiftMonth(year: number, month: number, delta: number) {
  const m = month + delta;
  const y = year + Math.floor(m / 12);
  const mm = ((m % 12) + 12) % 12;
  return { year: y, month: mm };
}

export const SymptomCheckCalendarModal: React.FC<SymptomCheckModalProps> = ({
  handleDateChange,
  isOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const today = useMemo(() => new Date(), []);
  const [selected, setSelected] = useState<Date | null>(null);

  const [viewYear, setViewYear] = useState<number>(today.getFullYear());
  const [startMonth, setStartMonth] = useState<number>(
    Math.max(0, today.getMonth() - 1)
  );

  const monthRefs = useRef<(HTMLDivElement | null)[]>([]);

  const monthsToRender = useMemo(() => {
    return [0, 1, 2].map((i) => shiftMonth(viewYear, startMonth, i));
  }, [viewYear, startMonth]);

  const yearOptions = useMemo(() => {
    const y = today.getFullYear();
    const arr: number[] = [];
    for (let i = y - 60; i <= y + 40; i++) arr.push(i);
    return arr;
  }, [today]);

  if (!isOpen) return null;

  const onPick = (d: Date) => {
    setSelected(d);
    handleDateChange(d);
  };

  const jumpToToday = () => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);

    setSelected(t);
    handleDateChange(t);

    setViewYear(t.getFullYear());
    setStartMonth(Math.max(0, t.getMonth() - 1));

    requestAnimationFrame(() => {
      monthRefs.current[1]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const prevGroup = () => {
    const { year, month } = shiftMonth(viewYear, startMonth, -3);
    setViewYear(year);
    setStartMonth(month);
  };
  const nextGroup = () => {
    const { year, month } = shiftMonth(viewYear, startMonth, +3);
    setViewYear(year);
    setStartMonth(month);
  };

  return (
    <div
      className="fixed inset-0 z-10 flex items-end justify-center md:items-center"
      style={{
        background: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
    >
      <div className="flex flex-col bg-white rounded-t-[18px] md:rounded-[18px] w-full md:w-[650px] p-6 text-left shadow-lg relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px] md:text-[24px] font-bold text-[#1D1D1F]">
            Calendar
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black">
            <MaterialIcon iconName="close" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={prevGroup}
              className="h-[44px] w-[44px] rounded-[8px] bg-[#DDEBF6] flex items-center justify-center"
              aria-label="Previous months"
            >
              <MaterialIcon iconName="keyboard_arrow_left" />
            </button>

            <div className="flex items-center gap-2 border border-[#DFDFDF] rounded-[8px] px-4 py-2.5 h-[44px]">
              <MaterialIcon iconName="calendar_today" fill={1} />

              <select
                className="appearance-none bg-transparent bg-none outline-none text-[16px] font-medium cursor-pointer"
                value={viewYear}
                onChange={(e) => {
                  const y = Number(e.target.value);
                  setViewYear(y);
                  setStartMonth((m) => m);
                }}
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={nextGroup}
              className="h-[44px] w-[44px] rounded-[8px] bg-[#DDEBF6] flex items-center justify-center"
              aria-label="Next months"
            >
              <MaterialIcon iconName="keyboard_arrow_right" />
            </button>
          </div>

          <button
            onClick={jumpToToday}
            className="px-4 py-3 rounded-full bg-[#E7F0FF] text-[#1C63DB] text-[14px] font-semibold hover:bg-[#d7e7ff]"
          >
            Today
          </button>
        </div>

        <div className="rounded-[12px] overflow-hidden">
          <div className="grid grid-cols-7 text-[14px] font-medium text-[#5F5F65] py-2">
            {WEEKDAYS.map((w) => (
              <div key={w} className="text-center">
                {w}
              </div>
            ))}
          </div>

          <div className="max-h-[55vh] xl:max-h-[70vh] overflow-auto">
            {monthsToRender.map(({ year, month }, idx) => {
              const cells = getMonthGrid(year, month);
              return (
                <div
                  key={`${year}-${month}`}
                  ref={(el) => (monthRefs.current[idx] = el)}
                  className={idx !== 0 ? "border-t border-[#ECEFF4]" : ""}
                >
                  <div className="px-4 py-3 text-[18px] font-semibold text-[#1D1D1F] text-center">
                    {MONTHS[month]} {year}
                  </div>

                  <div className="grid grid-cols-7 px-2 pb-4 gap-y-1">
                    {cells.map((c, i) => {
                      const isSelected = selected
                        ? c.date.toDateString() === selected.toDateString()
                        : false;

                      return (
                        <button
                          key={i}
                          onClick={() => onPick(c.date)}
                          className={[
                            "h-[34px] rounded-full text-[16px] flex items-center justify-center",
                            c.inMonth ? "text-[#1D1D1F]" : "text-[#9AA0A6]",
                            isSelected
                              ? "bg-[#1C63DB] text-white font-semibold"
                              : "hover:bg-[#ECEFF4]",
                          ].join(" ")}
                          aria-label={c.date.toDateString()}
                        >
                          {c.date.getDate()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
