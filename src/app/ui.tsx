import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import { useSelector } from "react-redux";
import { AppRoutes } from "./routes";
import { LoadingScreen } from "pages/loading";
import { RootState } from "entities/store/lib";

export const App: React.FC = () => {
  const isLoading = useSelector((state: RootState) => state.user?.isLoading);

  return (
    <BrowserRouter>
      {isLoading && <LoadingScreen />}
      <Suspense fallback={<LoadingScreen />}>
        <AppRoutes />
      </Suspense>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
    </BrowserRouter>
  );
};
