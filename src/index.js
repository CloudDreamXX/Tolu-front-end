import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./ReduxToolKit/store";
import { Auth0Provider } from '@auth0/auth0-react';



const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
 
  <Provider store={store}> 
  <App />
    {/* <React.StrictMode>
      <App />
    </React.StrictMode> */}
  </Provider>
 
);

reportWebVitals();
