import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "entities/store";
import { ReactElement } from "react";
import { Navigation } from "widgets/navigation";
import { getSideBar } from "widgets/sidebars";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const getRouteByRole = (role: string): string => {
  switch (role) {
    case "admin":
      return "/admin";
    case "coaches":
      return "/coaches";
    default:
      return "/user";
  }
};

const checkPath = () => {
  if (
    location.pathname === "/auth" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/new-password" ||
    location.pathname === "/verify-email" ||
    location.pathname === "/verify-email-pass" ||
    location.pathname === "/welcome/client" ||
    location.pathname === "/welcome/practitioner" ||
    location.pathname === "/onboarding-welcome" ||
    location.pathname === "/subscription-plan" ||
    location.pathname === "/select-type" ||
    location.pathname === "/about-your-practice" ||
    location.pathname === "/profile-setup" ||
    location.pathname === "/invite-clients" ||
    location.pathname === "/onboarding-finish" || 
    location.pathname === "/about-you"
  ) {
    return <Outlet />;
  }
};

export const MainLayout: React.FC<{
  children: ReactElement;
  mainLocation: string;
}> = ({ children, mainLocation }) => {
  return (
    <div className="flex flex-row w-full h-screen min-h-screen overflow-hidden min-w-screen">
      <div className="h-full w-full max-w-[316px] px-2 py-8">
        {getSideBar(mainLocation)}
      </div>
      <div className="flex flex-col w-full h-full bg-[#F3F6FB]">
        <Navigation />
        {children}
      </div>
    </div>
  );
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
}) => {
  const location = useLocation();
  const { token, userType } = useSelector((state: RootState) => ({
    token: state?.user?.token,
    userType: state?.user?.userType,
  }));

  if (!token || !userType) {
    checkPath();
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  } else if (location.pathname === "/auth") {
    return <Navigate to={getRouteByRole(userType.role)} replace />;
  }
  return <Outlet />;
};
