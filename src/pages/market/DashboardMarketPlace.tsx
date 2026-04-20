import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardMarketPlace() {
  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Tin đăng của tôi
          </h1>
          <p className="text-sm text-muted-foreground">
            Quản lý các tin bạn đã đăng.
          </p>
        </div>
        <Button asChild>
          <Link to="/member/submit">
            <Plus className="mr-2 h-4 w-4" /> Đăng tin mới
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Phần "My Listings" sẽ hiển thị tại đây sau khi tích hợp{" "}
            <code>GET /my-listings</code>.
          </p>
          <Button asChild variant="link">
            <Link to="/member/submit">Đăng tin đầu tiên →</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
