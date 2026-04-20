import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Ruler, FileText, Loader2 } from "lucide-react";
import { FormData } from "@/pages/predict-home/IndexPredict";

interface Props {
  onSubmit: (data: FormData) => void;
  loading: boolean;
}

const DIRECTIONS = [
  { label: "Đông", value: "Đông" },
  { label: "Tây", value: "Tây" },
  { label: "Nam", value: "Nam" },
  { label: "Bắc", value: "Bắc" },
  { label: "Đông - Nam", value: "Đông - Nam" },
  { label: "Đông - Bắc", value: "Đông - Bắc" },
  { label: "Tây - Nam", value: "Tây - Nam" },
  { label: "Tây - Bắc", value: "Tây - Bắc" },
  { label: "Không rõ / Bỏ qua", value: "Not_Specified" },
];
const LEGAL = [
  { label: "Đã có sổ hồng/đỏ", value: "Have certificate" },
  { label: "Hợp đồng mua bán", value: "Sale contract" },
  { label: "Chưa rõ pháp lý", value: "Not_Specified" },
];
const FURNITURE = [
  { label: "Nội thất cơ bản", value: "Basic" },
  { label: "Đầy đủ nội thất (Full)", value: "Full" },
  { label: "Không áp dụng", value: "Not_Applicable" },
];
const PROPERTY_TYPE = [
  { label: "Nhà ở (House)", value: "House" },
  { label: "Đất nền (Land)", value: "Land" },
];

