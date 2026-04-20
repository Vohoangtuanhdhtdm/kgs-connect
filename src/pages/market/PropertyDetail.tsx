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

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-[420px] w-full rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Không tìm thấy bất động sản.</p>
        <Button asChild variant="link">
          <Link to="/">Quay lại Marketplace</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container grid gap-8 py-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="aspect-[16/10] bg-muted">
            <img
              src={data.img[active]}
              alt={data.title}
              className="h-full w-full object-cover"
            />
          </div>
          {data.img.length > 1 && (
            <div className="grid grid-cols-5 gap-1 p-1">
              {data.img.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActive(i)}
                  className={`overflow-hidden rounded-md border-2 ${i === active ? "border-primary" : "border-transparent"}`}
                >
                  <img
                    src={src}
                    alt={`thumb ${i}`}
                    className="aspect-[4/3] w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {data.title}
          </h1>
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {data.addressDetail}, {data.ward}, {data.district}, {data.city}
          </div>
          <div className="mt-4 flex items-baseline gap-4">
            <span className="text-3xl font-bold text-primary">
              {formatVnd(data.price, data.mode)}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatArea(data.area)}
            </span>
          </div>
        </div>

        <Card>
          <CardContent className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
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
            <Stat label="Loại" value={data.propertyType} />
          </CardContent>
        </Card>

        <div>
          <h2 className="mb-2 text-lg font-semibold">Mô tả</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {data.description}
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold">Vị trí</h2>
          <div className="flex aspect-[16/9] items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
            Google Maps placeholder
          </div>
        </div>
      </div>

      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <Badge variant="secondary">{data.propertyType}</Badge>
              <h3 className="mt-3 text-base font-semibold">
                {data.agentName ?? "Đại lý KGS"}
              </h3>
              <p className="text-xs text-muted-foreground">Đã xác minh</p>
            </div>
            <Button className="w-full" size="lg">
              <Phone className="mr-2 h-4 w-4" /> {data.agentPhone ?? "Liên hệ"}
            </Button>
            <Button variant="outline" className="w-full">
              Gửi tin nhắn
            </Button>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

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
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 text-sm font-medium">{value ?? "—"}</div>
    </div>
  );
}
