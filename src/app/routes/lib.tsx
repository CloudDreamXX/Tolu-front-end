import { Navigate, Route, Routes } from "react-router-dom";
import { Auth } from "pages/auth";
import { ProtectedRoute } from "./ui";
import { Home } from "pages/home";
import { ReactElement } from "react";
import { Navigation } from "widgets/navigation";

const MainLayout: React.FC<{ children: ReactElement }> = ({ children }) => {
  return (
    <div className="flex flex-row w-full h-screen min-h-screen overflow-hidden min-w-screen">
      <div className="w-full max-w-[316px]">Future Sidebar</div>
      <div className="flex flex-col w-full h-full">
        <Navigation />
        {children}
      </div>
    </div>
  );
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["guest"]} />}>
        <Route path="/auth" element={<Auth />} />
      </Route>

      <Route
        element={
          <MainLayout>
            <ProtectedRoute allowedRoles={["guest", "admin", "coaches"]} />
          </MainLayout>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="*" element={<>Add redirect later</>} />
      </Route>

      {/* 404 route */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
};
