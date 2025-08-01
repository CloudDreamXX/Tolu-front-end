import Approved from "shared/assets/icons/approved";
import Book from "shared/assets/icons/book";
import Box from "shared/assets/icons/box";
import Community from "shared/assets/icons/community";
import Dashboard from "shared/assets/icons/dashboard";
import Workshops from "shared/assets/icons/workshops";
import { SideBarItem } from "../model";
import { WrapperFolderTree } from "features/wrapper-folder-tree";
import { FileText } from "lucide-react";

export const sideBarContent: SideBarItem[] = [
  {
    title: "Clients",
    link: "/clients",
    icon: <Approved width={24} height={24} />,
  },
  {
    title: "Library",
    content: <WrapperFolderTree />,
    icon: <Book width={24} height={24} />,
  },
  {
    title: "Workshops (coming soon)",
    link: "/",
    icon: <Workshops />,
  },
  {
    title: "Dashboard (coming soon)",
    link: "/",
    icon: <Dashboard />,
  },
  {
    title: "Community (coming soon)",
    link: "/",
    icon: <Community width={24} height={24} />,
  },
  {
    title: "Messages",
    link: "/content-manager/messages",
    icon: <Box />,
  },
  {
    title: "Agreements",
    link: "/content-manager/agreements",
    icon: <FileText />,
  },
];
