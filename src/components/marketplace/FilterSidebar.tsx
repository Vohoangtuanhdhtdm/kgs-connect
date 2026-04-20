import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListingFilters, PropertyType } from "@/types/listing";
import { Filter, X } from "lucide-react";

const CITIES = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Hải Phòng", "Cần Thơ"];
const TYPES: PropertyType[] = [
  "Apartment",
  "House",
  "Villa",
  "Townhouse",
  "Land",
  "Office",
];

const ALL = "__all__";

interface Props {
  value: ListingFilters;
  onChange: (next: ListingFilters) => void;
}

export function FilterSidebar({ value, onChange }: Props) {
  const update = (patch: Partial<ListingFilters>) =>
    onChange({ ...value, ...patch, page: 1 });

  const reset = () => onChange({ page: 1, pageSize: value.pageSize });

  return (
    <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-auto">
      <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">Bộ lọc</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="h-7 px-2 text-xs"
          >
            <X className="mr-1 h-3 w-3" /> Xoá
          </Button>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
              Thành phố
            </Label>
            <Select
              value={value.city ?? ALL}
              onValueChange={(v) => update({ city: v === ALL ? undefined : v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tất cả</SelectItem>
                {CITIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
              Loại BĐS
            </Label>
            <Select
              value={value.propertyType ?? ALL}
              onValueChange={(v) =>
                update({
                  propertyType: v === ALL ? undefined : (v as PropertyType),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tất cả</SelectItem>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
              Khoảng giá (VND)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Từ"
                value={value.minPrice ?? ""}
                onChange={(e) =>
                  update({
                    minPrice: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
              <Input
                type="number"
                placeholder="Đến"
                value={value.maxPrice ?? ""}
                onChange={(e) =>
                  update({
                    maxPrice: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Ví dụ: 1000000000 = 1 tỷ
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
              Diện tích (m²)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Từ"
                value={value.minArea ?? ""}
                onChange={(e) =>
                  update({
                    minArea: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
              <Input
                type="number"
                placeholder="Đến"
                value={value.maxArea ?? ""}
                onChange={(e) =>
                  update({
                    maxArea: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