export const ValuationForm = ({ onSubmit, loading }: Props) => {
  const [form, setForm] = useState<FormData>({
    addressDetail: "",
    city: "",
    district: "",
    ward: "",
    area: 0,
    frontage: 0,
    accessRoad: 0,
    floors: 0,
    bedrooms: 0,
    bathrooms: 0,
    houseDirection: "",
    legalStatus: "",
    furnitureState: "",
    propertyType: "House", // Mặc định là Nhà
  });

  const [locations, setLocations] = useState<any[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<any[]>([]);
  const [availableWards, setAvailableWards] = useState<any[]>([]);

  // Tự động tải dữ liệu hành chính VN
  useEffect(() => {
    const CACHE_KEY = "kgs_vn_locations_cache";
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      setLocations(JSON.parse(cachedData));
    } else {
      fetch("https://provinces.open-api.vn/api/?depth=3")
        .then((res) => res.json())
        .then((data) => {
          setLocations(data);
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        })
        .catch((err) => console.error("Lỗi tải dữ liệu địa phương:", err));
    }
  }, []);

  const set = (key: keyof FormData, value: string | number) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleCityChange = (cityName: string) => {
    setForm((p) => ({ ...p, city: cityName, district: "", ward: "" }));
    const selectedCity = locations.find((c) => c.name === cityName);
    setAvailableDistricts(selectedCity ? selectedCity.districts : []);
    setAvailableWards([]);
  };

  const handleDistrictChange = (districtName: string) => {
    setForm((p) => ({ ...p, district: districtName, ward: "" }));
    const selectedDistrict = availableDistricts.find(
      (d) => d.name === districtName,
    );
    setAvailableWards(selectedDistrict ? selectedDistrict.wards : []);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isLand = form.propertyType === "Land";

    const cleanData = {
      ...form,
      city: form.city.replace(/^(Thành phố|Tỉnh)\s+/i, ""),
      district: form.district.replace(/^(Quận|Huyện|Thị xã|Thành phố)\s+/i, ""),
      ward: form.ward.replace(/^(Phường|Xã|Thị trấn)\s+/i, ""),
      // 2. TỰ ĐỘNG GÁN GIÁ TRỊ NẾU LÀ ĐẤT NỀN
      floors: isLand ? 0 : form.floors,
      bedrooms: isLand ? 0 : form.bedrooms,
      bathrooms: isLand ? 0 : form.bathrooms,
      houseDirection: form.houseDirection || "Not_Specified",
      legalStatus: form.legalStatus || "Not_Specified",
      furnitureState: isLand ? "Not_Applicable" : form.furnitureState,
    };
    onSubmit(cleanData);
  };

  // Kiểm tra trạng thái hiện tại là Đất hay Nhà
  const isLand = form.propertyType === "Land";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Vị trí */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4 text-primary" /> Vị trí bất động sản
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="col-span-3 space-y-1.5">
            <Label>Địa chỉ chi tiết (Tùy chọn)</Label>
            <Input
              value={form.addressDetail}
              onChange={(e) => set("addressDetail", e.target.value)}
              placeholder="VD: 123 Nguyễn Văn Linh..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>
              Tỉnh / Thành phố <span className="text-red-500">*</span>
            </Label>
            <Select value={form.city} onValueChange={handleCityChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn Tỉnh/Thành" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {locations.map((city) => (
                  <SelectItem key={city.code} value={city.name}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>
              Quận / Huyện <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.district}
              onValueChange={handleDistrictChange}
              disabled={!form.city}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn Quận/Huyện" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {availableDistricts.map((district) => (
                  <SelectItem key={district.code} value={district.name}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>
              Phường / Xã <span className="text-red-500">*</span>
            </Label>
            <Select
              value={form.ward}
              onValueChange={(v) => set("ward", v)}
              disabled={!form.district}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn Phường/Xã" />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {availableWards.map((ward) => (
                  <SelectItem key={ward.code} value={ward.name}>
                    {ward.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Thông số kỹ thuật */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Ruler className="h-4 w-4 text-primary" /> Thông số kỹ thuật
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Diện tích (m²)</Label>
            <Input
              type="number"
              min={0}
              step="any"
              value={form.area || ""}
              onChange={(e) => set("area", parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Mặt tiền (m)</Label>
            <Input
              type="number"
              min={0}
              step="any"
              value={form.frontage || ""}
              onChange={(e) => set("frontage", parseFloat(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Đường vào (m)</Label>
            <Input
              type="number"
              min={0}
              step="any"
              value={form.accessRoad || ""}
              onChange={(e) =>
                set("accessRoad", parseFloat(e.target.value) || 0)
              }
              placeholder="0"
            />
          </div>

          {/* 3. ĐIỀU KIỆN RENDER: Chỉ hiện khi là Nhà ở */}
          {!isLand && (
            <>
              <div className="space-y-1.5">
                <Label>Số tầng</Label>
                <Input
                  type="number"
                  min={0}
                  step="any"
                  value={form.floors || ""}
                  onChange={(e) =>
                    set("floors", parseFloat(e.target.value) || 0)
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phòng ngủ</Label>
                <Input
                  type="number"
                  min={0}
                  step="any"
                  value={form.bedrooms || ""}
                  onChange={(e) =>
                    set("bedrooms", parseFloat(e.target.value) || 0)
                  }
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phòng tắm</Label>
                <Input
                  type="number"
                  min={0}
                  step="any"
                  value={form.bathrooms || ""}
                  onChange={(e) =>
                    set("bathrooms", parseFloat(e.target.value) || 0)
                  }
                  placeholder="0"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pháp lý & Trạng thái */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" /> Pháp lý & Loại hình
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Loại BĐS"
            value={form.propertyType}
            options={PROPERTY_TYPE}
            onChange={(v) => set("propertyType", v)}
          />
          <SelectField
            label="Pháp lý"
            value={form.legalStatus}
            options={LEGAL}
            onChange={(v) => set("legalStatus", v)}
          />
          <SelectField
            label="Hướng BĐS"
            value={form.houseDirection}
            options={DIRECTIONS}
            onChange={(v) => set("houseDirection", v)}
          />
          {/* Chỉ hiện Tình trạng nội thất nếu là Nhà */}
          {!isLand && (
            <SelectField
              label="Nội thất"
              value={form.furnitureState}
              options={FURNITURE}
              onChange={(v) => set("furnitureState", v)}
            />
          )}
        </CardContent>
      </Card>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading || !form.city || !form.district || !form.ward}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Đang xử lý...
          </>
        ) : (
          "Định giá ngay"
        )}
      </Button>
    </form>
  );
};

// Cập nhật SelectField để nhận mảng Object chứa label và value
const SelectField = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) => (
  <div className="space-y-1.5">
    <Label>{label}</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={`Chọn ${label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
