import { Card, CardContent } from "shared/ui";
import { IDocument } from "../../model";
import Dots from "shared/assets/icons/dots";
import { File } from "lucide-react";
import ClosedFolder from "shared/assets/icons/closed-folder";
import ReadyForNext from "shared/assets/icons/ready-for-next";
import NotReadyForNext from "shared/assets/icons/not-ready-for-next";
import { NavLink } from "react-router-dom";

interface DocumentCardProps {
  document: IDocument;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const { title, folder, readyForReview } = document;

  return (
    <div className="relative group w-full max-w-[277px]">
      <div
        className="
        absolute inset-0
        bg-[#D0EFFF]
        rounded-[18px]
        transition-transform duration-200
        group-hover:translate-x-2
        group-hover:translate-y-2
      "
      />
      <Card
        className="
        relative
        border border-[#008FF6]
        rounded-[18px]
        transition-transform duration-200

        shadow-[0px_4px_4px_rgba(0,0,0,0.25)]
        group-hover:shadow-[4px_4px_4px_rgba(0,0,0,0.25)]
      "
      >
        <NavLink
          to={`/content-manager/ai-generated/${document.folderId}/${document.id}`}
        >
          <CardContent className="flex flex-col gap-3.5 p-4">
            <div className="flex items-center gap-2">
              <File className="min-w-6" />
              <h2 className="text-xl font-bold truncate">{title}</h2>
              <Dots width={24} height={24} className="ml-auto min-w-6" />
            </div>
            <p className="flex items-center gap-2 text-base font-semibold truncate">
              <ClosedFolder width={20} height={20} className="min-w-5" />
              {folder}
            </p>
            <div className="flex items-center gap-2 text-base font-semibold">
              {readyForReview ? <ReadyForNext /> : <NotReadyForNext />}
              Ready for review
            </div>
          </CardContent>
        </NavLink>
      </Card>
    </div>
  );
};
