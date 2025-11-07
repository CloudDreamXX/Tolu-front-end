import { useRef, useState, useEffect } from "react";
import { LibrarySmallChat } from "widgets/library-small-chat";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

interface ResizableLibraryChatProps {
    widthPercent: number;
    setWidthPercent: (value: number) => void;
}

export const ResizableLibraryChat: React.FC<ResizableLibraryChatProps> = ({
    widthPercent,
    setWidthPercent,
}) => {
    const [dragging, setDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startWidth, setStartWidth] = useState(widthPercent);
    const [position] = useState<"left" | "right">("right");
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragging) return;

            const containerWidth = window.innerWidth;
            let deltaPercent;

            if (position === "right") {
                const deltaX = startX - e.clientX;
                deltaPercent = (deltaX / containerWidth) * 100;
                let newPercent = startWidth + deltaPercent;
                newPercent = Math.max(30, Math.min(newPercent, 70));
                setWidthPercent(newPercent);
            } else {
                const deltaX = e.clientX - startX;
                deltaPercent = (deltaX / containerWidth) * 100;
                let newPercent = startWidth + deltaPercent;
                newPercent = Math.max(30, Math.min(newPercent, 70));
                setWidthPercent(newPercent);
            }
        };

        const handleMouseUp = () => {
            setDragging(false);
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
        };

        if (dragging) {
            document.body.style.userSelect = "none";
            document.body.style.cursor = "ew-resize";
        }

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            document.body.style.userSelect = "";
            document.body.style.cursor = "";
        };
    }, [dragging, startX, startWidth, position, setWidthPercent]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setDragging(true);
        setStartX(e.clientX);
        setStartWidth(widthPercent);
    };

    return (
        <div
            ref={chatRef}
            className={`hidden xl:block h-full bg-white relative flex flex-col ${dragging ? "" : "transition-[width] duration-300 ease-in-out"
                }`}
            style={{ width: `${widthPercent}%` }}
        >
            <LibrarySmallChat isCoach isDraft />

            <div
                onMouseDown={handleMouseDown}
                className={`absolute top-[65%] ${position === "right" ? "-left-[20px]" : "-right-[20px]"
                    } cursor-ew-resize flex items-center justify-center w-[40px] h-[40px] rounded-full bg-white hover:bg-gray-50 text-blue-700 transition`}
            >
                <MaterialIcon iconName="arrow_range" />
            </div>
        </div>
    );
};
