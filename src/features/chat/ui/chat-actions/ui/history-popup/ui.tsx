import { setLastChatId } from "entities/client/lib";
import { useGetSearchHistoryQuery } from "entities/search/api";
import { memo, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import { Button } from "shared/ui";

type Props = {
  fromPath?: string | null;
  className?: string;
  smallChat?: boolean;
};

function useIsMdUp() {
  const [isMdUp, setIsMdUp] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : false
  );
  useEffect(() => {
    const m = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => setIsMdUp(e.matches);
    setIsMdUp(m.matches);
    m.addEventListener("change", onChange);
    return () => m.removeEventListener("change", onChange);
  }, []);
  return isMdUp;
}

const HistoryPopupComponent: React.FC<Props> = ({ className, smallChat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const isMdUp = useIsMdUp();
  const dispatch = useDispatch();

  const { data: history, refetch } = useGetSearchHistoryQuery(
    {},
    { skip: !isOpen }
  );

  // Re-fetch each time popup opens
  useEffect(() => {
    if (isOpen) refetch();
  }, [isOpen, refetch]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Shared panel markup (keeps your original md/xl classes)
  const Panel = (
    <div
      className={cn(
        "absolute z-[999999] flex flex-col bottom-0 top-[300px] left-0 w-full md:max-w-[350px] md:max-h-full md:h-full",
        smallChat
          ? "lg:left-auto md:top-[68px] right-[162px] lg:h-[400px]"
          : "md:left-28 lg:right-64 lg:left-auto md:top-2",
        "overflow-y-auto p-4 bg-white border rounded-t-[18px] md:rounded-xl shadow-lg"
      )}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal
      aria-label="Search history"
    >
      <h3 className="mb-2 text-lg font-bold">Your history</h3>
      <ul className="space-y-[18px]">
        {history && history.length > 0 ? (
          history.map((item) => (
            <li key={item.id} className="flex flex-row p-4 border rounded-lg">
              <div className="flex flex-col gap-1">
                <span className="text-lg font-bold leading-none text-gray-800">
                  {item.chatTitle || "Untitled Chat"}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
              <Button
                className="ml-auto rounded-full bg-[#DDEBF6] hover:bg-[#CFE2F3] p-2"
                onClick={() => {
                  dispatch(setLastChatId(item.chatId));
                  setIsOpen(false);
                }}
              >
                <MaterialIcon
                  iconName="keyboard_arrow_right"
                  className="text-[#1C63DB]"
                />
              </Button>
            </li>
          ))
        ) : (
          <li className="text-sm text-gray-500">No search history found</li>
        )}
      </ul>
    </div>
  );

  // OVERLAY + PANEL as it was (desktop/tablet), but portaled only on mobile
  const MobileLayer = (
    <div
      className="fixed inset-0 z-[2147483647]"
      onClick={() => setIsOpen(false)}
    >
      <div className="absolute inset-0 bg-[#0000004D]" />
      {
        Panel /* same panel classes; mobile part uses bottom sheet positioning */
      }
    </div>
  );

  const DesktopLayer = (
    <div
      className="absolute top-0 left-0 bottom-0 h-[80vh] w-full bg-[#0000004D] md:block md:bg-transparent"
      onClick={() => setIsOpen(false)}
    >
      {Panel /* unchanged md/xl styles & behavior */}
    </div>
  );

  return (
    <div ref={triggerRef}>
      <button
        onClick={() => setIsOpen((p) => !p)}
        className={cn(
          "bg-[#DDEBF6] rounded-full h-8 w-8 flex items-center justify-center",
          className
        )}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <MaterialIcon iconName="replay" className="text-[#1C63DB]" size={20} />
      </button>

      {
        isOpen &&
          (isMdUp
            ? DesktopLayer // no portal: md/xl stays exactly as before
            : createPortal(MobileLayer, document.body)) // portal only on mobile
      }
    </div>
  );
};

export const HistoryPopup = memo(HistoryPopupComponent);
