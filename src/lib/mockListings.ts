import type { Listing, PaginatedResponse, ListingFilters } from "@/types/listing";

const IMG = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1200&q=70`;

const seeds = [
  "photo-1568605114967-8130f3a36994",
  "photo-1502672260266-1c1ef2d93688",
  "photo-1600585154340-be6161a56a0c",
  "photo-1600596542815-ffad4c1539a9",
  "photo-1613490493576-7fde63acd811",
  "photo-1493809842364-78817add7ffb",
  "photo-1505691938895-1758d7feb511",
  "photo-1512917774080-9991f1c4c750",
  "photo-1600047509807-ba8f99d2cdde",
  "photo-1598228723793-52759bba239c",
];

const cities = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Hải Phòng", "Cần Thơ"];
const districts: Record<string, string[]> = {
  "Hồ Chí Minh": ["Quận 1", "Quận 3", "Quận 7", "Bình Thạnh", "Thủ Đức"],
  "Hà Nội": ["Ba Đình", "Hoàn Kiếm", "Cầu Giấy", "Tây Hồ"],
  "Đà Nẵng": ["Hải Châu", "Sơn Trà", "Ngũ Hành Sơn"],
  "Hải Phòng": ["Lê Chân", "Hồng Bàng"],
  "Cần Thơ": ["Ninh Kiều", "Cái Răng"],
};

const types: Listing["propertyType"][] = [
  "Apartment",
  "House",
  "Villa",
  "Townhouse",
  "Land",
  "Office",
];
const dirs: Listing["houseDirection"][] = [
  "East",
  "West",
  "South",
  "North",
  "SouthEast",
];

function rand<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

export const MOCK_LISTINGS: Listing[] = Array.from({ length: 36 }).map((_, i) => {
  const city = rand(cities, i);
  const dList = districts[city];
  const mode = i % 4 === 0 ? "Rent" : "Sale";
  const price =
    mode === "Rent"
      ? (5 + (i % 25)) * 1_000_000
      : (1 + (i % 12)) * 1_000_000_000 + (i % 10) * 100_000_000;
  return {
    id: `L-${1000 + i}`,
    title:
      mode === "Rent"
        ? `Cho thuê ${rand(types, i)} ${i + 1} tại ${city}`
        : `Bán ${rand(types, i)} cao cấp ${city} - mã ${i + 1}`,
    description:
      "Vị trí đắc địa, thiết kế hiện đại, đầy đủ tiện ích nội khu, gần trường học, bệnh viện và trung tâm thương mại.",
    price,
    mode,
    city,
    district: rand(dList, i),
    ward: `Phường ${1 + (i % 12)}`,
    addressDetail: `${10 + i} Đường Nguyễn Huệ`,
    area: 45 + ((i * 7) % 180),
    frontage: 4 + (i % 6),
    propertyType: rand(types, i),
    floors: 1 + (i % 5),
    bedrooms: 1 + (i % 5),
    bathrooms: 1 + (i % 4),
    houseDirection: rand(dirs, i),
    legalStatus: i % 3 === 0 ? "RedBook" : "PinkBook",
    furnitureState: i % 2 === 0 ? "Full" : "Basic",
    img: [IMG(rand(seeds, i)), IMG(rand(seeds, i + 1)), IMG(rand(seeds, i + 2))],
    status: "Approved",
    agentName: "Nguyễn Văn An",
    agentPhone: "0901 234 567",
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  };
});

export function mockPublicListings(
  filters: ListingFilters
): PaginatedResponse<Listing> {
  const pageSize = filters.pageSize ?? 9;
  const page = filters.page ?? 1;
  let data = [...MOCK_LISTINGS];
  if (filters.city) data = data.filter((l) => l.city === filters.city);
  if (filters.propertyType)
    data = data.filter((l) => l.propertyType === filters.propertyType);
  if (filters.minPrice != null) data = data.filter((l) => l.price >= filters.minPrice!);
  if (filters.maxPrice != null) data = data.filter((l) => l.price <= filters.maxPrice!);
  if (filters.minArea != null) data = data.filter((l) => l.area >= filters.minArea!);
  if (filters.maxArea != null) data = data.filter((l) => l.area <= filters.maxArea!);

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = (page - 1) * pageSize;
  return {
    totalItems,
    totalPages,
    currentPage: page,
    data: data.slice(start, start + pageSize),
  };
}
