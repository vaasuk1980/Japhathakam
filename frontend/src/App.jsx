import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout/MainLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import PersonDetails from "./pages/PersonDetails/PersonDetails";
import NewHoroscope from "./pages/NewHoroscope/NewHoroscope";
import HoroscopeLibrary from "./pages/HoroscopeLibrary/HoroscopeLibrary";
import Panchangam from "./pages/Panchangam/Panchangam";
import Muhurtham from "./pages/Muhurtham/Muhurtham";
import Reports from "./pages/Reports/Reports";
import Settings from "./pages/Settings/Settings";
import ComponentShowcase from "./pages/ComponentShowcase/ComponentShowcase";
import FormPlayground from "./pages/FormPlayground/FormPlayground";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/person-details" element={<PersonDetails />} />
          <Route path="/new-horoscope" element={<NewHoroscope />} />
          <Route path="/horoscope-library" element={<HoroscopeLibrary />} />
          <Route path="/panchangam" element={<Panchangam />} />
          <Route path="/muhurtham" element={<Muhurtham />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/component-showcase" element={<ComponentShowcase />} />
           {/* Temporary development page */}
    <Route path="/playground" element={<FormPlayground />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;