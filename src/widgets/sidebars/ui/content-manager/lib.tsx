import Eye from "shared/assets/icons/eye";
import { SideBarItem } from "../model";
import AiCreate from "shared/assets/icons/ai-create";
import Approved from "shared/assets/icons/approved";
import Published from "shared/assets/icons/published";
import Archived from "shared/assets/icons/archived";

export const sideBarContent: SideBarItem[] = [
  {
    title: "AI-Generated",
    link: "/content-manager/ai-generated",
    icon: <AiCreate fill="#000" width={24} height={24} />,
  },
  {
    title: "In-Review",
    link: "/content-manager/in-review",
    icon: <Eye width={24} height={24} />,
  },
  {
    title: "Approved",
    link: "/content-manager/approved",
    icon: <Approved width={24} height={24} />,
  },
  {
    title: "Published",
    link: "/content-manager/published",
    icon: <Published width={24} height={24} />,
  },
  {
    title: "Archived",
    link: "/content-manager/archived",
    icon: <Archived width={24} height={24} />,
  },
];
