import { HashRouter, Route, Routes } from "react-router";
import { CodeTimerProvider } from "../../state/CodeTimer";
import { PatientSessionProvider } from "../../state/PatientSession";
import { AboutPage } from "../pages/AboutPage";
import { CategoryPage } from "../pages/CategoryPage";
import { HomePage } from "../pages/HomePage";
import { CalcListPage } from "../pages/CalcListPage";
import { DoseCalcPage } from "../pages/DoseCalcPage";
import { InfusionCalcPage } from "../pages/InfusionCalcPage";
import { CodeTimerPage } from "../pages/CodeTimerPage";
import { CalcPage, NotFoundPage } from "../pages/PlaceholderPages";
import { ProtocolPage } from "../pages/ProtocolPage";
import { SearchPage } from "../pages/SearchPage";
import { SettingsPage } from "../pages/SettingsPage";
import { AppShell } from "./AppShell";
import { DisclaimerGate } from "./DisclaimerGate";
import { UpdateBanner } from "./UpdateBanner";

export function App() {
  return (
    <HashRouter>
      {/* Outside the gate: registers the service worker on first load, so the app is
          cached for offline use even before the disclaimer is acknowledged. */}
      <UpdateBanner />
      <DisclaimerGate>
        <PatientSessionProvider>
          <CodeTimerProvider>
            <Routes>
              <Route element={<AppShell />}>
                <Route index element={<HomePage />} />
                <Route path="c/:categoryId" element={<CategoryPage />} />
                <Route path="p/:protocolId" element={<ProtocolPage />} />
                <Route path="search" element={<SearchPage />} />
                <Route path="calc" element={<CalcListPage />} />
                <Route path="calc/dose" element={<DoseCalcPage />} />
                <Route path="calc/infusion" element={<InfusionCalcPage />} />
                <Route path="calc/:calcId" element={<CalcPage />} />
                <Route path="code" element={<CodeTimerPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </CodeTimerProvider>
        </PatientSessionProvider>
      </DisclaimerGate>
    </HashRouter>
  );
}
