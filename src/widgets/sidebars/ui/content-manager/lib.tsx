import { WrapperFolderTree } from "features/wrapper-folder-tree";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { SideBarItem } from "../model";

export const sideBarContent: SideBarItem[] = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: <MaterialIcon iconName="schedule" />,
  },
  {
    title: "Clients",
    link: "/clients",
    icon: <MaterialIcon iconName="person" />,
  },
  {
    title: "Knowledge Library",
    link: "/content-manager/files",
    icon: <MaterialIcon iconName="description" />,
  },
  {
    title: "Content library",
    content: <WrapperFolderTree />,
    icon: <MaterialIcon iconName="folder" />,
  },
  {
    title: "Settings",
    link: "/settings",
    icon: <MaterialIcon iconName="settings" />,
  },
  //Uncoment when will be necessary
  // {
  //   title: "Workshops (coming soon)",
  //   link: "/",
  //   icon: <MaterialIcon iconName="school" fill={1} />,
  // },
  // {
  //   title: "Community (coming soon)",
  //   link: "/",
  //   icon: <MaterialIcon iconName="groups" fill={1} />,
  // },
];
