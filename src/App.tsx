import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import IndexPredict from "./pages/predict-home/IndexPredict";
import Marketplace from "./pages/market/Marketplace";
import { AppLayout } from "./layout/AppLayout";
import DashboardMarketPlace from "./pages/market/DashboardMarketPlace";
import SubmitListing from "./pages/market/SubmitListing";
import Admin from "./pages/Admin";
import PropertyDetail from "./pages/market/PropertyDetail";
import MyAssetsDashboard from "./pages/my-property/MyAssetsDashboard";
import { AddAssetForm } from "./pages/my-property/AddAssetForm";

const queryClient = new QueryClient();

// Hàm hỗ trợ: Chặn người dùng đã đăng nhập không cho vào trang Auth nữa
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              {/* ========================================== */}
              {/* 1. ROUTES CÔNG KHAI (Ai cũng xem được)       */}
              {/* ========================================== */}
              <Route path="/" element={<Marketplace />} />{" "}
              {/* Trang chủ là Chợ */}
              <Route path="/property/:id" element={<PropertyDetail />} />
              {/* Route Đăng nhập (Chỉ dành cho người chưa đăng nhập) */}
              <Route
                path="/auth"
                element={
                  <PublicOnlyRoute>
                    <Auth />
                  </PublicOnlyRoute>
                }
              />
              {/* ========================================== */}
              {/* 2. ROUTES THÀNH VIÊN (Member & Admin)        */}
              {/* ========================================== */}
              {/* Tính năng dự đoán AI */}
              <Route
                path="/predict"
                element={
                  <ProtectedRoute>
                    <IndexPredict />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-property"
                element={
                  <ProtectedRoute>
                    <MyAssetsDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-property/add"
                element={
                  <ProtectedRoute>
                    <AddAssetForm />
                  </ProtectedRoute>
                }
              />
              {/* Quản lý tin đăng & Đăng tin của Member */}
              <Route
                path="/member"
                element={
                  <ProtectedRoute allowedRoles={["Member", "Admin"]}>
                    <DashboardMarketPlace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/member/submit"
                element={
                  <ProtectedRoute allowedRoles={["Member", "Admin"]}>
                    <SubmitListing />
                  </ProtectedRoute>
                }
              />
              {/* ========================================== */}
              {/* 3. ROUTE QUẢN TRỊ VIÊN (Chỉ Admin)           */}
              {/* ========================================== */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
