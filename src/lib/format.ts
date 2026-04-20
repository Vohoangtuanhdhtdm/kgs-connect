import type { ListingMode } from "@/types/listing";

/**
 * Format a VND price.
 * - >= 1 tỷ → "X.X tỷ"
 * - >= 1 triệu → "XXX triệu"
 * Append "/tháng" when mode === "Rent".
 */
export function formatVnd(price: number, mode: ListingMode = "Sale"): string {
  let text: string;
  if (price >= 1_000_000_000) {
    const v = price / 1_000_000_000;
    text = `${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)} tỷ`;
  } else if (price >= 1_000_000) {
    text = `${Math.round(price / 1_000_000)} triệu`;
  } else {
    text = price.toLocaleString("vi-VN") + " đ";
  }
  return mode === "Rent" ? `${text}/tháng` : text;
}

export function formatArea(area: number): string {
  return `${area} m²`;
}
