import { setIsMobileDailyJournalOpen } from "entities/client/lib";
import { RootState } from "entities/store";
import { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { DailyJournal } from "widgets/dayli-journal";
import { getNavigation } from "widgets/navigations/lib";
import { getSideBar } from "widgets/sidebars";

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
      return "/library";
    default:
      return "/auth";
  }
};

export const MainLayout: React.FC<{
  children: ReactElement;
  mainLocation: string;
}> = ({ children, mainLocation }) => {
  const dispatch = useDispatch();
  const isMobileDailyJournalOpen = useSelector(
    (state: RootState) => state.client.isMobileDailyJournalOpen
  );

  return (
    <div className="flex flex-row w-full min-h-screen">
      <div className="hidden xl:block relative h-screen px-[16px] pr-0 py-8">
        {getSideBar(mainLocation)}
      </div>
      <div className="flex flex-col w-full h-full bg-[#F2F4F6] min-h-screen xl:overflow-hidden">
        {getNavigation(mainLocation)}
        {children}
        {isMobileDailyJournalOpen && (
          <div
            className={`absolute ${mainLocation === "content-manager" ? "top-[85px]" : "top-[72px]"} md:hidden`}
          >
            <DailyJournal
              isOpen={isMobileDailyJournalOpen}
              onCancel={() => dispatch(setIsMobileDailyJournalOpen(false))}
              onClose={() => dispatch(setIsMobileDailyJournalOpen(false))}
            />
          </div>
        )}
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
