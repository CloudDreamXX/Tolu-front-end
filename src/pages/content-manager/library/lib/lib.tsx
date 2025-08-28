import { TableRow } from "../models";
import FolderIcon from "shared/assets/icons/library-folder";
import SubfolderIcon from "shared/assets/icons/subfolder";
import VideoIcon from "shared/assets/icons/video";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

export const getIcon = (type: TableRow["type"], className?: string) => {
  switch (type) {
    case "folder":
      return <FolderIcon className={className} />;
    case "subfolder":
      return <SubfolderIcon className={className} />;
    case "video":
      return <VideoIcon className={className} />;
    case "voice":
      return <MaterialIcon iconName="settings_voice" className={className} />;
    case "content":
      return <MaterialIcon iconName="docs" className={className} />;
    default:
      return null;
  }
};
