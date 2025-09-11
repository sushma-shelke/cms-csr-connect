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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/ngos" element={<NGOManagement />} />
                <Route path="/ngo-updates" element={<NGOQuickUpdates />} />
                <Route path="/projects" element={<ProjectManagement />} />
                <Route path="/financial" element={<FinancialManagement />} />
                <Route path="/mis-reports" element={<MISReports />} />
                <Route path="/media" element={<MediaEvidence />} />
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
