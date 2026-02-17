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
    title: "Research",
    content: <WrapperFolderTree />,
    icon: <MaterialIcon iconName="web_stories" fill={1} />,
  },
  //Uncoment when will be necessary
  // {
  //   title: "Workshops (coming soon)",
  //   link: "/",
  //   icon: <MaterialIcon iconName="school" fill={1} />,
  // },
  // {
  //   title: "Dashboard (coming soon)",
  //   link: "/",
  //   icon: <MaterialIcon iconName="bar_chart_4_bars" fill={1} />,
  // },
  // {
  //   title: "Community (coming soon)",
  //   link: "/",
  //   icon: <MaterialIcon iconName="groups" fill={1} />,
  // },
  {
    title: "Files Library",
    link: "/content-manager/files",
    icon: <MaterialIcon iconName="folder" fill={1} />,
  },
];
