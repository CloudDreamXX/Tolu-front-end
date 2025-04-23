import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "app";
import "./index.css";
import store, { persistor } from "entities/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { LoadingScreen } from "pages/loading";
import { Toaster } from "react-hot-toast";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <App />
      </PersistGate>
      <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
    </Provider>
  </StrictMode>
);
