import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import "leaflet/dist/leaflet.css";
import 'bootstrap-icons/font/bootstrap-icons.css'
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById("root")).render(
  <StrictMode>
        <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>
);
