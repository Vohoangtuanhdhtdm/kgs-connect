import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyAssets } from "@/services/assetApi";

import { Plus } from "lucide-react";
import { AssetCard } from "@/components/my-property/AssetCard";
import { AssetMap } from "@/components/my-property/AssetMap";
import { UserAsset } from "@/types/asset";
import { PublishAssetModal } from "@/components/my-property/PublishAssetModal";
import { useNavigate } from "react-router";

export default function MyAssetsDashboard() {
  const [assetToPublish, setAssetToPublish] = useState<UserAsset | null>(null);
  const navigate = useNavigate();
  // Fetch dữ liệu bằng TanStack Query
  const {
    data: assets = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-assets"],
    queryFn: fetchMyAssets,
  });

  if (isLoading)
    return (
      <div className="p-8 text-center text-slate-500">
        Đang tải danh mục tài sản...
      </div>
    );
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">
        Lỗi khi tải dữ liệu. Vui lòng thử lại.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Danh Mục Tài Sản
          </h1>
          <p className="text-slate-500 mt-1">
            Quản lý riêng tư và định giá danh mục đầu tư của bạn.
          </p>
        </div>
        <button
          onClick={() => navigate("/my-property/add")}
          className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          <span>Thêm Tài Sản</span>
        </button>
      </div>

      {/* Main Layout: 2 Cột (Grid Card bên trái, Map bên phải) */}
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
        {/* Cột trái: Danh sách thẻ */}
        <div className="w-full lg:w-3/5 overflow-y-auto pr-2 pb-10 space-y-4">
          {assets.length === 0 ? (
            <div className="text-center p-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-slate-500">
                Bạn chưa có tài sản nào trong danh mục.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  onPublishClick={(clickedAsset) => {
                    setAssetToPublish(clickedAsset);
                  }}
                />
              ))}
              {/* Render Modal ở cuối Component */}
              {assetToPublish && (
                <PublishAssetModal
                  asset={assetToPublish}
                  onClose={() => setAssetToPublish(null)}
                />
              )}
            </div>
          )}
        </div>

        {/* Cột phải: Mini-map cố định (Sticky) */}
        <div className="w-full lg:w-2/5 h-[400px] lg:h-full sticky top-4 rounded-xl shadow-sm">
          <AssetMap assets={assets} />
        </div>
      </div>
    </div>
  );
}
