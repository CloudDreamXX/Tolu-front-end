import { Navigate, Route, Routes } from "react-router-dom";
import { Auth } from "pages/auth";
import { MainLayout, ProtectedRoute } from "./ui";
import { ContentManagerCreatePage } from "pages/content-manager/create/ui/ui";

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
        <Route
          path="/content-manager"
          element={<Navigate to={"/content-manager/published"} />}
        />
        <Route
          path="/content-manager/create"
          element={<ContentManagerCreatePage />}
        />
        <Route
          path="*"
          element={<Navigate to={"/content-manager/published"} />}
        />
      </Route>

      {/* 404 route */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
};
