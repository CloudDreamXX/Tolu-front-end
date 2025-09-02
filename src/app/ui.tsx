import { BrowserRouter } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "entities/store/lib";
import { AppRoutes } from "./routes";
import { LoadingScreen } from "pages/loading";
import { setLoading, UserService } from "entities/user";
import { Toaster } from "shared/ui/toaster";
import { ChatSocketService } from "entities/chat";

export const App: React.FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.user.isLoading);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await UserService.getUserProfile();
        ChatSocketService.connect(user.id);
      } catch (error) {
        console.error("Failed to init chat:", error);
      }
    };

    init();
    return () => {
      ChatSocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(setLoading(false));
    }, 1_000);
    return () => clearTimeout(timeout);
  }, [dispatch]);

  return (
    <BrowserRouter>
      {isLoading && <LoadingScreen />}
      <Suspense fallback={<LoadingScreen />}>
        <AppRoutes />
        <Toaster />
      </Suspense>
    </BrowserRouter>
  );
};
