import { ContentManagerSidebar } from "./ui";
import React from "react";
import { HealthSnapshotSidebar } from "./ui/health-snapshot";
import { UserManagementSideBar } from "./ui/user-management";

export const getSideBar = (location: string): React.ReactNode => {
  switch (location) {
    case "content-manager":
      return <ContentManagerSidebar />;
    case "health-snapshot":
      return <HealthSnapshotSidebar />;
    case "user-management":
      return <UserManagementSideBar />;
    case "settings":
      return <div>Settings Sidebar</div>;
  }
};
