import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { SideBarItem } from "../model";

export const sideBarContent: SideBarItem[] = [
  {
    title: "Users",
    link: "/user-management",
    icon: <MaterialIcon iconName="groups" fill={1} />,
  },
  {
    title: "Feedback",
    link: "/feedback",
    icon: <MaterialIcon iconName="chat" fill={1} />,
  },
  {
    title: "Messages",
    link: "/admin-messages",
    icon: <MaterialIcon iconName="forum" fill={1} />,
  },
];
