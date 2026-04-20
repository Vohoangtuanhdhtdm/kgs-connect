import { Card, CardContent } from "@/components/ui/card";

export default function Admin() {
  return (
    <div className="container max-w-6xl py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Quản trị — Tin chờ duyệt</h1>
        <p className="text-sm text-muted-foreground">
          Bảng tin sẽ hiển thị tại đây sau khi tích hợp <code>GET /admin/pending-listings</code>.
        </p>
      </div>
      <Card>
        <CardContent className="py-16 text-center text-sm text-muted-foreground">
          Sắp ra mắt — sẽ dùng React Query <code>invalidateQueries</code> để tự refresh sau khi approve/reject.
        </CardContent>
      </Card>
    </div>
  );
}
