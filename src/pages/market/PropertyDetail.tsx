import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchListingById } from "@/services/listings";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Phone,
  MapPin,
  Compass,
  Bed,
  Bath,
  Building,
  Maximize2,
  MessageSquare,
  Map,
  User,
  BadgeCheck,
} from "lucide-react";
import { formatVnd, formatArea } from "@/lib/format";
import { useState } from "react";

export default function PropertyDetail() {
  const { id = "" } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => fetchListingById(id),
  });
  const [active, setActive] = useState(0);

  // 1. Cải thiện Loading State chân thực hơn với bố cục thực tế
  if (isLoading) {
    return (
      <div className="container grid gap-8 py-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Skeleton className="aspect-[16/10] w-full rounded-xl" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <aside>
          <Skeleton className="h-[250px] w-full rounded-xl" />
        </aside>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container flex min-h-[50vh] flex-col items-center justify-center text-center">
        <MapPin className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h2 className="text-xl font-semibold">Không tìm thấy bất động sản</h2>
        <p className="mb-6 text-muted-foreground">
          Tin đăng này có thể đã bị xóa hoặc không tồn tại.
        </p>
        <Button asChild>
          <Link to="/">Quay lại trang chủ</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container grid gap-8 py-8 lg:grid-cols-[1fr_340px]">
      {/* CỘT CHÍNH */}
      <div className="space-y-8">
        {/* Phần Hình Ảnh */}
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <div className="group relative aspect-[16/10] bg-muted">
            <img
              src={data.img[active]}
              alt={data.title}
              className="h-full w-full object-cover transition-opacity duration-300"
            />
          </div>

          {/* Cải thiện: Cuộn ngang cho thumbnail để không bị ép kích thước khi có quá nhiều ảnh */}
          {data.img.length > 1 && (
            <div className="flex gap-2 overflow-x-auto bg-muted/30 p-3 scrollbar-hide">
              {data.img.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActive(i)}
                  className={`relative shrink-0 overflow-hidden rounded-md transition-all duration-200 ${
                    i === active
                      ? "border-2 border-primary ring-2 ring-primary/20"
                      : "border-2 border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={src}
                    alt={`thumbnail ${i + 1}`}
                    className="h-16 w-24 object-cover sm:h-20 sm:w-28"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Thông tin cơ bản */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/20"
            >
              {data.propertyType}
            </Badge>
            <Badge variant="outline">{data.legalStatus}</Badge>
          </div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:leading-tight">
            {data.title}
          </h1>
          <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground sm:items-center">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0" />
            <span>
              {data.addressDetail}, {data.ward}, {data.district}, {data.city}
            </span>
          </div>
          <div className="mt-6 flex items-baseline gap-4 rounded-lg bg-muted/50 p-4 border border-border/50">
            <span className="text-3xl font-extrabold text-primary">
              {formatVnd(data.price, data.mode)}
            </span>
            <span className="text-base font-medium text-muted-foreground">
              / {formatArea(data.area)}
            </span>
          </div>
        </div>

        {/* Lưới Thông Số */}
        <div>
          <h2 className="mb-4 text-xl font-semibold tracking-tight">
            Tổng quan
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <Stat
              icon={<Bed className="h-4 w-4" />}
              label="Phòng ngủ"
              value={data.bedrooms}
            />
            <Stat
              icon={<Bath className="h-4 w-4" />}
              label="Phòng tắm"
              value={data.bathrooms}
            />
            <Stat
              icon={<Building className="h-4 w-4" />}
              label="Số tầng"
              value={data.floors}
            />
            <Stat
              icon={<Compass className="h-4 w-4" />}
              label="Hướng"
              value={data.houseDirection}
            />
            <Stat
              icon={<Maximize2 className="h-4 w-4" />}
              label="Diện tích"
              value={formatArea(data.area)}
            />
            <Stat label="Pháp lý" value={data.legalStatus} />
            <Stat label="Nội thất" value={data.furnitureState} />
            <Stat label="Loại BĐS" value={data.propertyType} />
          </div>
        </div>

        {/* Mô tả chi tiết */}
        <div>
          <h2 className="mb-4 text-xl font-semibold tracking-tight">
            Mô tả chi tiết
          </h2>
          <div className="rounded-xl border bg-card p-5 sm:p-6 shadow-sm">
            <p className="whitespace-pre-line text-sm leading-relaxed text-card-foreground/90">
              {data.description}
            </p>
          </div>
        </div>

        {/* Bản đồ */}
        <div>
          <h2 className="mb-4 text-xl font-semibold tracking-tight">
            Vị trí trên bản đồ
          </h2>
          <div className="flex aspect-[16/7] items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/30 text-muted-foreground shadow-inner">
            <div className="flex flex-col items-center gap-2">
              <Map className="h-8 w-8 text-muted-foreground/50" />
              <span className="text-sm font-medium">
                Bản đồ đang được cập nhật
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CỘT SIDEBAR */}
      <aside className="lg:sticky lg:top-24 lg:h-fit mt-8 lg:mt-0">
        <Card className="shadow-lg border-primary/10">
          <CardContent className="space-y-6 p-6">
            {/* Thông tin đại lý */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {data.agentName ?? "Đại lý KGS"}
                </h3>
                <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <BadgeCheck className="h-4 w-4" /> Đã xác minh
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                className="w-full text-base h-11 shadow-md transition-transform hover:-translate-y-0.5"
                size="lg"
              >
                <Phone className="mr-2 h-5 w-5" />
                {data.agentPhone ?? "Liên hệ ngay"}
              </Button>
              <Button
                variant="outline"
                className="w-full h-11 text-muted-foreground hover:text-foreground"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Gửi tin nhắn
              </Button>
            </div>

            <div className="rounded-lg bg-muted/50 p-3 text-center text-xs text-muted-foreground">
              Vui lòng báo cho người bán rằng bạn tìm thấy tin đăng này trên nền
              tảng của chúng tôi.
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

// 3. Cải thiện component Stat: Thêm background và layout dạng khối để nhìn rõ ràng hơn
function Stat({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-border/50 bg-muted/20 p-3 transition-colors hover:bg-muted/50">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        {icon && <span className="text-foreground/60">{icon}</span>}
        {label}
      </div>
      <div
        className="text-sm font-semibold text-foreground truncate"
        title={String(value ?? "—")}
      >
        {value ?? "—"}
      </div>
    </div>
  );
}
