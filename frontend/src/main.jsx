import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/variables.css";
import "./styles/fonts.css";
import "./styles/typography.css";
import "./index.css";
import "./styles/print.css";

import { LanguageProvider } from "./i18n/I18nContext.jsx";
import { LocationProvider } from "./location/LocationContext.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <LocationProvider>
        <App />
      </LocationProvider>
    </LanguageProvider>
  </StrictMode>
);