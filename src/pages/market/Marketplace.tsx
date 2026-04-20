import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { FilterSidebar } from "@/components/marketplace/FilterSidebar";
import { PropertyCard } from "@/components/marketplace/PropertyCard";
import { PropertyCardSkeleton } from "@/components/marketplace/PropertyCardSkeleton";
import { fetchPublicListings } from "@/services/listings";
import { ListingFilters } from "@/types/listing";

const PAGE_SIZE = 9;

// Hàm hỗ trợ rút gọn Pagination (Hiển thị dạng: 1 2 3 ... 10)
const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
  if (currentPage >= totalPages - 3)
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export default function Marketplace() {
  const [filters, setFilters] = useState<ListingFilters>({
    page: 1,
    pageSize: PAGE_SIZE,
  });

  // State cục bộ cho thanh tìm kiếm (chỉ cập nhật filter khi submit)
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["public-listings", filters],
    queryFn: () => fetchPublicListings(filters),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 1;
  const currentPage = filters.page ?? 1;

  const goTo = (p: number) =>
    setFilters((f) => ({ ...f, page: Math.max(1, Math.min(totalPages, p)) }));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({
      ...prev,
      keyword: searchInput,
      page: 1, // Luôn reset về trang 1 khi tìm kiếm mới
    }));
  };

  const paginationItems = generatePagination(currentPage, totalPages);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container py-8">
          <p className="max-w-2xl text-sm text-blue-100 md:text-base">
            Khám phá hàng nghìn bất động sản đã được xác minh trên khắp Việt Nam
            — minh bạch, nhanh chóng, đáng tin cậy.
          </p>

          {/* Bọc bằng Form để hỗ trợ submit bằng phím Enter */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-6 flex max-w-lg items-center gap-2 rounded-full bg-white p-1.5 shadow-md focus-within:ring-2 focus-within:ring-blue-500/50 transition-all"
          >
            <Search className="ml-3 h-5 w-5 text-gray-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Nhập thành phố, quận, dự án..."
              className="flex-1 bg-transparent px-2 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
            <Button type="submit" size="sm" className="rounded-full px-6">
              Tìm kiếm
            </Button>
          </form>
        </div>
      </section>

      <div className="container grid gap-6 py-8 lg:grid-cols-[280px_1fr]">
        <FilterSidebar value={filters} onChange={setFilters} />

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                Tin đăng nổi bật
                {isFetching && !isLoading && (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                )}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isLoading
                  ? "Đang tải dữ liệu..."
                  : `${data?.totalItems ?? 0} kết quả phù hợp`}
              </p>
            </div>
          </div>

          {isError && (
            <div className="mb-6 flex flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
              <p>
                Không thể tải danh sách bất động sản. Vui lòng kiểm tra lại kết
                nối.
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Thử lại
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <PropertyCardSkeleton key={i} />
                ))
              : data?.data.map((l) => <PropertyCard key={l.id} listing={l} />)}
          </div>

          {!isLoading && !isError && data?.data.length === 0 && (
            <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12 text-center text-gray-500">
              <Search className="mb-4 h-10 w-10 opacity-20" />
              <p className="text-base font-medium text-gray-900">
                Không tìm thấy kết quả
              </p>
              <p className="text-sm">
                Vui lòng thử điều chỉnh lại từ khóa hoặc bộ lọc của bạn.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchInput("");
                  setFilters({ page: 1, pageSize: PAGE_SIZE });
                }}
              >
                Xóa bộ lọc
              </Button>
            </div>
          )}

          {/* Pagination thông minh */}
          {totalPages > 1 && !isLoading && !isError && (
            <div className="mt-10 flex items-center justify-center gap-1.5 sm:gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {paginationItems.map((item, index) => {
                if (item === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-gray-500"
                    >
                      ...
                    </span>
                  );
                }
                const p = item as number;
                return (
                  <Button
                    key={p}
                    variant={p === currentPage ? "default" : "outline"}
                    size="sm"
                    className="min-w-9"
                    onClick={() => goTo(p)}
                  >
                    {p}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="icon"
                onClick={() => goTo(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
