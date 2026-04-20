import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import IndexPredict from "./pages/predict-home/IndexPredict";
import Marketplace from "./pages/market/Marketplace";
import { AppLayout } from "./layout/AppLayout";
import DashboardMarketPlace from "./pages/market/DashboardMarketPlace";
import SubmitListing from "./pages/market/SubmitListing";
import Admin from "./pages/Admin";
import PropertyDetail from "./pages/market/PropertyDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              {/* <Route path="/" element={<Auth />} /> */}
              <Route path="/" element={<Marketplace />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/member" element={<DashboardMarketPlace />} />
              <Route path="/member/submit" element={<SubmitListing />} />
              <Route
                path="/predict"
                element={
                  <ProtectedRoute>
                    <IndexPredict />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
