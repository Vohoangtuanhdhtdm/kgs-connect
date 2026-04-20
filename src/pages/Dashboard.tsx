import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, LogOut } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-foreground">KGS</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.name ?? user?.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="rounded-xl"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/predict")}
              className="rounded-xl bg-green-400 text-white hover:bg-green-500"
            >
              Định giá ngay
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, {user?.name ?? "User"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your real estate valuation dashboard
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {["Active Valuations", "Completed Reports", "Pending Reviews"].map(
              (title, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm"
                >
                  <p className="text-sm text-muted-foreground">{title}</p>
                  <p className="mt-2 text-3xl font-bold text-foreground">0</p>
                </div>
              ),
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
