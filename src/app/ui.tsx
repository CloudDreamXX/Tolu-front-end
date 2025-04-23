import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { useSelector, useDispatch, Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, RootState } from "entities/store/lib";
import { AppRoutes } from "./routes";
import { LoadingScreen } from "pages/loading";
import { setLoading } from "entities/user";
import store from "entities/store";

export const App: React.FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.user?.isLoading);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setLoading(false));
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [dispatch]);

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <BrowserRouter>
          {isLoading && <LoadingScreen />}
          <Suspense fallback={<LoadingScreen />}>
            <AppRoutes />
          </Suspense>
          <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};
