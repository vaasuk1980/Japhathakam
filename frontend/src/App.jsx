import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout/MainLayout";

import Dashboard from "./pages/Dashboard/Dashboard";
import PersonDetails from "./pages/PersonDetails/PersonDetails";
import HoroscopeLibrary from "./pages/HoroscopeLibrary/HoroscopeLibrary";
import CompareKundalis from "./pages/CompareKundalis/CompareKundalis";
import Panchangam from "./pages/Panchangam/Panchangam";
import Muhurtham from "./pages/Muhurtham/Muhurtham";
import Settings from "./pages/Settings/Settings";
import ComponentShowcase from "./pages/ComponentShowcase/ComponentShowcase";
import FormPlayground from "./pages/FormPlayground/FormPlayground";
import TestSwissEphemeris from "./pages/TestSwissEphemeris";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>

                    <Route path="/" element={<Dashboard />} />
                    <Route path="/person-details" element={<PersonDetails />} />
                    <Route path="/horoscope-library" element={<HoroscopeLibrary />} />
                    <Route path="/compare-kundalis" element={<CompareKundalis />} />
                    <Route path="/panchangam" element={<Panchangam />} />
                    <Route path="/muhurtham" element={<Muhurtham />} />
                    {/* Developer-only routes — not shipped in production builds */}
                    {import.meta.env.DEV && (
                        <>
                            <Route path="/component-showcase" element={<ComponentShowcase />} />
                            <Route path="/playground" element={<FormPlayground />} />
                            <Route
                                path="/test-swiss-ephemeris"
                                element={<TestSwissEphemeris />}
                            />
                        </>
                    )}

                    <Route path="/settings" element={<Settings />} />

                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;