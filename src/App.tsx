import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import Index from "./pages/Index";
import InserateListing from "./pages/InserateListing";
import InseratDetail from "./pages/InseratDetail";
import InseratNeu from "./pages/InseratNeu";
import Login from "./pages/Login";
import Registrieren from "./pages/Registrieren";
import Dashboard from "./pages/Dashboard";
import Anfragen from "./pages/Anfragen";
import Profil from "./pages/Profil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/inserate" element={<InserateListing />} />
            <Route path="/inserate/:id" element={<InseratDetail />} />
            <Route path="/inserate/neu" element={<InseratNeu />} />
            <Route path="/inserate/:id/bearbeiten" element={<InseratNeu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registrieren" element={<Registrieren />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/anfragen" element={<Anfragen />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
