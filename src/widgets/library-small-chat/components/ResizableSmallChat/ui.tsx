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
    const [position, setPosition] = useState<"left" | "right">("right");
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

        const handleMouseUp = () => setDragging(false);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, position, setWidthPercent]);

    return (
        <div
            ref={chatRef}
            className="h-full bg-white shadow-lg border-l border-gray-200 relative flex flex-col transition-all duration-150"
            style={{ width: `${widthPercent}%` }}
        >
            <div className="absolute top-2 right-2 flex gap-2">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                        setPosition(position === "right" ? "left" : "right")
                    }
                >
                    {position === "right" ? (
                        <MaterialIcon iconName="keyboard_arrow_left" />
                    ) : (
                        <MaterialIcon iconName="keyboard_arrow_right" />
                    )}
                </Button>
            </div>

            <LibrarySmallChat isCoach isDraft />

            <div
                onMouseDown={() => setDragging(true)}
                className={`absolute top-0 bottom-0 ${position === "right"
                        ? "left-0 cursor-ew-resize"
                        : "right-0 cursor-ew-resize"
                    } w-1 bg-transparent hover:bg-blue-300 transition`}
            />
        </div>
    );
};
