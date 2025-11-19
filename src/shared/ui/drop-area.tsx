import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button } from "./button";

export const DropArea = ({
  dragActive,
  onDragOver,
  onDragLeave,
  onDrop,
  onBrowseClick,
}: {
  dragActive: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onBrowseClick: () => void;
}) => {
  return (
    <Button
      variant={"unstyled"}
      size={"unstyled"}
      type="button"
      aria-label="Drop files here or click to browse"
      className={`w-full mt-4 p-6 border border-dashed rounded-2xl text-left ${
        dragActive ? "border-blue-700 bg-blue-50" : "border-blue-500 bg-white"
      } focus:outline-none`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onBrowseClick}
    >
      <div className="flex flex-col items-center justify-center text-center pointer-events-none">
        <MaterialIcon
          iconName="cloud_upload"
          fill={1}
          className="text-[#1C63DB] p-2 border rounded-xl"
        />
        <p className="mt-3 mb-1 text-base">
          <span className="text-blue-500">Click to upload</span>
        </p>
        <p className="text-sm text-gray-500">
          SVG, PNG, JPEG, PDF, DOC, DOCX, TXT or GIF (max. 800x400px)
        </p>
        <p className="text-sm text-gray-500">
          The size of the file should be less than 30mb
        </p>
      </div>
    </Button>
  );
};
