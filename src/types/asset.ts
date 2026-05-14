export enum AssetType {
  Apartment = 0,
  House = 1,
  Land = 2,
  Commercial = 3,
  Other = 4,
}

export enum AssetStatus {
  Private = 0,
  ForRent = 1,
  ForSale = 2,
  Rented = 3,
  Sold = 4,
}

export interface UserAsset {
  id: string;
  userId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: AssetType;
  status: AssetStatus;
  estimatedValue?: number;
  acquisitionDate?: string;
  notes?: string;
  thumbnailUrl?: string;
  linkedPropertyId?: number; // int? map sang number
  createdAt: string;
  updatedAt: string;
}

// Request DTOs
export interface CreateAssetRequest {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: AssetType;
  estimatedValue?: number;
  acquisitionDate?: string;
  notes?: string;
  thumbnailUrl?: string;
}

export interface UpdateAssetRequest extends CreateAssetRequest {}

export interface PublishAssetRequest {
  listingPrice: number;
  publicTitle?: string;
  isForRent: boolean;
  city?: string;
  district?: string;
  ward?: string;
}
