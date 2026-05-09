import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchMyListings } from "@/services/listings";
import { formatVnd } from "@/util/Helper";

export default function DashboardMarketPlace() {
  const { data: listings, isLoading } = useQuery({
    queryKey: ["my-listings"],
    queryFn: fetchMyListings,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
          >
            <Clock className="mr-1 h-3 w-3" /> Chờ duyệt
          </Badge>
        );
      case "Approved":
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 hover:bg-green-100"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" /> Đã duyệt
          </Badge>
        );
      case "Rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" /> Bị từ chối
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Tin đăng của tôi
          </h1>
          <p className="text-sm text-muted-foreground">
            Quản lý các tin bạn đã đăng và theo dõi trạng thái kiểm duyệt.
          </p>
        </div>
        <Button asChild>
          <Link to="/member/submit">
            <Plus className="mr-2 h-4 w-4" /> Đăng tin mới
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !listings || listings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
              <MapPin className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-lg font-semibold">
              Bạn chưa có tin đăng nào
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Hãy đăng tin bất động sản đầu tiên của bạn để bắt đầu tiếp cận
              khách hàng.
            </p>
            <Button asChild>
              <Link to="/member/submit">Đăng tin đầu tiên →</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Card
              key={listing.id}
              className="overflow-hidden transition-all hover:shadow-md"
            >
              <div className="relative aspect-video bg-muted">
                {listing.img && listing.img.length > 0 ? (
                  <img
                    src={listing.img[0]}
                    alt={listing.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Không có ảnh
                  </div>
                )}
                <div className="absolute right-2 top-2">
                  {getStatusBadge(listing.status)}
                </div>
              </div>
              <CardContent className="p-4">
                <h3
                  className="line-clamp-1 font-semibold"
                  title={listing.title}
                >
                  {listing.title}
                </h3>
                <div className="mt-1 flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-3 w-3" />
                  <span className="line-clamp-1">
                    {listing.district}, {listing.city}
                  </span>
                </div>
                <div className="mt-3 font-bold text-primary">
                  {formatVnd(listing.price)}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Đăng ngày:{" "}
                  {new Date(listing.createdAt).toLocaleDateString("vi-VN")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
