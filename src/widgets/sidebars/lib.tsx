import { ContentManagerSidebar } from "./ui";
import React from "react";

export const getSideBar = (location: string): React.ReactNode => {
  console.log("location", location);
  switch (location) {
    case "content-manager":
      return <ContentManagerSidebar />;
    case "settings":
      return <div>Settings Sidebar</div>;
  }
};
