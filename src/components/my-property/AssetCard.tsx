import React from "react";
import { MapPin, Building, Edit, UploadCloud } from "lucide-react";
import { AssetStatus, UserAsset } from "@/types/asset";
import { useUpdateAssetStatus } from "@/hooks/useAssetMutations"; // Hook TanStack Query đã tạo ở trên

const statusConfig = {
  [AssetStatus.Private]: { label: "Riêng tư", color: "bg-gray-600 text-white" },
  [AssetStatus.ForRent]: {
    label: "Cho thuê",
    color: "bg-green-500 text-white",
  },
  [AssetStatus.ForSale]: {
    label: "Rao bán",
    color: "bg-orange-500 text-white",
  },
  [AssetStatus.Rented]: {
    label: "Đã cho thuê",
    color: "bg-blue-500 text-white",
  },
  [AssetStatus.Sold]: { label: "Đã bán", color: "bg-purple-500 text-white" },
};

interface AssetCardProps {
  asset: UserAsset;
  onPublishClick: (asset: UserAsset) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  onPublishClick,
}) => {
  const { mutate: updateStatus, isPending } = useUpdateAssetStatus();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateStatus({
      id: asset.id,
      status: Number(e.target.value) as AssetStatus,
    });
  };

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Thumbnail */}
      <div className="h-48 bg-slate-200 relative">
        {asset.thumbnailUrl ? (
          <img
            src={asset.thumbnailUrl}
            alt={asset.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            <Building size={48} />
          </div>
        )}

        {/* Status Dropdown (Nổi trên ảnh) */}
        <div className="absolute top-3 left-3">
          <select
            value={asset.status}
            onChange={handleStatusChange}
            disabled={isPending}
            className={`text-sm font-semibold px-3 py-1 rounded-full appearance-none cursor-pointer border-2 border-white/20 backdrop-blur-sm focus:outline-none ${statusConfig[asset.status].color}`}
          >
            {Object.entries(statusConfig).map(([val, config]) => (
              <option key={val} value={val} className="bg-slate-800 text-white">
                {config.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-bold text-lg text-slate-900 dark:text-white truncate"
          title={asset.name}
        >
          {asset.name}
        </h3>
        <p className="text-slate-500 text-sm flex items-start gap-1 mt-1">
          <MapPin size={16} className="shrink-0 mt-0.5" />
          <span className="line-clamp-2">{asset.address}</span>
        </p>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400">Giá trị ước tính</p>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">
              {asset.estimatedValue
                ? `${asset.estimatedValue.toLocaleString("vi-VN")} ₫`
                : "Chưa cập nhật"}
            </p>
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Edit size={18} />
            </button>
            {/* Nút 1-Click Publish */}
            {!asset.linkedPropertyId && (
              <button
                onClick={() => onPublishClick(asset)}
                className="p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1"
                title="Đăng tin công khai"
              >
                <UploadCloud size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
