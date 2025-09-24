import { RootState } from "entities/store/lib";
import { setLoading } from "entities/user";
import { LoadingScreen } from "pages/loading";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "shared/ui/toaster";
import { AppRoutes } from "./routes";
import { AuthErrorBoundary } from "widgets/auth-error-boundary/ui";

export const App: React.FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.user.isLoading);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(setLoading(false));
    }, 1_000);
    return () => clearTimeout(timeout);
  }, [dispatch]);

  return (
    <BrowserRouter>
      {isLoading && <LoadingScreen />}
      <AuthErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <AppRoutes />
          <Toaster />
        </Suspense>
      </AuthErrorBoundary>
    </BrowserRouter>
  );
};
