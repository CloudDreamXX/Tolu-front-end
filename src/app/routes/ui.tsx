import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "entities/store/lib";
import { useEffect } from "react";

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

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
}) => {
  const location = useLocation();
  const { token, userType } = useSelector((state: RootState) => ({
    token: state.user.token,
    userType: state.user.userType,
  }));

  if (!token || !userType) {
    if (location.pathname === "/auth") {
      return <Outlet />;
    }

    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  const role = userType.role;
  const targetRoute = getRouteByRole(role);

  if (
    location.pathname.startsWith(targetRoute) &&
    allowedRoles.includes(role)
  ) {
    return <Outlet />;
  }

  return (
    <Navigate to={targetRoute} state={{ from: location.pathname }} replace />
  );
};
