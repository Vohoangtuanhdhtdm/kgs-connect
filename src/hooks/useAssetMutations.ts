// src/hooks/useAssetMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAssetStatus } from "@/services/assetApi";
import type { AssetStatus } from "@/types/asset";

export function useUpdateAssetStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AssetStatus }) =>
      updateAssetStatus(id, status),
    onSuccess: () => {
      // Tự động làm mới bảng Grid/List tài sản mà không cần F5
      queryClient.invalidateQueries({ queryKey: ["my-assets"] });
    },
    onError: (error) => {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      // Có thể thêm toast notification ở đây
    },
  });
}
