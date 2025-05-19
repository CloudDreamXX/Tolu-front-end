import { ContentManagerSidebar } from "./ui";
import React from "react";

export const getSideBar = (location: string): React.ReactNode => {
  switch (location) {
    case "content-manager":
      return <ContentManagerSidebar />;
    case "client-library":
      return <div>Client Library Sidebar</div>;
    case "settings":
      return <div>Settings Sidebar</div>;
  }
};
