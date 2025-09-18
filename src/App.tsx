import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NGOManagement from "./pages/NGOManagement";
import ProjectManagement from "./pages/ProjectManagement";
import FinancialManagement from "./pages/FinancialManagement";
import MISReports from "./pages/MISReports";
import NGOQuickUpdates from "./pages/NGOQuickUpdates";
import MediaEvidence from "./pages/MediaEvidence";
import NotFound from "./pages/NotFound";
import HealthThematic from "./pages/HealthThematic";
import EducationThematic from "./pages/EducationThematic";
import ClimateResilienceThematic from "./pages/ClimateResilienceThematic";
import LivelihoodThematic from "./pages/LivelihoodThematic";
import AddNGO from "./pages/AddNGO";
import bgVideo from "./assets/bg.mp4";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>

               {/* Global Video Background */}
      <video
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1]"
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay for readability */}
      <div className="fixed inset-0 bg-black/30 z-[-1]"></div>

          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/ngos" element={<NGOManagement />} />
                <Route path="/add-ngo" element={<AddNGO/>} />
                <Route path="/ngo-updates" element={<NGOQuickUpdates />} />
                <Route path="/projects" element={<ProjectManagement />} />
                <Route path="/finance" element={<FinancialManagement />} />
                <Route path="/mis-reports" element={<MISReports />} />
                <Route path="/media" element={<MediaEvidence />} />
                <Route path="/themes/health" element={<HealthThematic />} />
                <Route path="/themes/education" element={<EducationThematic />} />
                <Route path="/themes/climate" element={<ClimateResilienceThematic />} />
                <Route path="/themes/livelihood" element={<LivelihoodThematic />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
