import Approved from "shared/assets/icons/approved";
import Book from "shared/assets/icons/book";
import Box from "shared/assets/icons/box";
import Community from "shared/assets/icons/community";
import Dashboard from "shared/assets/icons/dashboard";
import Workshops from "shared/assets/icons/workshops";
import { SideBarItem } from "../model";

export const sideBarContent: SideBarItem[] = [
  {
    title: "Clients",
    link: "/clients",
    icon: <Approved width={24} height={24} />,
  },
  {
    title: "Messages",
    link: "/content-manager/messages",
    icon: <Box />,
  },
  {
    title: "Library",
    link: "",
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
  // {
  //   title: "AI-Generated",
  //   link: "/content-manager/ai-generated",
  //   icon: <AiCreate fill="#000" width={24} height={24} />,
  // },
  // {
  //   title: "In-Review",
  //   link: "/content-manager/in-review",
  //   icon: <Eye width={24} height={24} />,
  // },
  // {
  //   title: "Approved",
  //   link: "/content-manager/approved",
  //   icon: <Approved width={24} height={24} />,
  // },
  // {
  //   title: "Published",
  //   link: "/content-manager/published",
  //   icon: <Published width={24} height={24} />,
  // },
  // {
  //   title: "Archived",
  //   link: "/content-manager/archived",
  //   icon: <Archived width={24} height={24} />,
  // },
];
