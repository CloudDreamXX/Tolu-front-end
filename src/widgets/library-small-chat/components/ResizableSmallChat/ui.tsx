import { useRef, useState, useEffect } from "react";
import { LibrarySmallChat } from "widgets/library-small-chat";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { useTextSelectionTooltip } from "pages/content-manager/document/lib";

interface ResizableLibraryChatProps {
  widthPercent: number;
  setWidthPercent: (value: number) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  isCoach?: boolean;
  textForInput?: string;
}

export const ResizableLibraryChat: React.FC<ResizableLibraryChatProps> = ({
  widthPercent,
  setWidthPercent,
  onResizeStart,
  onResizeEnd,
  isCoach,
  textForInput
}) => {
  const [dragging, setDragging] = useState(false);
  const position: "left" | "right" = "right";

  const chatRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(widthPercent);

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container =
        chatRef.current?.parentElement ?? chatRef.current ?? document.body;
      const containerWidth = container.clientWidth || window.innerWidth;

      const startX = startXRef.current;
      const startWidth = startWidthRef.current;

      let deltaPercent: number;

      if (position === "right") {
        const deltaX = startX - e.clientX;
        deltaPercent = (deltaX / containerWidth) * 100;
      } else {
        const deltaX = e.clientX - startX;
        deltaPercent = (deltaX / containerWidth) * 100;
      }

      let newPercent = startWidth + deltaPercent;
      newPercent = Math.max(30, Math.min(newPercent, 70));
      setWidthPercent(newPercent);
    };

    const handleMouseUp = () => {
      setDragging(false);
      onResizeEnd?.();
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    document.body.style.userSelect = "none";
    document.body.style.cursor = "ew-resize";

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [dragging, position, setWidthPercent, onResizeEnd]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    onResizeStart?.();
    startXRef.current = e.clientX;
    startWidthRef.current = widthPercent;
  };

  return (
    <div
      ref={chatRef}
      className={`hidden xl:flex flex-col h-full bg-white relative flex-none ${!dragging ? "transition-[width] duration-300 ease-in-out" : ""
        }`}
      style={{ width: `${widthPercent}%` }}
    >
      <LibrarySmallChat isCoach={isCoach} isDraft selectedText={textForInput} />

      <div
        onMouseDown={handleMouseDown}
        className={`absolute top-[50%] translate-y-[-50%] ${position === "right" ? "-left-[20px]" : "-right-[20px]"
          } cursor-ew-resize flex items-center justify-center w-[40px] h-[40px] rounded-full bg-white hover:bg-gray-50 text-blue-700 transition`}
      >
        <MaterialIcon iconName="arrow_range" />
      </div>
    </div>
  );
};
