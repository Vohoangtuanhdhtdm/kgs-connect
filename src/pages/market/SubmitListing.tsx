import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Villa",
  "Townhouse",
  "Land",
  "Office",
] as const;
const DIRECTIONS = [
  "East",
  "West",
  "South",
  "North",
  "NorthEast",
  "NorthWest",
  "SouthEast",
  "SouthWest",
] as const;
const LEGAL = ["RedBook", "PinkBook", "SaleContract", "Pending"] as const;
const FURNITURE = ["Full", "Basic", "None"] as const;

const schema = z.object({
  Title: z.string().min(8, "Tiêu đề tối thiểu 8 ký tự").max(160),
  Description: z.string().min(20, "Mô tả tối thiểu 20 ký tự"),
  Price: z.coerce.number().positive("Giá phải lớn hơn 0"),
  City: z.string().min(1, "Bắt buộc"),
  District: z.string().min(1, "Bắt buộc"),
  Ward: z.string().min(1, "Bắt buộc"),
  AddressDetail: z.string().min(1, "Bắt buộc"),
  Area: z.coerce.number().positive("Diện tích phải > 0"),
  Frontage: z.coerce.number().nonnegative().optional(),
  PropertyType: z.enum(PROPERTY_TYPES),
  Floors: z.coerce.number().int().nonnegative().optional(),
  Bedrooms: z.coerce.number().int().nonnegative().optional(),
  Bathrooms: z.coerce.number().int().nonnegative().optional(),
  HouseDirection: z.enum(DIRECTIONS).optional(),
  LegalStatus: z.enum(LEGAL),
  FurnitureState: z.enum(FURNITURE),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

export default function SubmitListing() {
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      PropertyType: "Apartment",
      LegalStatus: "RedBook",
      FurnitureState: "Basic",
    },
  });

  const mutation = useMutation({
    mutationFn: (fd: FormData) => submitListing(fd),
    onSuccess: () => {
      toast.success("Đăng tin thành công", {
        description: "Tin của bạn đang chờ duyệt.",
      });
      qc.invalidateQueries({ queryKey: ["my-listings"] });
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
      toast.error("Vui lòng thêm ít nhất 1 ảnh");
      return;
    }
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") fd.append(k, String(v));
    });
    files.forEach((f) => fd.append("Images", f));
    mutation.mutate(fd);
  };

  const err = (k: keyof FormInput) =>
    errors[k] && (
      <p className="mt-1 text-xs text-destructive">
        {(errors as any)[k]?.message as string}
      </p>
    );

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Đăng tin mới</h1>
        <p className="text-sm text-muted-foreground">
          Cung cấp thông tin chính xác để tin đăng được duyệt nhanh hơn.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Tiêu đề *</Label>
              <Input
                {...register("Title")}
                placeholder="VD: Bán căn hộ 2PN view sông Quận 2"
              />
              {err("Title")}
            </div>
            <div>
              <Label>Mô tả *</Label>
              <Textarea
                rows={5}
                {...register("Description")}
                placeholder="Mô tả chi tiết về bất động sản..."
              />
              {err("Description")}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Giá (VND) *</Label>
                <Input
                  type="number"
                  {...register("Price")}
                  placeholder="VD: 5500000000"
                />
                {err("Price")}
              </div>
              <div>
                <Label>Loại BĐS *</Label>
                <Controller
                  control={control}
                  name="PropertyType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Địa chỉ</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Tỉnh / Thành phố *</Label>
              <Input {...register("City")} placeholder="Hồ Chí Minh" />
              {err("City")}
            </div>
            <div>
              <Label>Quận / Huyện *</Label>
              <Input {...register("District")} placeholder="Quận 1" />
              {err("District")}
            </div>
            <div>
              <Label>Phường / Xã *</Label>
              <Input {...register("Ward")} placeholder="Phường Bến Nghé" />
              {err("Ward")}
            </div>
            <div>
              <Label>Địa chỉ chi tiết *</Label>
              <Input
                {...register("AddressDetail")}
                placeholder="Số 12 Đường Nguyễn Huệ"
              />
              {err("AddressDetail")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Đặc điểm</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label>Diện tích (m²) *</Label>
              <Input type="number" {...register("Area")} />
              {err("Area")}
            </div>
            <div>
              <Label>Mặt tiền (m)</Label>
              <Input type="number" step="0.1" {...register("Frontage")} />
            </div>
            <div>
              <Label>Số tầng</Label>
              <Input type="number" {...register("Floors")} />
            </div>
            <div>
              <Label>Phòng ngủ</Label>
              <Input type="number" {...register("Bedrooms")} />
            </div>
            <div>
              <Label>Phòng tắm</Label>
              <Input type="number" {...register("Bathrooms")} />
            </div>
            <div>
              <Label>Hướng nhà</Label>
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
            <div>
              <Label>Pháp lý *</Label>
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
            <div>
              <Label>Nội thất *</Label>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hình ảnh *</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageDropzone value={files} onChange={setFiles} max={10} />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Huỷ
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Đang gửi..." : "Đăng tin"}
          </Button>
        </div>
      </form>
    </div>
  );
}
