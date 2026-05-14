import {
  Building2,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Store,
  LogIn,
  User,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 1. LỌC ĐIỀU HƯỚNG THEO QUYỀN (RBAC)
  // Chỉ hiển thị những link mà người dùng có quyền truy cập
  const navLinks = [
    { to: "/", label: "Chợ BĐS", icon: Store, show: true }, // Ai cũng thấy
    {
      to: "/member",
      label: "Quản lý",
      icon: LayoutDashboard,
      show: isAuthenticated,
    }, // Chỉ user đã đăng nhập
    {
      to: "/admin",
      label: "Admin",
      icon: ShieldCheck,
      show: user?.roles?.includes("Admin"),
    }, // Chỉ Admin
    {
      to: "my-property",
      label: "Tài sản của tôi",
      icon: Building2,
      show: isAuthenticated,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold tracking-tight">
              KGS PropTech
            </div>
            <div className="text-[11px] text-muted-foreground">
              Sàn Giao Dịch BĐS
            </div>
          </div>
        </Link>

        {/* MENU ĐIỀU HƯỚNG (Đã được lọc) */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks
            .filter((link) => link.show) // Ẩn các link không có quyền
            .map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                activeClassName="!bg-secondary !text-foreground font-semibold"
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
        </nav>

        {/* NHÓM NÚT HÀNH ĐỘNG */}
        <div className="flex items-center gap-2">
          {/* Nút định giá AI: Ai cũng có thể dùng */}
          <Button
            size="sm"
            onClick={() => navigate("/predict")}
            className="hidden sm:inline-flex rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
          >
            Định giá AI
          </Button>

          {/* XỬ LÝ TRẠNG THÁI: ĐÃ ĐĂNG NHẬP VS CHƯA ĐĂNG NHẬP */}
          {isAuthenticated ? (
            <>
              <Button
                asChild
                size="sm"
                className="hidden sm:inline-flex rounded-xl"
              >
                <Link to="/member/submit">Đăng tin</Link>
              </Button>

              {/* Hiển thị Tên User thay vì chỉ để mỗi nút Sign Out */}
              <div className="hidden lg:flex items-center gap-2 px-3 text-sm font-medium text-muted-foreground border-l ml-2 pl-4">
                <User className="h-4 w-4" />
                <span className="max-w-[100px] truncate">{user?.name}</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="mr-2 h-4 w-4 hidden sm:inline-block" />
                Đăng xuất
              </Button>
            </>
          ) : (
            <Button
              asChild
              size="sm"
              className="rounded-xl border-primary text-primary"
              variant="outline"
            >
              <Link to="/auth">
                <LogIn className="mr-2 h-4 w-4" />
                Đăng nhập
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
