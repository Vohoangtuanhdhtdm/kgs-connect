import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Loader2,
  MapPin,
  Search,
  Wallet,
  Image as ImageIcon,
} from "lucide-react";

// Tái sử dụng các UI Components (shadcn/ui)
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
import { createAsset } from "@/services/assetApi";
import { assetFormSchema, AssetFormValues } from "@/util/assetFormUtils";
import { AssetType, CreateAssetRequest } from "@/types/asset";
import { formatVnd } from "@/lib/format";
import { LocationPicker } from "../market/LocationPicker";
import { ImageDropzone } from "@/components/dashboard/ImageDropzone";

interface AddAssetFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AddAssetForm: React.FC<AddAssetFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [files, setFiles] = useState<File[]>([]); // State quản lý file ảnh
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      type: AssetType.House,
      estimatedValue: undefined,
    },
  });

  // Lắng nghe giá trị để Render UI
  const watchPrice = watch("estimatedValue");
  const watchLat = watch("latitude");
  const watchLng = watch("longitude");

  // Khởi tạo tọa độ cho LocationPicker
  const mapPosition: [number, number] | null =
    watchLat && watchLng ? [watchLat, watchLng] : null;

  const mutation = useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      toast.success("Đã thêm tài sản thành công", {
        description: "Tài sản đã được lưu vào danh mục cá nhân.",
      });
      queryClient.invalidateQueries({ queryKey: ["my-assets"] });
      if (onSuccess) onSuccess();
    },
    onError: (e: any) => {
      toast.error("Lưu thất bại", {
        description: e?.message ?? "Vui lòng kiểm tra lại thông tin.",
      });
    },
  });

  const onSubmit = (data: AssetFormValues) => {
    const formData = new FormData();

    // Đẩy các dữ liệu text vào FormData
    formData.append("Name", data.name);
    formData.append("Address", data.address);
    formData.append("Latitude", String(data.latitude));
    formData.append("Longitude", String(data.longitude));
    formData.append("Type", String(data.type));

    if (data.estimatedValue) {
      formData.append("EstimatedValue", String(data.estimatedValue));
    }
    if (data.notes) {
      formData.append("Notes", data.notes);
    }

    // Đẩy File ảnh vào (nếu người dùng có chọn ảnh)
    if (files.length > 0) {
      formData.append("Thumbnail", files[0]);
    }

    // Gửi đi (Lưu ý: Bạn cần đổi kiểu nhận của mutation nếu TypeScript báo đỏ)
    mutation.mutate(formData as any);
  };

  // Dịch địa chỉ sang Tọa độ (Tái cấu trúc giống SubmitListing)
  const handleGeocode = async () => {
    const address = getValues("address");

    if (!address || address.length < 5) {
      toast.error("Thiếu thông tin", {
        description: "Vui lòng nhập địa chỉ cụ thể trước khi dò vị trí.",
      });
      return;
    }

    setIsGeocoding(true);
    try {
      // Gọi API Nominatim của OpenStreetMap
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        setValue("latitude", lat, { shouldValidate: true });
        setValue("longitude", lng, { shouldValidate: true });

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

  // Helper hiển thị lỗi
  const ErrorMessage = ({ name }: { name: keyof AssetFormValues }) => {
    const error = errors[name];
    if (!error) return null;
    return <p className="mt-1 text-xs text-destructive">{error.message}</p>;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Thêm tài sản mới</h2>
        <p className="text-sm text-muted-foreground">
          Quản lý danh mục đầu tư nội bộ. Dữ liệu này hoàn toàn bảo mật.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`space-y-6 transition-opacity duration-200 ${
          mutation.isPending ? "opacity-70 pointer-events-none" : ""
        }`}
      >
        {/* --- 1. THÔNG TIN ĐỊNH DANH --- */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Wallet className="h-4 w-4" /> Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label>
                Tên định danh <span className="text-destructive">*</span>
              </Label>
              <Input
                {...register("name")}
                placeholder="VD: Căn hộ số 05, Nhà hẻm Quận 3..."
                className="mt-1.5"
              />
              <ErrorMessage name="name" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label>
                  Loại tài sản <span className="text-destructive">*</span>
                </Label>
                <div className="mt-1.5">
                  <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                      <Select
                        // Ép kiểu sang string cho shadcn UI Select
                        value={field.value?.toString()}
                        // Ép kiểu ngược lại thành number cho react-hook-form
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại tài sản" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={AssetType.Apartment.toString()}>
                            Căn hộ chung cư
                          </SelectItem>
                          <SelectItem value={AssetType.House.toString()}>
                            Nhà riêng
                          </SelectItem>
                          <SelectItem value={AssetType.Land.toString()}>
                            Đất nền
                          </SelectItem>
                          <SelectItem value={AssetType.Commercial.toString()}>
                            Mặt bằng thương mại
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div>
                <Label>Định giá ước tính (VNĐ)</Label>
                <Input
                  type="number"
                  {...register("estimatedValue")}
                  placeholder="VD: 3500000000"
                  className="mt-1.5"
                />
                <p className="mt-1.5 text-sm font-medium text-primary">
                  {watchPrice ? formatVnd(watchPrice) : "0 VND"}
                </p>
                <ErrorMessage name="estimatedValue" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- 2. VỊ TRÍ & BẢN ĐỒ --- */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Vị trí & Địa chỉ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label>
                Địa chỉ thực tế <span className="text-destructive">*</span>
              </Label>
              <Input
                {...register("address")}
                placeholder="Số nhà, Tên đường, Phường, Quận, Thành phố"
                className="mt-1.5"
              />
              <ErrorMessage name="address" />
            </div>

            {/* Tích hợp Location Picker kèm Nút dò vị trí tự động */}
            <div className="pt-4 border-t border-border/50">
              <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <Label className="text-base font-semibold">
                    Xác nhận vị trí trên bản đồ{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Hệ thống sẽ dùng địa chỉ trên để dò tìm tọa độ, hoặc bạn có
                    thể tự click ghim.
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
                      <Search className="mr-2 h-4 w-4" /> Dò tọa độ
                    </>
                  )}
                </Button>
              </div>

              <LocationPicker
                position={mapPosition}
                onChange={([lat, lng]) => {
                  setValue("latitude", lat, { shouldValidate: true });
                  setValue("longitude", lng, { shouldValidate: true });
                }}
              />

              {mapPosition ? (
                <div className="mt-2 flex justify-between items-center text-xs">
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Đã ghim thành công
                  </span>
                  <span className="text-muted-foreground font-mono">
                    {watchLat?.toFixed(6)}, {watchLng?.toFixed(6)}
                  </span>
                </div>
              ) : (
                <ErrorMessage name="latitude" />
              )}
            </div>
          </CardContent>
        </Card>

        {/* --- 3. DỮ LIỆU BỔ SUNG --- */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Bổ sung & Ghi chú
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label>Hình ảnh minh họa (Tùy chọn)</Label>
              <div className="mt-1.5">
                <ImageDropzone
                  value={files}
                  onChange={setFiles}
                  max={1} // Giới hạn 1 ảnh làm Thumbnail cho Tài sản
                />
              </div>
            </div>

            <div>
              <Label>Ghi chú nội bộ</Label>
              <Textarea
                rows={3}
                {...register("notes")}
                placeholder="Lịch sử mua bán, tình trạng pháp lý, thông tin người thuê cũ..."
                className="mt-1.5"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Ghi chú này sẽ không được hiển thị khi bạn đăng tin công khai.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* --- ACTIONS --- */}
        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={mutation.isPending}
            >
              Huỷ bỏ
            </Button>
          )}
          <Button
            type="submit"
            disabled={mutation.isPending || !watchLat || !watchLng}
            className="min-w-[140px]"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...
              </>
            ) : (
              "Lưu tài sản"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
