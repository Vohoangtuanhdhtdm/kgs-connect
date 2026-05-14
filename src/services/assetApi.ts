// src/services/assetApi.ts

import { api } from "@/lib/api";
import type {
  UserAsset,
  PublishAssetRequest,
  AssetStatus,
} from "@/types/asset";

// 1. Lấy danh sách tài sản cá nhân
export async function fetchMyAssets(): Promise<UserAsset[]> {
  const { data } = await api.get<UserAsset[]>("/Assets");
  return data;
}

// 2. Lấy chi tiết 1 tài sản
export async function fetchAssetById(id: string): Promise<UserAsset> {
  const { data } = await api.get<UserAsset>(`/Assets/${id}`);
  return data;
}

// 3. Thêm mới tài sản (Đã đổi sang FormData và Multipart header)
export async function createAsset(payload: FormData): Promise<UserAsset> {
  const { data } = await api.post<UserAsset>("/Assets", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

// 4. Cập nhật tài sản (Đã đổi sang FormData và Multipart header)
export async function updateAsset(
  id: string,
  payload: FormData,
): Promise<UserAsset> {
  const { data } = await api.put<UserAsset>(`/Assets/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

// 5. Cập nhật nhanh trạng thái (Inline Dropdown)
export async function updateAssetStatus(
  id: string,
  status: AssetStatus,
): Promise<{ currentStatus: AssetStatus }> {
  const { data } = await api.put<{ currentStatus: AssetStatus }>(
    `/Assets/${id}/status`,
    { status },
  );
  return data;
}

// 6. Xóa tài sản
export async function deleteAsset(id: string): Promise<void> {
  await api.delete(`/Assets/${id}`);
}

// 7. PUBLISH - Đăng tin 1-Click
export async function publishAsset(
  id: string,
  payload: PublishAssetRequest,
): Promise<{ message: string; propertyId: number }> {
  const { data } = await api.post<{ message: string; propertyId: number }>(
    `/Assets/${id}/publish`,
    payload,
  );
  return data;
}
