import { App } from "app";
import { persistor, store } from "entities/store";
import { LoadingScreen } from "pages/loading";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <App />
        <Toaster />
      </PersistGate>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
    </Provider>
  </StrictMode>
);
