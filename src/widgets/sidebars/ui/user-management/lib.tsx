import { ChatTextIcon } from "@phosphor-icons/react/dist/ssr";
import { SideBarItem } from "../model";
import Users from "shared/assets/icons/users";

export const sideBarContent: SideBarItem[] = [
  {
    title: "Users",
    link: "/user-management",
    icon: <Users fill="#000" width={24} height={24} />,
  },
  {
    title: "Feedback",
    link: "/feedback",
    icon: <ChatTextIcon width={24} height={24} />,
  },
];
