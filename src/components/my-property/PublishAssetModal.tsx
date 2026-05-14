import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishAsset } from "@/services/assetApi";
import { PublishAssetRequest, UserAsset } from "@/types/asset";

// 1. Zod Schema cho form Publish
const publishSchema = z.object({
  publicTitle: z
    .string()
    .min(10, "Tiêu đề tin đăng cần chi tiết hơn (ít nhất 10 ký tự)"),
  listingPrice: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number({ required_error: "Vui lòng nhập giá" })
      .positive("Giá phải lớn hơn 0"),
  ),
  isForRent: z.boolean(),
  city: z.string().min(1, "Bắt buộc chọn Tỉnh/Thành"),
  district: z.string().min(1, "Bắt buộc chọn Quận/Huyện"),
  ward: z.string().min(1, "Bắt buộc chọn Phường/Xã"),
});

type PublishFormValues = z.infer<typeof publishSchema>;

interface PublishAssetModalProps {
  asset: UserAsset;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PublishAssetModal: React.FC<PublishAssetModalProps> = ({
  asset,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  // Khởi tạo form với giá trị pre-fill từ Asset
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PublishFormValues>({
    resolver: zodResolver(publishSchema),
    defaultValues: {
      publicTitle: `Bán/Cho thuê ${asset.name}`, // Tự động mồi sẵn tiêu đề
      isForRent: false,
      listingPrice: asset.estimatedValue || undefined, // Gợi ý luôn bằng giá ước tính
      // Ở thực tế, bạn có thể map từ một hàm parse địa chỉ để bóc tách City/District ra
      city: "",
      district: "",
      ward: "",
    },
  });

  // 1. Đổi kiểu dữ liệu nhận vào của mutationFn thành PublishAssetRequest chuẩn
  const { mutate: doPublish, isPending } = useMutation({
    mutationFn: (payload: PublishAssetRequest) =>
      publishAsset(asset.id, payload),
    onSuccess: (res) => {
      // Làm mới danh sách tài sản
      queryClient.invalidateQueries({ queryKey: ["my-assets"] });
      alert(res.message);
      if (onSuccess) onSuccess();
      onClose();
    },
    onError: (error: any) => {
      alert(error?.response?.data?.message || "Có lỗi xảy ra khi đăng tin.");
    },
  });

  // 2. Map dữ liệu tường minh trước khi gọi API
  const onSubmit = (data: PublishFormValues) => {
    const payload: PublishAssetRequest = {
      // Dùng "as number" vì Zod đã đảm bảo biến này là số hợp lệ tại thời điểm này
      listingPrice: data.listingPrice as number,

      publicTitle: data.publicTitle,

      // Xử lý cẩn thận kiểu boolean từ <select> form
      // Vì HTML <select> thường trả về string ("true"/"false"), ta ép kiểu chắc chắn về boolean
      isForRent: String(data.isForRent) === "true",

      city: data.city,
      district: data.district,
      ward: data.ward,
    };

    doPublish(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Đăng tin rao bán / cho thuê
          </h2>
          <p className="text-sm text-slate-500 mt-1">Tài sản: {asset.name}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Tiêu đề tin đăng (Hiển thị công khai)
            </label>
            <input
              {...register("publicTitle")}
              className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
            />
            {errors.publicTitle && (
              <p className="text-red-500 text-xs mt-1">
                {errors.publicTitle.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Loại hình
              </label>
              <select
                {...register("isForRent")}
                className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
              >
                <option value="false">Rao bán</option>
                <option value="true">Cho thuê</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Giá công khai (VNĐ)
              </label>
              <input
                type="number"
                {...register("listingPrice")}
                className="w-full px-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
              />
              {errors.listingPrice && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.listingPrice.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t pt-4 mt-2 border-slate-100 dark:border-slate-800">
            {/* LƯU Ý: Ở dự án thực tế, chỗ này nên dùng thẻ <select> kết nối với API Tỉnh thành Việt Nam */}
            <div>
              <label className="block text-xs font-medium mb-1">
                Tỉnh / Thành
              </label>
              <input
                {...register("city")}
                className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-slate-800"
                placeholder="VD: Hà Nội"
              />
              {errors.city && (
                <p className="text-red-500 text-[10px] mt-1">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Quận / Huyện
              </label>
              <input
                {...register("district")}
                className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-slate-800"
                placeholder="VD: Đống Đa"
              />
              {errors.district && (
                <p className="text-red-500 text-[10px] mt-1">
                  {errors.district.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Phường / Xã
              </label>
              <input
                {...register("ward")}
                className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-slate-800"
                placeholder="VD: Láng Hạ"
              />
              {errors.ward && (
                <p className="text-red-500 text-[10px] mt-1">
                  {errors.ward.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 font-medium"
            >
              {isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              Xuất bản tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
