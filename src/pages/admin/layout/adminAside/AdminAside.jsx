import React from "react";
import { useLocation } from "react-router-dom";
import LibraryTopicDetailsSideBAr from "./components/LibraryTopicDetailsSideBAr";
import LibraryDashboardSideBar from "./components/LibraryDashboardSideBar";

const AdminAside = () => {
  const location = useLocation();

  const getSidebar = () => {
    if (location.pathname.startsWith("/admin/library-topic-details")) {
      return <LibraryTopicDetailsSideBAr />;
    } else if (location.pathname.startsWith("/admin")) {
      return <LibraryDashboardSideBar />;
    }
    return null; // No sidebar for other pages
  };

  return <div className=" h-full flex">{getSidebar()}</div>;
};

export default AdminAside;
