import { TableRow } from "../models";
import FolderIcon from "shared/assets/icons/library-folder";
import SubfolderIcon from "shared/assets/icons/subfolder";
import VoiceIcon from "shared/assets/icons/voice";
import VideoIcon from "shared/assets/icons/video";
import DocumentIcon from "shared/assets/icons/document";

export const getIcon = (type: TableRow["type"], className?: string) => {
  switch (type) {
    case "folder":
      return <FolderIcon className={className} />;
    case "subfolder":
      return <SubfolderIcon className={className} />;
    case "video":
      return <VideoIcon className={className} />;
    case "voice":
      return <VoiceIcon className={className} />;
    case "content":
      return <DocumentIcon className={className} />;
    default:
      return null;
  }
};
