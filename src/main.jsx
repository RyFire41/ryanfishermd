import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import App from "./App.jsx";
import InsightsFullPage from "./components/InsightsListPage.jsx";
import InsightArticlePage from "./components/InsightArticlePage.jsx";
import { EducationalTopicsFullPage } from "./components/EducationalTopicsSection.jsx";
import About from "./pages/About.jsx";
import Header from "./components/Header.jsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";

/* 
  ScrollToTopOnRouteChange:
  Ensures every route starts at the top instead of mid-scroll.
*/
export function ScrollToTopOnRouteChange() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);
  return null;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <div className="h-1 w-full bg-gradient-to-r from-[#bea05f] via-[#8da38a] to-[#c5a755]" aria-hidden="true" />
        <Header />
        {/* Enables scroll restoration for all routes */}
        <ScrollToTopOnRouteChange />

        <Routes>
          {/* Main homepage */}
          <Route path="/" element={<App />} />

          {/* Subpages */}
          <Route path="/insights" element={<InsightsFullPage />} />
          <Route path="/education" element={<EducationalTopicsFullPage />} />
          <Route path="/about" element={<About />} />

          {/* Individual Insight article pages */}
          <Route path="/insights/:slug" element={<InsightArticlePage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
