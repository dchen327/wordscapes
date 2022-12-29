import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import "./fonts/Lato-Bold.ttf";
import { register as registerServiceWorker } from "./serviceWorkerRegistration";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

registerServiceWorker();
