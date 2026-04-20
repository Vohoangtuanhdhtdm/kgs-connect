import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ValuationResult } from "@/pages/predict-home/IndexPredict";
import {
  TrendingUp,
  Loader2,
  BarChart3,
  Home,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";
// Đường dẫn này tùy thuộc vào cấu trúc thư mục của bạn

interface Props {
  result: ValuationResult | null;
  loading: boolean;
}

export const ResultCard = ({ result, loading }: Props) => {
  return (
    <Card className="sticky top-6 shadow-md border-border">
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <BarChart3 className="h-5 w-5 text-primary" />
          Kết quả định giá
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary/80" />
            <p className="text-sm font-medium animate-pulse">
              Hệ thống KGS đang phân tích dữ liệu...
            </p>
          </div>
        ) : result ? (
          <div className="space-y-5">
            {/* 1. Main Core Price */}
            <div className="rounded-xl border bg-card p-5 text-center shadow-sm">
              <div className="flex items-center justify-center gap-1 mb-2 text-muted-foreground">
                <Home className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-wider">
                  Giá trị cốt lõi
                </p>
              </div>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-primary">
                  {result.predicted_price_billion_vnd.toFixed(2)}
                </span>
                <span className="text-lg font-bold text-muted-foreground">
                  Tỷ VNĐ
                </span>
              </div>
            </div>

            {/* 2. Safe Transaction Range (Nổi bật) */}
            <div className="rounded-xl bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-5 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-2 text-green-700 dark:text-green-400">
                <ShieldCheck className="h-4 w-4" />
                <p className="text-xs font-bold uppercase tracking-wider">
                  Khoảng giá giao dịch an toàn
                </p>
              </div>
              <div className="flex items-baseline justify-center gap-1.5">
                <span className="text-2xl font-bold text-green-800 dark:text-green-300">
                  {result.safe_price_min.toFixed(2)}
                </span>
                <span className="text-lg font-medium text-green-600 dark:text-green-500">
                  -
                </span>
                <span className="text-2xl font-bold text-green-800 dark:text-green-300">
                  {result.safe_price_max.toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-green-700 dark:text-green-400 ml-1">
                  Tỷ VNĐ
                </span>
              </div>
            </div>

            {/* 3. Phụ trợ: Neighborhood Index & Insight */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center rounded-lg bg-muted/50 px-4 py-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Chỉ số khu vực:</span>
                </div>
                <span className="font-semibold text-foreground">
                  {result.applied_neighborhood_index.toFixed(2)} triệu/m²
                </span>
              </div>

              {/* Disclaimer/Insight */}
              <div className="flex items-start gap-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 px-4 py-3 text-xs text-blue-800 dark:text-blue-300">
                <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed italic">
                  <strong>Nhận định:</strong> Hệ thống KGS có độ trung lập rất
                  cao. Mức giá trên là cơ sở vững chắc để bạn tham khảo và
                  thương lượng.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 ring-1 ring-border">
              <Home className="h-7 w-7 text-muted-foreground/70" />
            </div>
            <p className="text-sm">Nhập thông tin bất động sản và nhấn</p>
            <p className="text-sm font-semibold text-foreground mt-1">
              "Định giá ngay"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
