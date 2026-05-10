import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, MapPin, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageDropzone } from "@/components/dashboard/ImageDropzone";

import { submitListing } from "@/services/listings";
import {
  DIRECTIONS,
  FURNITURE,
  LEGAL,
  PROPERTY_TYPES,
} from "@/types/property/property";

import { LocationPicker } from "./LocationPicker";
import { formatVnd } from "@/lib/format";

const optionalNumber = z.preprocess(
  (val) => (val === "" || val === undefined ? undefined : Number(val)),
  z.number().nonnegative("Không được là số âm").optional(),
);

const schema = z.object({
  Title: z.string().min(8, "Tiêu đề tối thiểu 8 ký tự").max(160),
  Description: z.string().min(20, "Mô tả tối thiểu 20 ký tự"),
  Price: z.coerce.number().positive("Giá phải lớn hơn 0"),
  City: z.string().min(1, "Vui lòng nhập Tỉnh/Thành phố"),
  District: z.string().min(1, "Vui lòng nhập Quận/Huyện"),
  Ward: z.string().min(1, "Vui lòng nhập Phường/Xã"),
  AddressDetail: z.string().min(1, "Vui lòng nhập Địa chỉ chi tiết"),
  Area: z.coerce.number().positive("Diện tích phải lớn hơn 0"),
  Frontage: optionalNumber,
  PropertyType: z.enum(PROPERTY_TYPES),
  Floors: optionalNumber,
  Bedrooms: optionalNumber,
  Bathrooms: optionalNumber,
  HouseDirection: z.enum(DIRECTIONS).optional(),
  LegalStatus: z.enum(LEGAL),
  FurnitureState: z.enum(FURNITURE),
  // Thêm 2 trường tọa độ (Cho phép optional để người dùng có thể không chọn nếu vội)
  Latitude: z.number().optional(),
  Longitude: z.number().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function SubmitListing() {
  const [files, setFiles] = useState<File[]>([]);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      PropertyType: "Apartment",
      LegalStatus: "RedBook",
      FurnitureState: "Basic",
    },
  });

  // Lắng nghe giá trị để Render UI
  const watchPrice = watch("Price");
  const watchLat = watch("Latitude");
  const watchLng = watch("Longitude");

  // Khởi tạo tọa độ cho LocationPicker
  const mapPosition: [number, number] | null =
    watchLat && watchLng ? [watchLat, watchLng] : null;

  const mutation = useMutation({
    mutationFn: submitListing,
    onSuccess: () => {
      toast.success("Đăng tin thành công", {
        description: "Tin của bạn đang chờ duyệt.",
      });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      navigate("/member");
    },
    onError: (e: any) => {
      toast.error("Đăng tin thất bại", {
        description: e?.message ?? "Vui lòng thử lại.",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    if (files.length === 0) {
      toast.error("Vui lòng tải lên ít nhất 1 hình ảnh.");
      return;
    }

    const formData = new FormData();

    // Tự động append tất cả các field, bao gồm cả Latitude và Longitude (nếu có)
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, String(value));
      }
    });

    files.forEach((file) => formData.append("Images", file));
    mutation.mutate(formData);
  };

  // Dịch địa chỉ sang Tọa độ
  const handleGeocode = async () => {
    const { City, District, Ward, AddressDetail } = getValues();

    if (!City || !District) {
      toast.error("Thiếu thông tin", {
        description:
          "Vui lòng nhập ít nhất Tỉnh/Thành và Quận/Huyện để tìm vị trí.",
      });
      return;
    }

    setIsGeocoding(true);
    try {
      // Ghép chuỗi địa chỉ (Thêm "Vietnam" để API trả kết quả chuẩn hơn)
      const searchQuery = [AddressDetail, Ward, District, City, "Vietnam"]
        .filter(Boolean)
        .join(", ");

      // Gọi API Nominatim của OpenStreetMap (Miễn phí)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
      );

      const data = await res.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        // Cập nhật giá trị vào form, Map sẽ tự động re-render và bay tới
        setValue("Latitude", lat);
        setValue("Longitude", lng);

        toast.success("Đã tìm thấy vị trí!", {
          description: "Bản đồ đã được cập nhật.",
        });
      } else {
        toast.error("Không tìm thấy địa chỉ", {
          description:
            "Hãy thử kiểm tra lại lỗi chính tả hoặc tự ghim trên bản đồ.",
        });
      }
    } catch (error) {
      toast.error("Lỗi kết nối", {
        description: "Không thể dò vị trí lúc này.",
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  const ErrorMessage = ({ name }: { name: keyof FormValues }) => {
    const error = errors[name];
    if (!error) return null;
    return <p className="mt-1 text-xs text-destructive">{error.message}</p>;
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Đăng tin mới</h1>
        <p className="text-sm text-muted-foreground">
          Cung cấp thông tin chính xác để tin đăng được duyệt nhanh hơn.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`space-y-6 transition-opacity duration-200 ${mutation.isPending ? "opacity-70 pointer-events-none" : ""}`}
      >
        {/* --- 1. THÔNG TIN CƠ BẢN --- */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label>
                Tiêu đề <span className="text-destructive">*</span>
              </Label>
              <Input
                {...register("Title")}
                placeholder="VD: Bán căn hộ 2PN view sông..."
                className="mt-1.5"
              />
              <ErrorMessage name="Title" />
            </div>
            <div>
              <Label>
                Mô tả <span className="text-destructive">*</span>
              </Label>
              <Textarea
                rows={5}
                {...register("Description")}
                placeholder="Mô tả chi tiết..."
                className="mt-1.5"
              />
              <ErrorMessage name="Description" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label>
                  Giá <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  {...register("Price")}
                  placeholder="VD: 5500000000"
                  className="mt-1.5"
                />
                <p className="mt-1.5 text-sm font-medium text-primary">
                  {watchPrice ? formatVnd(watchPrice) : "0 VND"}
                </p>
                <ErrorMessage name="Price" />
              </div>
              <div>
                <Label>
                  Loại BĐS <span className="text-destructive">*</span>
                </Label>
                <div className="mt-1.5">
                  <Controller
                    control={control}
                    name="PropertyType"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROPERTY_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- 2. ĐỊA CHỈ & BẢN ĐỒ --- */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Vị trí & Địa chỉ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label>
                  Tỉnh / Thành phố <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...register("City")}
                  placeholder="Hồ Chí Minh"
                  className="mt-1.5"
                />
                <ErrorMessage name="City" />
              </div>
              <div>
                <Label>
                  Quận / Huyện <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...register("District")}
                  placeholder="Quận 1"
                  className="mt-1.5"
                />
                <ErrorMessage name="District" />
              </div>
              <div>
                <Label>
                  Phường / Xã <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...register("Ward")}
                  placeholder="Phường Bến Nghé"
                  className="mt-1.5"
                />
                <ErrorMessage name="Ward" />
              </div>
              <div>
                <Label>
                  Địa chỉ chi tiết <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...register("AddressDetail")}
                  placeholder="Số 12 Đường Nguyễn Huệ"
                  className="mt-1.5"
                />
                <ErrorMessage name="AddressDetail" />
              </div>
            </div>

            {/* Tích hợp Location Picker kèm Nút dò vị trí tự động */}
            <div className="pt-4 border-t border-border/50">
              <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <Label className="text-base font-semibold">
                    Xác nhận vị trí trên bản đồ
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Hệ thống sẽ dùng địa chỉ bạn vừa nhập để dò tìm tọa độ, hoặc
                    bạn có thể tự click ghim.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleGeocode}
                  disabled={isGeocoding}
                  className="shrink-0"
                >
                  {isGeocoding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang
                      dò...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" /> Tìm vị trí từ địa chỉ
                    </>
                  )}
                </Button>
              </div>

              <LocationPicker
                position={mapPosition}
                onChange={([lat, lng]) => {
                  setValue("Latitude", lat);
                  setValue("Longitude", lng);
                }}
              />

              {mapPosition && (
                <div className="mt-2 flex justify-between items-center text-xs">
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Đã ghim thành công
                  </span>
                  <span className="text-muted-foreground font-mono">
                    {watchLat?.toFixed(6)}, {watchLng?.toFixed(6)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* --- 3. ĐẶC ĐIỂM --- */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Đặc điểm</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-3">
            <div>
              <Label>
                Diện tích (m²) <span className="text-destructive">*</span>
              </Label>
              <Input type="number" {...register("Area")} className="mt-1.5" />
              <ErrorMessage name="Area" />
            </div>
            <div>
              <Label>Mặt tiền (m)</Label>
              <Input
                type="number"
                step="0.1"
                {...register("Frontage")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Số tầng</Label>
              <Input type="number" {...register("Floors")} className="mt-1.5" />
            </div>
            <div>
              <Label>Phòng ngủ</Label>
              <Input
                type="number"
                {...register("Bedrooms")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Phòng tắm</Label>
              <Input
                type="number"
                {...register("Bathrooms")}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Hướng nhà</Label>
              <div className="mt-1.5">
                <Controller
                  control={control}
                  name="HouseDirection"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn hướng" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIRECTIONS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div>
              <Label>
                Pháp lý <span className="text-destructive">*</span>
              </Label>
              <div className="mt-1.5">
                <Controller
                  control={control}
                  name="LegalStatus"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LEGAL.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div>
              <Label>
                Nội thất <span className="text-destructive">*</span>
              </Label>
              <div className="mt-1.5">
                <Controller
                  control={control}
                  name="FurnitureState"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FURNITURE.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- 4. HÌNH ẢNH --- */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">
              Hình ảnh <span className="text-destructive">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ImageDropzone value={files} onChange={setFiles} max={10} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={mutation.isPending}
          >
            Huỷ
          </Button>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="min-w-[120px]"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Xử lý...
              </>
            ) : (
              "Đăng tin"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
