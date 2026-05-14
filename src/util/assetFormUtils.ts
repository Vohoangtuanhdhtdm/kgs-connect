import { z } from "zod";
import { AssetType } from "@/types/asset";

// 1. Zod Schema siêu chặt chẽ
export const assetFormSchema = z.object({
  name: z.string().min(5, "Tên tài sản phải có ít nhất 5 ký tự"),
  address: z.string().min(10, "Vui lòng nhập địa chỉ chi tiết hơn"),
  type: z.nativeEnum(AssetType, {
    errorMap: () => ({ message: "Vui lòng chọn loại tài sản" }),
  }),
  estimatedValue: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().positive("Giá trị phải lớn hơn 0").optional(),
  ),
  acquisitionDate: z.string().optional(),
  notes: z.string().optional(),
  latitude: z.number({ required_error: "Chưa có tọa độ bản đồ" }),
  longitude: z.number({ required_error: "Chưa có tọa độ bản đồ" }),
  thumbnailUrl: z
    .string()
    .url("Link ảnh không hợp lệ")
    .optional()
    .or(z.literal("")),
});

export type AssetFormValues = z.infer<typeof assetFormSchema>;

// 2. Hàm gọi Nominatim (OpenStreetMap) để lấy tọa độ từ địa chỉ
export async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lon: number } | null> {
  try {
    // encodeURIComponent để xử lý khoảng trắng và tiếng Việt có dấu
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const response = await fetch(url, {
      headers: {
        // Nominatim yêu cầu User-Agent hợp lệ
        "User-Agent": "KGS-PropTech-App/1.0",
      },
    });

    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}
