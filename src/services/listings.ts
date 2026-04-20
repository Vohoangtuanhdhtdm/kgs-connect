import { api, USE_MOCKS } from "@/lib/api";
import { mockPublicListings, MOCK_LISTINGS } from "@/lib/mockListings";
import type {
  Listing,
  ListingFilters,
  PaginatedResponse,
} from "@/types/listing";

export async function fetchPublicListings(
  filters: ListingFilters
): Promise<PaginatedResponse<Listing>> {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 350));
    return mockPublicListings(filters);
  }
  const { data } = await api.get<PaginatedResponse<Listing>>("/public-listings", {
    params: filters,
  });
  return data;
}

export async function fetchListingById(id: string): Promise<Listing | undefined> {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_LISTINGS.find((l) => l.id === id);
  }
  const { data } = await api.get<Listing>(`/public-listings/${id}`);
  return data;
}

export async function submitListing(formData: FormData): Promise<Listing> {
  if (USE_MOCKS) {
    await new Promise((r) => setTimeout(r, 700));
    return {
      id: `L-${Math.floor(Math.random() * 9000) + 1000}`,
      title: String(formData.get("Title") ?? "Untitled"),
      price: Number(formData.get("Price") ?? 0),
      city: String(formData.get("City") ?? ""),
      district: String(formData.get("District") ?? ""),
      area: Number(formData.get("Area") ?? 0),
      propertyType: (formData.get("PropertyType") as Listing["propertyType"]) ?? "House",
      img: [],
      status: "Pending",
    };
  }
  const { data } = await api.post<Listing>("/listings", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
