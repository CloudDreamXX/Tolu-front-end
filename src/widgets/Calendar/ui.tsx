import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
  Clock,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  startOfMonth,
  startOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  format,
} from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "shared/ui/dialog";

interface EventItem {
  date: string;
  time: string;
  text: string;
  note?: string;
}

export const CalendarPopup = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 4, 1));
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEventName, setNewEventName] = useState("");
  const [newEventTime, setNewEventTime] = useState("09:00 AM");
  const [newEventNote, setNewEventNote] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });

  const handleAddEvent = () => {
    if (!selectedDate || !newEventName.trim()) return;

    const updatedEvents = [...events];
    const eventData = {
      date: selectedDate,
      time: newEventTime,
      text: newEventName.trim(),
      note: newEventNote.trim(),
    };

    if (editIndex !== null) {
      updatedEvents[editIndex] = eventData;
    } else {
      updatedEvents.push(eventData);
    }

    setEvents(updatedEvents);
    resetModal();
  };

  const handleEditEvent = (event: EventItem, index: number) => {
    setNewEventName(event.text);
    setNewEventTime(event.time);
    setNewEventNote(event.note || "");
    setSelectedDate(event.date);
    setEditIndex(index);
    setShowModal(true);
  };

  const handleDeleteEvent = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteEvent = () => {
    if (editIndex !== null) {
      const updated = [...events];
      updated.splice(editIndex, 1);
      setEvents(updated);
    }
    setShowDeleteConfirm(false);
    resetModal();
  };

  const resetModal = () => {
    setShowModal(false);
    setNewEventName("");
    setNewEventTime("09:00 AM");
    setNewEventNote("");
    setSelectedDate(null);
    setEditIndex(null);
  };

  const dayGrid = [];
  let day = startDate;

  for (let i = 0; i < 42; i++) {
    const dateStr = format(day, "yyyy-MM-dd");
    const dayEvents = events.filter((e) => e.date === dateStr);

    dayGrid.push(
      <button
        key={i}
        onClick={() => {
          setSelectedDate(dateStr);
          setShowModal(true);
        }}
        className={`overflow-auto scrollbar-hide relative cursor-pointer border border-[#E4E4E7] hover:border-[#1C63DB] min-h-[100px] p-1 text-sm ${
          isSameMonth(day, currentMonth) ? "bg-white" : "bg-[#F9FAFB]"
        }`}
      >
        <div className="text-right text-xs text-[#71717A] pr-1">
          {day.getDate()}
        </div>
        {dayEvents.map((event, idx) => {
          const index = events.findIndex(
            (e) =>
              e.date === event.date &&
              e.time === event.time &&
              e.text === event.text
          );
          return (
            <div
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                handleEditEvent(event, index);
              }}
              className="mt-1 flex flex-col px-2 py-1 bg-[#F3F7FD] border-l-4 border-[#1C63DB] rounded"
            >
              <span className="text-[12px] text-[#1C63DB] font-medium leading-[16px]">
                {event.time}
              </span>
              <span className="text-[12px] text-[#1D1D1F] leading-[16px] truncate">
                {event.text}
              </span>
            </div>
          );
        })}
      </button>
    );

    day = addDays(day, 1);
  }

  return (
    <div className="absolute right-6 top-[164px] rounded-2xl bg-white shadow-md flex flex-col py-8 px-6 gap-6 w-[924px] h-[740px]">
      <h2 className="text-[24px] leading-[32px] font-semibold text-[#1D1D1F] font-[Nunito]">
        Network Support
      </h2>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 w-full max-w-[256px]">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="h-[44px] w-[44px] bg-[#DDEBF6] flex items-center justify-center rounded-[8px]"
          >
            <ChevronLeft size={24} color="#1C63DB" />
          </button>
          <div className="flex h-[44px] items-center gap-2 px-4 py-[11px] border border-[#DFDFDF] rounded-[8px] bg-white w-full max-w-[152px]">
            <CalendarIcon size={16} color="#5F5F65" />
            <span className="text-[16px] text-nowrap leading-[22px] font-medium text-[#1D1D1F] font-[Nunito]">
              {format(currentMonth, "MMMM yyyy")}
            </span>
          </div>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="h-[44px] w-[44px] bg-[#DDEBF6] flex items-center justify-center rounded-[8px]"
          >
            <ChevronRight size={24} color="#1C63DB" />
          </button>
        </div>
        <button
          onClick={() => setCurrentMonth(new Date())}
          className="h-[44px] px-6 rounded-full bg-[#DDEBF6] text-[#1C63DB] font-[Nunito] text-[16px] font-semibold"
        >
          Today
        </button>
      </div>

      <div className="grid grid-cols-7 text-xs font-medium text-[#5F5F65] text-center border-t pt-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 rounded overflow-hidden h-full">
        {dayGrid}
      </div>

      {showModal && (
        <div className="absolute top-1/2 left-1/2 w-[360px] -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl z-50 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-[#1D1D1F] font-[Nunito]">
              {editIndex !== null ? "Edit event" : "New event"}
            </h3>
            <button onClick={resetModal}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#1D1D1F]">Name</label>
            <input
              value={newEventName}
              onChange={(e) => setNewEventName(e.target.value)}
              placeholder="Enter event name"
              className="border border-[#E4E4E7] rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#1D1D1F]">Time</label>
            <div className="flex items-center border border-[#E4E4E7] rounded px-3 py-2">
              <Clock size={16} className="text-[#71717A] mr-2" />
              <input
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                className="w-full text-sm"
                placeholder="09:00 AM"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#1D1D1F]">
              Notes <span className="text-[#A1A1AA]">(Optional)</span>
            </label>
            <input
              value={newEventNote}
              onChange={(e) => setNewEventNote(e.target.value)}
              placeholder="Leave short note"
              className="border border-[#E4E4E7] rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="flex justify-between mt-4 items-center">
            {editIndex !== null ? (
              <button
                onClick={handleDeleteEvent}
                className="flex items-center gap-2 text-red-500 font-semibold text-sm"
              >
                <Trash2 size={16} /> Delete event
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleAddEvent}
              className="rounded-full bg-[#1C63DB] px-4 py-2 text-white font-semibold text-sm"
            >
              {editIndex !== null ? "Save changes" : "Add event"}
            </button>
          </div>
        </div>
      )}

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="w-[742px]">
          <DialogHeader className="flex flex-col gap-6 p-6 items-start">
            <DialogTitle>
              Are you sure you want to delete this event?
            </DialogTitle>
            <DialogDescription>
              Deleting it will permanently remove event from your calendar. This
              action cannot be undone, and you won't be able to recover the
              event later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between items-center w-full">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex items-center rounded-full justify-center w-32 h-[44px] text-sm p-4 bg-[#DDEBF6] text-[#1C63DB]"
            >
              Cancel
            </button>
            <button
              onClick={confirmDeleteEvent}
              className="w-32 h-[44px] text-sm p-4 rounded-full bg-[#FF1F0F] text-white flex items-center justify-center"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
