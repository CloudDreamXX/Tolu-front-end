import { WrapperFolderTree } from "features/wrapper-folder-tree";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { SideBarItem } from "../model";

export const sideBarContent: SideBarItem[] = [
  {
    title: "Clients",
    link: "/clients",
    icon: <MaterialIcon iconName="person_search" fill={1} />,
  },
  {
    title: "Library",
    content: <WrapperFolderTree />,
    icon: <MaterialIcon iconName="web_stories" fill={1} />,
  },
  {
    title: "Workshops (coming soon)",
    link: "/",
    icon: <MaterialIcon iconName="school" fill={1} />,
  },
  {
    title: "Dashboard (coming soon)",
    link: "/",
    icon: <MaterialIcon iconName="bar_chart_4_bars" fill={1} />,
  },
  {
    title: "Community (coming soon)",
    link: "/",
    icon: <MaterialIcon iconName="groups" fill={1} />,
  },
  {
    title: "Messages",
    link: "/content-manager/messages",
    icon: <MaterialIcon iconName="forum" fill={1} />,
  },
  {
    title: "Agreements",
    link: "/content-manager/agreements",
    icon: <MaterialIcon iconName="docs" />,
  },
];
