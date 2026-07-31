import AnalyticsRouteListener from "@/components/AnalyticsRouteListener";
import CookieBanner from "@/components/CookieBanner";
import SmoothScroll from "@/components/SmoothScroll";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ConsentProvider } from "@/context/ConsentContext";
import { LanguageProvider } from "@/context/LanguageContext";
import PageTransition from "@/components/motion/PageTransition";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

/**
 * The note page pulls in react-markdown, which is most of its weight and is dead
 * code on the landing page — so it loads on demand instead of in the main chunk.
 */
const JournalPost = lazy(() => import("./pages/JournalPost"));
const RalPage = lazy(() => import("./pages/Ral"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Cookies = lazy(() => import("./pages/Cookies"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <ConsentProvider>
            <SmoothScroll>
              <AnalyticsRouteListener />
              <Suspense fallback={<div className="min-h-screen bg-background" />}>
                <PageTransition>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/journal/:slug" element={<JournalPost />} />
                    <Route path="/ral" element={<RalPage />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/cookies" element={<Cookies />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PageTransition>
              </Suspense>
              <CookieBanner />
            </SmoothScroll>
          </ConsentProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
