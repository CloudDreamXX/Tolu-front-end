import { useRef, useState, useEffect } from "react";
import { LibrarySmallChat } from "widgets/library-small-chat";
import { Button } from "shared/ui";
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
    const [position, _] = useState<"left" | "right">("right");
    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragging) return;

            const containerWidth = window.innerWidth;
            let newPercent;

            if (position === "right") {
                const distanceFromRight = containerWidth - e.clientX;
                newPercent = (distanceFromRight / containerWidth) * 100;
            } else {
                newPercent = (e.clientX / containerWidth) * 100;
            }

            newPercent = Math.max(30, Math.min(newPercent, 70));
            setWidthPercent(newPercent);
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
    }, [dragging, position, setWidthPercent]);


    return (
        <div
            ref={chatRef}
            className="hidden xl:block h-full bg-white relative flex flex-col transition-all duration-150"
            style={{ width: `${widthPercent}%` }}
        >

            <LibrarySmallChat isCoach isDraft />

            <div
                onMouseDown={() => setDragging(true)}
                className={`absolute top-[65%] ${position === "right"
                    ? "-left-[20px] cursor-ew-resize"
                    : "-right-[20px] cursor-ew-resize"
                    } flex items-center justify-center w-[40px] h-[40px] rounded-full transition bg-white hover:bg-gray-50 text-blue-700`}
            ><MaterialIcon iconName="arrow_range" /></div>


        </div>
    );
};
