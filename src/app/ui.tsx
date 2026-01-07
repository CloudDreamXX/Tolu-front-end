import { RootState } from "entities/store/lib";
import { setLoading, useGetUserProfileQuery } from "entities/user";
import { LoadingScreen } from "pages/loading";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "shared/ui/toaster";
import { AppRoutes } from "./routes";
import { AuthErrorBoundary } from "widgets/auth-error-boundary/ui";
import { ChatSocketService } from "entities/chat";

export const App: React.FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.user.isLoading);
  // const userId = useSelector((state: RootState) => state.user.user?.id);
  const { data: user } = useGetUserProfileQuery();

  useEffect(() => {
    if (!user?.id) return;

    ChatSocketService.connect(user.id);

    return () => {
      ChatSocketService.disconnect();
    };
  }, [user?.id]);

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
