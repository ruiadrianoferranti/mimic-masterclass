import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import TrustProblemPage from "./pages/TrustProblemPage.tsx";
import ServicesPage from "./pages/ServicesPage.tsx";
import VerifyPage from "./pages/VerifyPage.tsx";
import VerifyReport from "./pages/VerifyReport.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import AdminReportForm from "./pages/AdminReportForm.tsx";
import ServiceRequestPage from "./pages/ServiceRequestPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/trust-problem" element={<TrustProblemPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/verify-report/:code" element={<VerifyReport />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/report-form" element={<AdminReportForm />} />
          <Route path="/request-service" element={<ServiceRequestPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
