import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout, ProtectedRoute } from "./ui";
import { Auth } from "pages/auth";
import {
  ContentManagerCreatePage,
  ContentManagerAiGenerated,
  ContentManagerAiGeneratedDocument,
} from "pages/content-manager";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["guest"]} />}>
        <Route path="/auth" element={<Auth />} />
      </Route>

      <Route
        element={
          <MainLayout mainLocation="content-manager">
            <ProtectedRoute allowedRoles={["guest", "admin", "coaches"]} />
          </MainLayout>
        }
      >
        <Route
          path="/content-manager/create"
          element={<ContentManagerCreatePage />}
        />
        <Route
          path="/content-manager/ai-generated"
          element={<ContentManagerAiGenerated />}
        />
        <Route
          path="/content-manager/ai-generated/:folderId/:documentId"
          element={<ContentManagerAiGeneratedDocument />}
        />
        <Route
          path="/content-manager/published"
          element={<div>Published</div>}
        />
        <Route
          path="*"
          element={<Navigate to={"/content-manager/published"} />}
        />
        <Route
          path="/content-manager"
          element={<Navigate to={"/content-manager/published"} />}
        />
      </Route>

      {/* 404 route */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
};
