export type ListingStatus = "Approved" | "Pending" | "Rejected";

export type PropertyType =
  | "Apartment"
  | "House"
  | "Villa"
  | "Townhouse"
  | "Land"
  | "Office";

export type HouseDirection =
  | "East"
  | "West"
  | "South"
  | "North"
  | "NorthEast"
  | "NorthWest"
  | "SouthEast"
  | "SouthWest";

export type LegalStatus = "RedBook" | "PinkBook" | "SaleContract" | "Pending";
export type FurnitureState = "Full" | "Basic" | "None";
export type ListingMode = "Sale" | "Rent";

export interface Listing {
  id: string;
  title: string;
  description?: string;
  price: number;
  mode?: ListingMode;
  city: string;
  district: string;
  ward?: string;
  addressDetail?: string;
  area: number;
  frontage?: number;
  propertyType: PropertyType;
  floors?: number;
  bedrooms?: number;
  bathrooms?: number;
  houseDirection?: HouseDirection;
  legalStatus?: LegalStatus;
  furnitureState?: FurnitureState;
  img: string[];
  status?: ListingStatus;
  createdAt?: string;
  agentName?: string;
  agentPhone?: string;
}

export interface PaginatedResponse<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  data: T[];
}

export interface ListingFilters {
  keyword?: string;
  city?: string;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  page?: number;
  pageSize?: number;
}
