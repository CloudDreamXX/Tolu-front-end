import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "entities/store";
import { ReactElement } from "react";
import { getSideBar } from "widgets/sidebars";
import { getNavigation } from "widgets/navigations/lib";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const getRouteByRole = (role: string): string => {
  switch (role) {
    case "coaches":
      return "/coaches";
    case "Practitioner":
    case "Coach":
    case "Reviewer":
      return "/content-manager/library";
    case "Super Admin":
    case "admin":
    case "Admin":
      return "/user-management";
    case "Client":
      return "/health-snapshot";
    default:
      return "/auth";
  }
};

export const MainLayout: React.FC<{
  children: ReactElement;
  mainLocation: string;
}> = ({ children, mainLocation }) => {
  return (
    <div className="flex flex-row w-full h-screen min-h-screen overflow-hidden min-w-screen">
      <div className="hidden xl:block h-full px-[16px] py-8">
        {getSideBar(mainLocation)}
      </div>
      <div className="flex flex-col w-full h-full bg-[#F2F4F6]">
        {getNavigation(mainLocation)}
        {children}
      </div>
    </div>
  );
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
}) => {
  const location = useLocation();
  const { token, userRole } = useSelector((state: RootState) => ({
    token: state.user?.token,
    userRole: state.user?.user?.roleName,
  }));

  if (!token || !userRole) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={getRouteByRole(userRole)} replace />;
  }

  return <Outlet />;
};
