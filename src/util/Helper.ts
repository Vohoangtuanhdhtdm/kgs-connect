// Hàm hỗ trợ format tiền tệ
export const formatVnd = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
