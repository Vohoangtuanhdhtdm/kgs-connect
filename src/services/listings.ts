import { api, USE_MOCKS } from "@/lib/api";
import type {
  Listing,
  ListingFilters,
  PaginatedResponse,
} from "@/types/listing";

// 1. Lấy danh sách tin đăng công khai với filter & pagination
export async function fetchPublicListings(
  filters: ListingFilters,
): Promise<PaginatedResponse<Listing>> {
  const { data } = await api.get<PaginatedResponse<Listing>>(
    "/Properties/public-listings",
    {
      params: filters,
    },
  );
  return data;
}

// 2. Lấy chi tiết tin đăng
export async function fetchListingById(
  id: string,
): Promise<Listing | undefined> {
  const { data } = await api.get<Listing>(`/Properties/${id}`);
  return data;
}

// 3. Đăng tin mới (Member)
export async function submitListing(formData: FormData): Promise<Listing> {
  const { data } = await api.post<Listing>("/Properties", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// 4. Lấy danh sách tin cá nhân (Member Dashboard)
export async function fetchMyListings(): Promise<Listing[]> {
  const { data } = await api.get<Listing[]>("/Properties/my-listings");
  return data;
}

// 5. Admin lấy tin chờ duyệt
export async function fetchPendingListings(): Promise<Listing[]> {
  const { data } = await api.get<Listing[]>(
    "/Properties/admin/pending-listings",
  );
  return data;
}
