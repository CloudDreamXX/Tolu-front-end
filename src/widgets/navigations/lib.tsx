import React from "react";
import { Navigation } from "widgets/navigations/navigation/ui";
import { NavigationClient } from "widgets/navigations/navigationClient/ui";

export const getNavigation = (location: string): React.ReactNode => {
  switch (location) {
    case "user-management":
    case "content-manager":
      return <Navigation pageLocation={location} />;
    case "health-snapshot":
    case "library":
      return <NavigationClient />;
    case "settings":
      return <div></div>;
    default:
      return null;
  }
};
